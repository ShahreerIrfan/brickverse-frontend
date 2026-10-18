FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci || npm install

FROM base AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_URL=https://api.kawaiisubete.com/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_IMAGE_DOMAINS=api.kawaiisubete.com,kawaiisubete.com,www.kawaiisubete.com,127.0.0.1,localhost
ENV NEXT_PUBLIC_IMAGE_DOMAINS=$NEXT_PUBLIC_IMAGE_DOMAINS
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_API_URL=https://api.kawaiisubete.com/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_IMAGE_DOMAINS=api.kawaiisubete.com,kawaiisubete.com,www.kawaiisubete.com,127.0.0.1,localhost
ENV NEXT_PUBLIC_IMAGE_DOMAINS=$NEXT_PUBLIC_IMAGE_DOMAINS

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

CMD ["node", "server.js"]
