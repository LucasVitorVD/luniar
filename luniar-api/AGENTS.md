# AGENTS.md — luniar-api

## Visão geral
Backend NestJS do projeto Luniar. Expõe a API que recebe uma obra informada pelo usuário, consulta o grafo de influências próprio (banco PostgreSQL), gera uma trilha curta de materiais e valida com fontes externas quando necessário.

## Stack
- **Framework:** NestJS + TypeORM
- **Banco:** PostgreSQL 16 (via Docker)
- **Ambiente:** Node 20 Alpine
- **ORM:** TypeORM (`autoLoadEntities: false`, entidades listadas explicitamente em `app.module.ts`)

## Estrutura
```
luniar-api/
├── src/
│   ├── app.module.ts       # raiz: TypeORM + controllers + providers
│   ├── app.controller.ts   # GET /health (conexão com DB)
│   ├── main.ts             # bootstrap
│   ├── entities/
│   │   ├── content.entity.ts       (abstrata: id, title, type, year, coverUrl, synopsis, author)
│   │   ├── work.entity.ts          (extends Content)
│   │   ├── material.entity.ts      (extends Content: level, whyItFits, whereToFind)
│   │   ├── relation.entity.ts      (aresta do grafo: fromType/fromId → toType/toId + relationType)
│   │   ├── trail.entity.ts         (trilha gerada para uma obra)
│   │   └── trail-item.entity.ts    (item da trilha: ordem, nível, por que está aqui)
│   └── works/              # módulo existente (CRUD básico, sem regras de negócio ainda)
│       ├── works.controller.ts
│       ├── works.service.ts
│       └── dto/
├── .env                    # DATABASE_*, PORT, NODE_ENV, TYPEORM_LOGGING
├── .env.example
├── Dockerfile              # Node 20 Alpine, npm ci, start:dev
├── package.json
└── tsconfig.json
```

## Entidades e relacionamentos
- `Content` (abstrato) → herdado por `Work` e `Material`
- `Work` — obras consumidas (tabela `works_tb`)
- `Material` — materiais de aprofundamento (tabela `materials_tb`)
- `Relation` — aresta polimórfica do grafo (`from_type`/`from_id` → `to_type`/`to_id`, tabela `relations_tb`)
- `Trail` — trilha gerada para uma obra (tabela `trails_tb`)
- `TrailItem` — item da trilha com `order_position`, `level`, `why_included` (tabela `trail_items_tb`)

## Comandos
```bash
# Dentro de luniar-api/
npm run start:dev   # watch mode
npm run build       # build de produção
npm run start:prod  # produção
```

## Variáveis de ambiente (`.env`)
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_NAME`
- `PORT`, `NODE_ENV`, `TYPEORM_LOGGING`

## Como rodar localmente
```bash
cd luniar-api
cp .env.example .env   # edite com suas credenciais
npm run start:dev
```

## Como rodar com Docker (raiz do projeto)
```bash
docker compose up -d   # sobe postgres + backend
```

## Rota existente
- `GET /health` — retorna `{"status":"ok","database":"connected"}` se o banco estiver acessível

## Próximos passos (pendentes)
- Implementar regras de negócio em `WorksModule` (ingestão de obra, busca externa, grafo, geração de trilha)
- Criar módulos `MaterialsModule`, `RelationsModule`, `TrailsModule`
- Validação de materiais reais antes de retornar na trilha (evitar alucinação de IA)
