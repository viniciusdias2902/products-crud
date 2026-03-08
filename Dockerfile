# ---- Estágio 1: Instalar dependências ----
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

# ---- Estágio 2: Gerar o Prisma Client ----
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./

RUN npx prisma generate

# ---- Estágio 3: Imagem final de produção ----
FROM node:22-alpine

RUN apk add --no-cache dumb-init

ENV NODE_ENV=production

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/src/generated ./src/generated

COPY src ./src
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY package.json ./

USER appuser

EXPOSE 5001

CMD ["dumb-init", "node", "src/server.js"]
