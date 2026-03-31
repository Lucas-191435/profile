# ── Estágio 1: instalar dependências ────────────────────────────────────────
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ── Estágio 2: build da aplicação ────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variáveis necessárias apenas no build
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG BASE_URL
ARG MODE=production

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Estágio 3: imagem de produção (mínima) ───────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Criar usuário sem privilégios
RUN addgroup --system --gid 1001 nodejs
RUN adduser  --system --uid 1001 nextjs

# Copiar assets públicos
COPY --from=builder /app/public ./public

# Copiar output standalone (drasticamente menor que node_modules completo)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
