# Arquitetura atual

## Escopo da análise

Análise realizada na branch `feature/block-game`. Nenhum arquivo de produção foi
alterado nesta etapa. A pasta `references/block-game/` foi criada, porém os oito
arquivos esperados (`Game-reference.js` e sete capturas) ainda não foram fornecidos.
O contrato descrito pelo solicitante foi documentado, mas não tratado como código
fonte nem importado.

## Stack e build

- Frontend legado: SPA React/React Router distribuída apenas como bundles
  minificados em `assets/index-*.js` e `assets/vendor-*.js`; os fontes React,
  `package.json` original e sourcemaps não existem.
- Painel novo: HTML/CSS/JavaScript sem framework em `painel.html`,
  `assets/player-panel.css` e `assets/player-panel.js`.
- Backend ativo para Railway: Node.js 22, Fastify 5, `pg`, Zod, Argon2 e JOSE.
- Banco Railway: PostgreSQL, migration SQL própria e executor sob advisory lock.
- Backend alternativo: Edge Function e migration Supabase ainda versionadas. Há dois
  backends concorrentes no checkout; para esta feature, Railway/PostgreSQL é a
  implementação canônica.
- Deploy: Dockerfile, `railway.json` e workflow GitHub Actions.

## Estrutura relevante

```text
assets/                         bundles legados e painel sem framework
painel.html                     shell do painel autenticado
server/src/index.js             API Fastify monolítica
server/src/migrate.js           executor de migrations
server/migrations/001_initial.sql
supabase/                       implementação alternativa, não canônica
scripts/railway-deploy.sh       deploy Railway
.github/workflows/              automação de deploy
```

Não existem `src/game-engine`, componentes React-fonte, runner de testes, lint,
typecheck TypeScript ou testes E2E.

## Autenticação e estado

O backend Railway oferece cadastro/login por telefone, hash Argon2id, access JWT de
15 minutos em cookie HttpOnly, refresh token opaco/rotativo persistido em
`user_sessions`, logout e revogação. O hook Fastify autentica `/api/*` privada e
carrega o usuário ativo.

O painel mantém em memória usuário, saldo, configuração, entrada e sheet ativo. Ele
busca `GET /api/panel/bootstrap`, com fallback para `/api/auth/me` e
`/api/public/config`. O saldo do browser é apenas uma projeção do backend.

## Banco e modelos atuais

A migration Railway contém `users`, `user_sessions`, `wallets`,
`wallet_transactions`, `platform_settings`, `game_tiers`, `deposits`,
`withdrawals`, `referral_level_configs`, `referral_commissions`, `game_sessions` e
`admin_audit_logs`. `game_sessions` armazena somente metadados básicos; não há
board/tray/cursor/sequence/accumulated, movimentos ou resultados completos.

## Rotas atuais de jogo

Somente `POST /api/game/start` existe no backend Railway. Ele valida tier/saldo,
reserva entrada, gera seed e cria sessão. Não existem config, active, move, cashout,
forfeit ou history autoritativos. O painel redireciona para `#jogo`, mas não renderiza
um tabuleiro.

## Estilos e componentes

O painel usa tema azul-marinho, grade, lobby, menu fixo e bottom sheets acessíveis.
A aplicação React original não possui fontes reutilizáveis; portanto a futura
interface deve ser integrada ao painel atual ou, se os fontes forem recuperados,
construída no React existente sem importar bundles minificados.

## Variáveis de ambiente

Obrigatórias no Railway: `DATABASE_URL`, `JWT_SECRET`, `PIX_ENCRYPTION_KEY`,
`APP_URL`, `PLATFORM_MODE=sandbox`, `NODE_ENV`, `TRUST_PROXY` e
`ALLOW_SANDBOX_APPROVAL`. O backend valida os três segredos críticos ao iniciar.

## Testes e comandos reais

Hoje existe apenas `npm run check`, que executa `node --check` no servidor, migrador
e painel. Não há dependências de teste nem CI de banco. Comandos aplicáveis:

```bash
npm run check
node --test
node server/src/migrate.js
```

`node --test` passará a ser usado na etapa do motor, sem dependências externas.

## Riscos

1. Código Fastify concentrado em um arquivo dificulta testes e composição.
2. Dois backends versionados podem divergir; Railway deve ser declarado canônico.
3. Não há lockfile porque o registry estava bloqueado no ambiente anterior.
4. A migration inicial não possui estado suficiente para replay.
5. A entrada é reservada, mas ainda não existe settlement; partidas atuais podem
   deixar saldo reservado.
6. A interface React solicitada não pode ser criada fielmente sem seus fontes.
7. As referências obrigatórias estão ausentes.
8. Regras envolvendo créditos sandbox exigem testes de concorrência PostgreSQL.
