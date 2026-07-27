FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

FROM node:22-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
RUN groupadd --system app && useradd --system --gid app app
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=app:app . .
USER app
EXPOSE 3000
CMD ["sh", "-c", "node server/src/migrate.js && node server/src/index.js"]
