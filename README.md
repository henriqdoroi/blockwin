# Bloco Play

Interface do painel autenticado e backend sandbox baseado em Supabase.

- Painel: `painel.html`
- Análise arquitetural: `docs/player-panel-analysis.md`
- Instalação do backend: `docs/supabase-backend.md`
- Migration: `supabase/migrations/20260727210000_player_platform.sql`
- API: `supabase/functions/api/index.ts`

O backend inicia exclusivamente em `PLATFORM_MODE=sandbox`; nenhuma transferência
PIX real é implementada.
