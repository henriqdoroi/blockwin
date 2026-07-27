# Especificação do jogo de blocos

## Princípios

Jogo original e determinístico, sem copiar código ou ativos de terceiros. O backend
é autoritativo. Seed, catálogo, tray, tabuleiro, ganho, resultado e saldo nunca são
aceitos do navegador. A geração não depende de usuário, depósito, saque,
influenciador, dispositivo, saldo ou resultado anterior.

## Configuração sandbox 1.0.0

```text
boardSize = 8
traySize = 3
minBetCents = 500
maxBetCents = 10000
ratePerLine = 0.10
targetMultiplier = 2
initialAccumulatedCents = 0
maxPayoutMultiplier = 10
engineVersion = 1.0.0
```

`targetCents = round(betCents × targetMultiplier)`.

Cada movimento calcula:

```text
baseGainCents = round(betCents × ratePerLine × clearedLineCount)
accumulatedCents = min(accumulatedCents + baseGainCents,
                       betCents × maxPayoutMultiplier)
```

Combo é somente visual na versão inicial.

## Tabuleiro e peças

- Matriz 8×8 com `0` para vazio e `colorId` positivo para ocupado.
- Catálogo original de coordenadas relativas, imutável e versionado.
- Três peças são geradas por lote a partir de `seed + rngCursor`.
- Peças não giram; cada posição informa `width`, `height`, cor e disponibilidade.
- Um lote novo nasce somente quando as três peças atuais foram usadas.

## Movimento

O usuário arrasta com Pointer Events. A interface calcula preview local, mas envia
somente `pieceIndex`, `row`, `col`, `sequence` e `idempotencyKey`. É válido quando a
sessão está ativa, a sequência é a esperada, a peça está disponível, todas as
células estão dentro do tabuleiro e vazias.

Após posicionar, linhas e colunas completas são detectadas sobre o mesmo tabuleiro e
limpas simultaneamente. O ganho usa a quantidade total de linhas e colunas limpas.

## Cashout e continuação

Cashout fica disponível quando `status=ACTIVE` e
`accumulatedCents >= targetCents`. O jogador pode resgatar ou continuar até o teto
configurado. Cashout muda o estado uma única vez, credita o ledger e libera a entrada
reservada na mesma transação.

## Fim de jogo

Depois de cada movimento e renovação de tray, o motor testa todas as peças ainda
disponíveis em todas as posições. Se nenhuma couber, a sessão muda para `LOST`. A
entrada reservada é liquidada sem prêmio. Abandono explícito produz `FORFEITED`.

## Estados

- `ACTIVE`: aceita movimentos e, se elegível, cashout.
- `LOST`: nenhuma peça cabe; terminal.
- `CASHED_OUT`: prêmio liquidado; terminal.
- `FORFEITED`: abandono liquidado; terminal.
- `INVALID`: replay inconsistente; terminal e auditável.

## Determinismo e replay

A mesma versão, configuração, seed e sequência válida deve produzir exatamente os
mesmos trays, tabuleiros, linhas, ganhos e estado. O replay começa vazio, regenera as
peças e aplica movimentos em ordem, recusando divergência de piece index, sequência,
nonce/idempotência ou resultado.

## Segurança

- locks de linha para sessão e carteira;
- unicidade de `(gameId, sequence)` e `(gameId, idempotencyKey)`;
- ownership em toda consulta;
- limites inteiros e schemas estritos;
- settlement idempotente e ledger obrigatório;
- config e engine version congeladas na sessão;
- nenhum RNG adaptado ao jogador;
- somente créditos sandbox nesta fase.
