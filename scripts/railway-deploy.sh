#!/usr/bin/env bash
set -Eeuo pipefail

required=(RAILWAY_TOKEN RAILWAY_PROJECT_ID RAILWAY_SERVICE_ID RAILWAY_ENVIRONMENT_ID APP_URL JWT_SECRET PIX_ENCRYPTION_KEY)
missing=()
for name in "${required[@]}"; do
  [[ -n "${!name:-}" ]] || missing+=("$name")
done
if ((${#missing[@]})); then
  printf 'Variáveis obrigatórias ausentes: %s\n' "${missing[*]}" >&2
  exit 2
fi
if ((${#JWT_SECRET} < 32 || ${#PIX_ENCRYPTION_KEY} < 32)); then
  echo 'JWT_SECRET e PIX_ENCRYPTION_KEY precisam ter pelo menos 32 caracteres.' >&2
  exit 2
fi
if ! command -v railway >/dev/null 2>&1; then
  echo 'Railway CLI não encontrado. Instale @railway/cli antes do deploy.' >&2
  exit 127
fi

# RAILWAY_TOKEN is consumed by the CLI from the environment and is never printed.
railway link \
  --project "$RAILWAY_PROJECT_ID" \
  --environment "$RAILWAY_ENVIRONMENT_ID" \
  --service "$RAILWAY_SERVICE_ID"

railway variables --set \
  "APP_URL=$APP_URL" \
  "JWT_SECRET=$JWT_SECRET" \
  "PIX_ENCRYPTION_KEY=$PIX_ENCRYPTION_KEY" \
  "PLATFORM_MODE=sandbox" \
  "ALLOW_SANDBOX_APPROVAL=false" \
  "NODE_ENV=production" \
  "TRUST_PROXY=true" \
  --service "$RAILWAY_SERVICE_ID"

railway up --detach --service "$RAILWAY_SERVICE_ID"
echo 'Deploy enviado. Confirme o status e o healthcheck no painel da Railway.'
