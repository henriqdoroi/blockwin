# Contrato HTTP do jogo

Todas as rotas são privadas, usam cookie HttpOnly, retornam JSON e exigem
`X-Requested-With: XMLHttpRequest` nas mutações.

## Estado público da sessão

```ts
interface GamePiece {
  id: string;
  cells: Array<[number, number]>;
  width: number;
  height: number;
  colorId: number;
  available: boolean;
}
interface GameSession {
  id: string;
  status: "ACTIVE" | "LOST" | "CASHED_OUT" | "FORFEITED" | "INVALID";
  betCents: number;
  accumulatedCents: number;
  targetCents: number;
  progress: number;
  board: number[][];
  tray: GamePiece[];
  rngCursor: number;
  moveSequence: number;
  engineVersion: string;
  configVersion: string;
  startedAt: string;
  finishedAt: string | null;
}
```

`userId` e `seed` permanecem no modelo server-side e não precisam ser expostos ao
cliente.

## Endpoints

### `GET /api/game/config`

Retorna configuração pública versionada e tiers habilitados. Não retorna seed nem
segredos.

### `GET /api/game/active`

Retorna `{ session: GameSession | null }`.

### `POST /api/game/start`

Entrada: `{ betCents, idempotencyKey }`. Para compatibilidade temporária, o servidor
pode aceitar `entryAmountCents`, mas a resposta e os novos clientes usam
`betCents`. Retorna `{ session }` com status 201. Repetição da mesma chave devolve a
mesma sessão; uma chave nova com sessão ativa retorna 409.

### `POST /api/game/:id/move`

Entrada estrita:

```ts
{ pieceIndex: 0 | 1 | 2; row: number; col: number;
  sequence: number; idempotencyKey: string }
```

Resposta:

```ts
{ session: GameSession; clearedRows: number[]; clearedCols: number[];
  gainedCents: number; gameOver: boolean }
```

Movimento duplicado com a mesma chave retorna a resposta persistida. Sequência ou
chave conflitante retorna 409. Sessão alheia retorna 404 para não vazar existência.

### `POST /api/game/:id/cashout`

Entrada: `{ idempotencyKey }`. Exige meta atingida. Retorna sessão terminal, saldo e
transação. Repetição não cria crédito adicional.

### `POST /api/game/:id/forfeit`

Entrada: `{ idempotencyKey }`. Liquida a entrada sem recompensa e retorna sessão.

### `GET /api/game/history`

Paginação por cursor, limite máximo 50. Retorna apenas sessões do usuário.

## Erros

Formato `{ error: { code, message } }`. Códigos: `UNAUTHORIZED`,
`INVALID_GAME_TIER`, `INSUFFICIENT_BALANCE`, `ACTIVE_GAME_EXISTS`, `GAME_NOT_FOUND`,
`GAME_NOT_ACTIVE`, `SEQUENCE_CONFLICT`, `MOVE_DUPLICATE_CONFLICT`, `INVALID_PIECE`,
`INVALID_PLACEMENT`, `CASHOUT_NOT_AVAILABLE` e `ENGINE_VERSION_UNSUPPORTED`.
