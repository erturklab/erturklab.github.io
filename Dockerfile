FROM node:22-slim AS base

WORKDIR /app

FROM base AS dev

COPY package.json ./
RUN npm install

EXPOSE 3001
ENV NODE_ENV=development
CMD ["npm", "run", "dev"]

FROM base AS deps
COPY package.json ./
COPY package-lock.json* ./
RUN npm ci --ignore-scripts 2>/dev/null || npm install --ignore-scripts

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . ./
RUN npm run build

FROM base AS prod
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/out ./out
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./
COPY --from=build /app/next.config.ts ./
EXPOSE 3001
CMD ["npx", "serve", "out"]
