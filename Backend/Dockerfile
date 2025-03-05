FROM node:18 AS build 

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

COPY package.json ./
RUN npm install --only=production

COPY --from=build /app/build ./build
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3003

CMD ["node", "build/index.js"]
