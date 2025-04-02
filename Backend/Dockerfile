FROM node:18-alpine AS build 

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY prisma ./prisma
RUN npm install

RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client

COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=build /app/build ./build
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma  
COPY --from=build /app/prisma ./prisma

EXPOSE 3003

CMD ["sh", "-c", "until pg_isready -h postgres -U $DB_USER -d $DB_NAME; do sleep 2; done && npx prisma migrate deploy && node build/index.js"]

