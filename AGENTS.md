# Projeto Luniar — App de Repertório Cultural

## Visão geral
App onde o usuário informa uma obra consumida (jogo, filme, música, livro) e recebe uma trilha curta (4–5 itens) de materiais para aprofundar: filosofia, psicologia, arte, livros, documentários.

Diferencial: não é um wrapper de IA genérica. Usa um **grafo de influências próprio** (obras, temas, conceitos, autores, materiais como nós; relações como arestas). A IA é usada apenas como fallback quando o grafo não tem a obra, e sempre validada contra fontes reais.

## Stack
- **Backend:** NestJS + TypeORM + PostgreSQL (via Docker)
- **Frontend:** ainda não iniciado
- **Banco:** PostgreSQL 16 (Docker Compose)
- **Ambiente:** Node 20 Alpine

## Estrutura do repositório
```
project-luniar/
├── .env                        # variáveis para Docker Compose (banco)
├── .env.example
├── docker-compose.yaml         # serviços: postgres + backend
├── grafo/                      # modelo do grafo, nós de teste e fluxograma Excalidraw
│   ├── modelo.md
│   ├── nos.json
│   ├── README.md
│   └── fluxograma.excalidraw.json
└── luniar-api/                 # backend NestJS
    ├── .env                    # variáveis locais da API (DATABASE_*, PORT, NODE_ENV)
    ├── .env.example
    ├── Dockerfile
    ├── src/
    │   ├── app.module.ts       # raiz do NestJS, registra TypeORM + WorksModule
    │   ├── app.controller.ts   # rota GET /health (verifica conexão com DB)
    │   ├── main.ts             # bootstrap da aplicação
    │   ├── entities/
    │   │   ├── content.entity.ts       (abstrata: id, title, type, year, coverUrl, synopsis, author)
    │   │   ├── work.entity.ts          (extends Content: externalSourceId, externalSourceType)
    │   │   ├── material.entity.ts      (extends Content: level, whyItFits, whereToFind)
    │   │   ├── relation.entity.ts      (aresta do grafo: fromType/Id → toType/Id + relationType)
    │   │   ├── trail.entity.ts         (trilha gerada para uma obra)
    │   │   └── trail-item.entity.ts    (item da trilha: ordem, nível, por que está aqui)
    │   └── works/                # módulo existente (ainda vazio de regras de negócio)
    │       ├── works.controller.ts
    │       ├── works.service.ts
    │       └── dto/
    ├── package.json
    └── tsconfig.json
```

## Decisões arquiteturais (MVP)
- Banco relacional PostgreSQL (não MongoDB) por causa dos relacionamentos/grafo e familiaridade com Spring Boot/JPA.
- Entidade base abstrata `Content` herdada por `Work` e `Material`.
- Tabela `relations` polimórfica: `from_type`/`from_id` → `to_type`/`to_id`, permitindo navegar grafo (obra → autor → material).
- `synchronize: true` em desenvolvimento (TypeORM cria as tabelas automaticamente).
- Rota `GET /health` no `AppController` para healthcheck do Docker.

## Comandos úteis
```bash
# Raiz do projeto
docker compose up -d          # sobe postgres + backend
docker compose down           # para tudo
docker compose logs backend   # logs da API
docker compose ps             # status dos containers

# Backend (luniar-api/)
npm run start:dev             # roda em watch mode localmente
npm run build                 # build de produção
npm run start:prod            # inicia em produção
```

## Variáveis de ambiente
- **Raiz `.env`:** `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `PGDATA`, `BACKEND_PORT`, `NODE_ENV`
- **`luniar-api/.env`:** `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_NAME`, `PORT`, `NODE_ENV`, `TYPEORM_LOGGING`

## Status atual (primeiro commit)
- Backend sobe em Docker com PostgreSQL conectado
- Tabelas criadas: `works_tb`, `materials_tb`, `relations_tb`, `trails_tb`, `trail_items_tb`
- Rota `GET /health` retornando `{"status":"ok","database":"connected"}`
- `WorksModule` existe mas sem regras de negócio implementadas
- Próximos passos: implementar ingestão de obra (busca externa + grafo + geração de trilha), módulos de materials, relations e trails
