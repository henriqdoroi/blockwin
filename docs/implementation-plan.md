# Plano incremental do jogo

## Pré-condições

1. Adicionar os arquivos reais a `references/block-game/`.
2. Obter/confirmar fontes React se a interface precisar ser React; o checkout atual
   contém apenas o bundle legado e painel vanilla.
3. Instalar dependências e gerar lockfile em ambiente com acesso ao registry.
4. Disponibilizar PostgreSQL descartável para testes de integração.

## Etapa 1 — análise (esta alteração)

Documentação, contrato, dados, riscos e instruções permanentes. Nenhum arquivo de
produção alterado.

## Etapa 2 — motor compartilhado

Criar módulos pequenos em `src/game-engine/` sem React/API/banco. Como o projeto é
JavaScript, usar ESM + JSDoc ou introduzir TypeScript de forma mínima e isolada
somente após confirmar toolchain. Testar catálogo, RNG, placement, limpeza
simultânea, recompensa, movimentos disponíveis, game over e replay com `node:test`.
Commit exclusivo.

## Etapa 3 — migration e repositório

Adicionar `002_authoritative_game.sql`, repositório transacional e mapeadores.
Testar constraints, índices, locks e idempotência em PostgreSQL real. Commit
exclusivo.

## Etapa 4 — serviço autoritativo e APIs

Integrar o motor ao Fastify em módulos `server/src/game/`. Implementar config,
active, start, move, cashout, forfeit e history. Testar partida alheia, concorrência,
duplicatas, saldo, settlement e replay adulterado. Commit exclusivo.

## Etapa 5 — interface dentro de `/painel`

Criar tela do jogo sem nova rota, Pointer Events, HUD, board, tray, ghost, preview,
animações e resultado. O cliente sempre substitui preview pelo estado oficial e
ressincroniza em erros. Adicionar testes de componente/E2E conforme a stack que for
recuperada. Commit exclusivo.

## Etapa 6 — hardening e operação

Testes de carga/concorrência, observabilidade, migração Railway em staging, rollback,
auditoria de segurança/acessibilidade e revisão legal. Somente sandbox.

## Critérios para avançar entre etapas

- diff pequeno e revisável;
- nenhum erro de lint/typecheck/test/build aplicável;
- migration aditiva e testada;
- nenhum saldo fora do ledger;
- nenhum estado oficial aceito do cliente;
- documentação e contrato atualizados;
- commit separado por etapa.
