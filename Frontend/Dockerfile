FROM node:23-alpine AS build 

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ARG BACKEND_URL
ENV NEXT_PUBLIC_INTERNAL_BACKEND_URL=${BACKEND_URL}

ARG INTERNAL_BACKEND_URL
ENV INTERNAL_BACKEND_URL=${INTERNAL_BACKEND_URL}

ARG PRIVATE_BACKEND_URL
ENV PRIVATE_BACKEND_URL=${PRIVATE_BACKEND_URL}

ARG REVALIDATE
ENV NEXT_PUBLIC_REVALIDATE=${REVALIDATE}


RUN npm run build

FROM node:23-alpine

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]