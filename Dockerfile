# syntax=docker/dockerfile:1

FROM node:18-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
COPY packages ./packages
COPY tsconfig.json ./tsconfig.json

RUN npm ci
RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=base /app/package.json ./package.json
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/packages ./packages
COPY --from=base /app/tsconfig.json ./tsconfig.json

EXPOSE 3000
CMD ["npx", "ts-node", "packages/cap-server/src/http.ts"]
