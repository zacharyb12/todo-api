# ---- Etape 1 : build (image lourde, jetee apres) ----
FROM node:22-alpine AS build
WORKDIR /app

# d'abord les manifestes seuls : le npm ci est mis en cache tant que package.json ne change pas
COPY package*.json ./
RUN npm ci

# puis le code, et le build TypeScript -> dist/
COPY . .
RUN npm run build

# ---- Etape 2 : run (image finale legere) ----
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

# uniquement les dependances de production (pas de @nestjs/cli, ts, eslint...)
COPY package*.json ./
RUN npm ci --omit=dev

# on ne recupere QUE le resultat du build de l'etape 1
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
