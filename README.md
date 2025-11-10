# NestJS Monorepo Backend

Backend NestJS monorepo con architettura a microservizi.

## Setup

```bash
npm install
```

## Avvio

**Terminal 1 - Authentication Service:**
```bash
npm run start:authentication:dev
```

**Terminal 2 - Gateway:**
```bash
npm run start:gateway:dev
```

## MongoDB

```bash
docker-compose up -d
```

## API

- Gateway: http://localhost:3000
- Swagger: http://localhost:3000/api
