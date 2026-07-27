# Bloco Play

Plataforma com painel autenticado e backend sandbox para Railway/PostgreSQL.

- Painel: `painel.html`
- Backend Railway: `server/src/index.js`
- Migration PostgreSQL: `server/migrations/001_initial.sql`
- Deploy Railway: `docs/railway-backend.md`
- Análise arquitetural: `docs/player-panel-analysis.md`
- Implementação Supabase anterior: `docs/supabase-backend.md`

O backend inicia exclusivamente em `PLATFORM_MODE=sandbox`; nenhuma transferência
PIX real é implementada. Para Railway, siga `docs/railway-backend.md`.
