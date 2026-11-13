FROM node:20-alpine

WORKDIR /app

# Instala dependências do sistema se necessário
RUN apk add --no-cache python3 make g++

# Copia arquivos de dependência primeiro (cache de camada)
COPY package.json package-lock.json* ./

RUN npm ci

# Copia o restante do código
COPY . .

# Variáveis de ambiente padrão (serão sobrescritas pelo compose/env)
ENV NODE_ENV=development
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
