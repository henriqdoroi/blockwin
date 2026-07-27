# Deploy do backend na Railway

O backend em `server/` substitui a dependência de Supabase para a execução na
Railway. Ele serve os arquivos do frontend e a API no mesmo domínio, usa PostgreSQL
da Railway e aplica migrations automaticamente antes de iniciar.

## Serviços necessários

Crie um projeto com dois recursos:

1. **PostgreSQL** gerenciado pela Railway;
2. **Aplicação** conectada a este repositório.

O `railway.json` seleciona o `Dockerfile`, define `/health` como healthcheck e
reinicia o processo apenas em falhas. O container executa migrations sob advisory
lock antes de subir o Fastify, de modo que duas réplicas não concorram pela mesma
migration.

## Variáveis obrigatórias

Configure no serviço da aplicação:

```text
DATABASE_URL=${{Postgres.DATABASE_URL}}
APP_URL=https://SEU-DOMINIO
JWT_SECRET=<64 caracteres aleatórios>
PIX_ENCRYPTION_KEY=<64 caracteres aleatórios diferentes>
PLATFORM_MODE=sandbox
ALLOW_SANDBOX_APPROVAL=false
NODE_ENV=production
TRUST_PROXY=true
```

A Railway fornece `PORT`; não fixe esse valor em produção. Gere segredos localmente
com `openssl rand -hex 32`. Nunca use a chave do exemplo e nunca coloque os valores
reais no Git.

`ALLOW_SANDBOX_APPROVAL` deve permanecer `false` em produção. Mesmo se for alterada,
a rota de aprovação simulada também verifica `NODE_ENV` e recusa a operação.

## Deploy

1. Faça push da branch/merge do PR.
2. No serviço Railway, selecione o repositório.
3. Adicione o PostgreSQL e a referência `DATABASE_URL` acima.
4. Cadastre as demais variáveis.
5. Gere um domínio para o serviço e atualize `APP_URL` exatamente para essa origem.
6. Aguarde `/health` responder `200`.
7. Abra `/`, faça cadastro e acesse `/painel`.

O mesmo serviço entrega frontend e `/api/*`, portanto cookies HttpOnly permanecem
same-origin e não é necessário expor CORS para um domínio diferente.

## Recursos implementados

- cadastro e login por telefone compatíveis com as telas existentes;
- senha Argon2id;
- access token curto e refresh token rotativo armazenados em cookie HttpOnly;
- sessões revogáveis no PostgreSQL;
- rate limiting de login, cadastro, API e alteração de senha;
- carteira com saldo disponível, reservado e comissões;
- ledger idempotente;
- depósito e aprovação exclusivamente sandbox;
- saque sandbox com chave PIX criptografada em AES-256-GCM;
- indicações N1–N4 e comissões idempotentes após depósito aprovado;
- configurações e tiers no banco;
- reserva atômica de entrada e seed de partida gerada no servidor;
- headers de segurança, CORS restritivo, verificação de mutações e logs com redaction;
- healthcheck que também verifica o PostgreSQL.

## Teste local

Com PostgreSQL disponível:

```bash
cp .env.example .env
npm install
set -a; . ./.env; set +a
npm run migrate
npm start
curl --fail http://localhost:3000/health
```

Para testar a aprovação de depósito somente localmente, use
`NODE_ENV=development`, `PLATFORM_MODE=sandbox` e
`ALLOW_SANDBOX_APPROVAL=true`.

## Limites antes de dinheiro real

Não há integração PIX real. Não ative operações financeiras reais sem provedor,
webhook assinado, conciliação, KYC/AML, revisão jurídica e auditoria independente.
O backend apenas reserva a entrada do jogo: validação completa do replay,
movimentos, encerramento e liquidação ainda precisam ser implementadas antes de o
jogo distribuir qualquer recompensa.
