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

COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=build /app/build ./build
COPY --from=build /app/node_modules/.prisma/client ./node_modules/.prisma/client

EXPOSE 3003

CMD ["node", "build/index.js"]
