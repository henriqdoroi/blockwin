# Plano de banco para o jogo autoritativo

## Estratégia

Criar uma nova migration Railway aditiva. Não editar `001_initial.sql` depois de
implantada. Manter dinheiro em centavos (`bigint`) e mudanças de carteira no mesmo
`BEGIN/COMMIT` da mudança terminal da partida.

## Alterações em `game_sessions`

- normalizar status para `ACTIVE/LOST/CASHED_OUT/FORFEITED/INVALID`;
- `bet_cents`, `accumulated_cents`, `target_cents`;
- `board jsonb`, `tray jsonb` com checks estruturais no serviço;
- `rng_cursor`, `move_sequence`;
- `engine_version`, `config_version` congeladas;
- `finished_at`, `settlement_transaction_id`;
- constraint única parcial de sessão ativa por usuário;
- constraint de valores não negativos.

Seed deve ficar criptografada ou restrita ao servidor. A API nunca a serializa.

## `game_moves`

- `id`, `game_id`, `sequence`, `piece_index`, `row`, `col`;
- `idempotency_key`, `request_hash`;
- `cleared_rows`, `cleared_cols`, `gained_cents`;
- snapshot/hash oficial pós-movimento e timestamps;
- unique `(game_id, sequence)` e `(game_id, idempotency_key)`.

## `game_results`

Registro 1:1 terminal com status, score/linhas, acumulado, payout, duração,
`replay_hash`, engine/config version e timestamps. Unique `game_id` impede resultado
duplicado.

## Configuração

Persistir `game_configs` versionadas em vez de sobrescrever valores. Sessions
referenciam a versão. Campos: dimensões, tray size, rate por linha,
multiplicadores, limites, catálogo permitido e engine version.

## Transações

### Start

Lock wallet → validar saldo → criar sessão → mover disponível para reservado →
ledger `GAME_ENTRY_RESERVE`.

### Move

Lock session → validar ownership/status/sequence → reproduzir motor → inserir move →
atualizar snapshot. Se perdeu: criar resultado → reduzir reservado → completar
ledger de entrada.

### Cashout

Lock session + wallet → validar meta → transição condicional para `CASHED_OUT` →
reduzir reservado → creditar acumulado → completar entrada e criar
`GAME_REWARD`. Guardar IDs no resultado. Retry lê o resultado existente.

### Forfeit

Mesmo lock; transição para `FORFEITED`, reduz reservado e conclui a entrada sem
crédito.

## Índices e retenção

Índices por `(user_id, started_at desc)`, status, game/sequence, idempotency e
settlement. Moves e auditorias são imutáveis. Não persistir telemetria sensível sem
necessidade e definir política de retenção antes da produção.
