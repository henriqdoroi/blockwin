# Backend Supabase do painel

Este diretório entrega o primeiro backend executável da plataforma: autenticação,
perfil, carteira com ledger, configurações, depósitos e saques sandbox, quatro
níveis de indicação e reserva de entrada de partida.

## Segurança e limites

- Valores monetários são inteiros em centavos.
- O browser nunca recebe a `service_role`; ela existe apenas na Edge Function.
- Carteira é alterada somente por funções transacionais com `FOR UPDATE`.
- RLS restringe dados privados a `auth.uid()`.
- Escritas financeiras exigem idempotency key.
- Cookies de sessão são HttpOnly, SameSite=Lax e Secure em produção.
- Operações mutáveis exigem `X-Requested-With: XMLHttpRequest` e origem autorizada.
- PIX e saques são exclusivamente sandbox; nenhum provedor real está configurado.
- Chaves PIX são criptografadas no banco e somente os quatro últimos dígitos do CPF
  são persistidos. Configure `app.pix_encryption_key` no Postgres antes de uso.
- A aprovação simulada de depósito é recusada pela Edge Function em produção.

O motor/replay completo da partida e a liquidação de resultado ainda não fazem
parte deste backend. `start_game` somente valida o tier, trava a carteira e reserva
a entrada. Não liquide partidas sem adicionar o validador determinístico previsto
na análise.

## Desenvolvimento local

Requisitos: Docker e Supabase CLI.

```bash
supabase start
supabase db reset
cp supabase/functions/api/.env.example supabase/functions/api/.env
supabase functions serve api --env-file supabase/functions/api/.env --no-verify-jwt
```

O CLI fornece `SUPABASE_URL`, `SUPABASE_ANON_KEY` e
`SUPABASE_SERVICE_ROLE_KEY`. Não inclua esses valores no Git.

Defina a chave de criptografia apenas no ambiente local/seguro:

```sql
alter database postgres set app.pix_encryption_key = 'troque-por-segredo-longo';
alter database postgres set app.environment = 'development';
```

## Deploy

```bash
supabase link --project-ref SEU_PROJECT_REF
supabase db push
supabase secrets set APP_URL=https://sua-plataforma.example \
  PLATFORM_MODE=sandbox ENVIRONMENT=production
supabase functions deploy api --no-verify-jwt
```

Configure seu proxy/CDN para encaminhar `/api/*` à função `api`, preservando o
caminho, cookies e headers. Exemplo conceitual:

```text
/api/panel/bootstrap -> https://PROJECT_REF.supabase.co/functions/v1/api/panel/bootstrap
```

Sem esse proxy same-origin, os cookies HttpOnly do domínio da aplicação não chegam
à função. Não aponte o frontend diretamente para uma URL com `service_role`.

## Contratos implementados

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/public/config`
- `GET /api/panel/bootstrap`
- `POST /api/deposits`
- `GET /api/deposits/:id`
- `POST /api/deposits/:id/simulate-payment` (somente desenvolvimento)
- `POST /api/withdrawals`
- `GET /api/withdrawals`
- `GET /api/referrals`
- `GET /api/profile`
- `PATCH /api/profile/password`
- `POST /api/game/start`

## Dados iniciais

A migration instala tiers de R$ 5 a R$ 100, multiplicador sandbox 5x,
configuração de score, mínimos de depósito/saque e percentuais de indicação para
N1–N4. São registros configuráveis no banco, não constantes do componente.

## Produção

Antes de produção, é obrigatório:

1. substituir o sandbox por um provedor aprovado e webhook assinado;
2. implementar rate limiting distribuído no gateway;
3. configurar logs e alertas sem PII;
4. adicionar o validador/replay determinístico e liquidação de partidas;
5. criar rotinas administrativas auditadas para saque e configurações;
6. executar testes de concorrência, recuperação e políticas RLS;
7. realizar revisão jurídica, financeira e de segurança.
