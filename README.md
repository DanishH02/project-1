# NestJS Monorepo Backend - Microservices Architecture

Questo progetto è un backend NestJS monorepo che implementa un'architettura a microservizi con comunicazione TCP interna.

## 📋 Indice

- [Architettura](#architettura)
- [Struttura del Progetto](#struttura-del-progetto)
- [Tecnologie Utilizzate](#tecnologie-utilizzate)
- [Setup e Installazione](#setup-e-installazione)
- [Esecuzione del Progetto](#esecuzione-del-progetto)
- [API Endpoints](#api-endpoints)
- [Pattern e Best Practices](#pattern-e-best-practices)

---

## 🏗️ Architettura

Il progetto è strutturato come un **monorepo NestJS** con due applicazioni principali:

### 1. **Gateway App** (`apps/gateway`)
- **Responsabilità**: Espone un'API REST HTTP pubblica
- **Porta**: 3000 (configurabile)
- **Funzionalità**:
  - Gestisce le richieste HTTP in ingresso
  - Valida i dati in input tramite DTOs e class-validator
  - Inoltra le richieste al microservizio di autenticazione tramite TCP
  - Espone documentazione Swagger su `/api`

### 2. **Authentication App** (`apps/authentication`)
- **Responsabilità**: Microservizio per la gestione degli utenti
- **Porta**: 3001 (configurabile)
- **Funzionalità**:
  - Riceve messaggi TCP dal gateway
  - Gestisce la business logic per la registrazione e recupero utenti
  - Interagisce con MongoDB tramite Mongoose
  - Implementa pattern Controller → Service → Repository

### 3. **Common Directory** (`common/`)
Contiene codice condiviso tra le applicazioni:
- **DTOs**: Data Transfer Objects per validazione e trasferimento dati
- **Interfaces**: Definizioni di tipi e pattern di messaggi
- **Services**: NetworkingService per la comunicazione TCP
- **Config**: Configurazioni condivise (database, ecc.)

---

## 📁 Struttura del Progetto

```
project-1/
├── apps/
│   ├── gateway/                    # Gateway REST API
│   │   ├── src/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts    # Controller REST
│   │   │   │   ├── auth.service.ts       # Service per comunicazione TCP
│   │   │   │   └── auth.module.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts                   # Bootstrap Gateway
│   │   ├── Dockerfile
│   │   └── tsconfig.app.json
│   │
│   └── authentication/             # Microservizio Autenticazione
│       ├── src/
│       │   ├── users/
│       │   │   ├── schemas/
│       │   │   │   └── user.schema.ts    # Schema MongoDB
│       │   │   ├── users.controller.ts   # Controller TCP (MessagePattern)
│       │   │   ├── users.service.ts      # Business logic
│       │   │   ├── users.repository.ts   # Data access layer
│       │   │   └── users.module.ts
│       │   ├── app.module.ts
│       │   └── main.ts                   # Bootstrap Microservice
│       ├── Dockerfile
│       └── tsconfig.app.json
│
├── common/                         # Codice condiviso
│   ├── config/
│   │   └── database.config.ts
│   ├── dto/
│   │   ├── register-user.dto.ts
│   │   └── user-response.dto.ts
│   ├── interfaces/
│   │   ├── message-patterns.interface.ts
│   │   └── user.interface.ts
│   └── services/
│       └── networking.service.ts
│
├── docker-compose.yml              # MongoDB setup
├── nest-cli.json                   # Configurazione monorepo
├── package.json
└── tsconfig.json
```

---

## 🛠️ Tecnologie Utilizzate

### Framework e Runtime
- **NestJS** (v11): Framework backend Node.js
- **Node.js** (v20+): Runtime JavaScript

### Database
- **MongoDB**: Database NoSQL
- **Mongoose**: ODM per MongoDB

### Microservices
- **@nestjs/microservices**: Comunicazione TCP tra servizi
- **RxJS**: Programmazione reattiva per messaggi asincroni

### Validazione e Documentazione
- **class-validator**: Validazione DTOs
- **class-transformer**: Trasformazione oggetti
- **Swagger** (@nestjs/swagger): Documentazione API automatica

### DevOps
- **Docker & Docker Compose**: Containerizzazione
- **TypeScript**: Linguaggio tipizzato

---

## 🚀 Setup e Installazione

### Prerequisiti
- Node.js v20 o superiore
- npm o yarn
- Docker e Docker Compose (per MongoDB)
- MongoDB locale oppure configurato via Docker

### Step 1: Clona il Repository
```bash
git clone <repository-url>
cd project-1
```

### Step 2: Installa le Dipendenze
```bash
npm install
```

### Step 3: Configura le Variabili d'Ambiente
Crea un file `.env` nella root del progetto (puoi copiare da `.env.example` se disponibile):

```env
# Gateway Configuration
GATEWAY_PORT=3000

# Authentication Service Configuration
AUTH_SERVICE_HOST=localhost
AUTH_SERVICE_PORT=3001

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/nestjs-monorepo
```

**Nota**: Se il file `.env` è bloccato, le variabili d'ambiente di default sono già configurate nel codice.

### Step 4: Avvia MongoDB
Usando Docker Compose:
```bash
docker-compose up -d
```

Oppure usa un'istanza MongoDB locale o cloud (MongoDB Atlas).

---

## ▶️ Esecuzione del Progetto

### Modalità Sviluppo (Development)

**Avvia entrambi i servizi in terminali separati:**

Terminal 1 - Authentication Service:
```bash
npm run start:authentication:dev
```

Terminal 2 - Gateway:
```bash
npm run start:gateway:dev
```

### Modalità Produzione (Production)

**Build delle applicazioni:**
```bash
npm run build:gateway
npm run build:authentication
```

**Avvia i servizi:**
```bash
npm run start:gateway
npm run start:authentication
```

### Verifica del Funzionamento
- Gateway API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api
- Authentication Service: TCP su porta 3001 (non accessibile via HTTP)

**Guida al Testing**: Consulta il file `API_TESTING.md` per esempi pratici di test degli endpoint.

---

## 📡 API Endpoints

### Base URL
```
http://localhost:3000
```

### Swagger Documentation
```
http://localhost:3000/api
```

### Endpoints Disponibili

#### 1. **POST /auth/register**
Registra un nuovo utente.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "StrongP@ssw0rd"
}
```

**Response (201 Created):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "username": "johndoe",
  "createdAt": "2025-11-09T22:00:00.000Z"
}
```

**Errori Possibili:**
- `400 Bad Request`: Dati di input non validi
- `409 Conflict`: Email o username già registrati

---

#### 2. **GET /auth/users**
Recupera tutti gli utenti registrati.

**Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "johndoe",
    "createdAt": "2025-11-09T22:00:00.000Z"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "email": "jane@example.com",
    "username": "janedoe",
    "createdAt": "2025-11-09T23:00:00.000Z"
  }
]
```

---

## 🎯 Pattern e Best Practices

### Architettura MVC (Model-View-Controller)

Il progetto segue il pattern **Controller → Service → Repository**:

```
Controller (HTTP/TCP Endpoint)
    ↓
Service (Business Logic)
    ↓
Repository (Data Access)
    ↓
Database (MongoDB)
```

#### Gateway (apps/gateway)
```
AuthController → AuthService → NetworkingService (TCP Client)
```

#### Authentication (apps/authentication)
```
UsersController (TCP) → UsersService → UsersRepository → MongoDB
```

---

### DTOs (Data Transfer Objects)

I DTOs garantiscono:
- **Validazione automatica** tramite `class-validator`
- **Type-safety** in TypeScript
- **Documentazione Swagger** automatica

**Esempio:** `RegisterUserDto`
```typescript
export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}
```

---

### RTOs (Response Transfer Objects)

Gli RTOs definiscono la struttura delle risposte:

**Esempio:** `UserResponseDto`
```typescript
export class UserResponseDto {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
}
```

**Nota:** Le password NON vengono mai restituite nelle risposte.

---

### Comunicazione TCP tra Microservizi

#### Gateway → Authentication

1. **Gateway** invia un messaggio TCP:
```typescript
this.networkingService.send<UserResponseDto>(
  MessagePattern.USER_REGISTER,
  dto
);
```

2. **Authentication** riceve e processa:
```typescript
@MessagePattern(MessagePattern.USER_REGISTER)
async register(@Payload() dto: RegisterUserDto) {
  return this.usersService.register(dto);
}
```

3. **Networking Service** gestisce la connessione TCP:
```typescript
ClientProxyFactory.create({
  transport: Transport.TCP,
  options: {
    host: 'localhost',
    port: 3001,
  }
});
```

---

### Validazione Globale

Entrambe le applicazioni utilizzano una `ValidationPipe` globale:

```typescript
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,           // Rimuove proprietà non definite nei DTOs
    forbidNonWhitelisted: true, // Lancia errore se ci sono proprietà extra
    transform: true,            // Trasforma automaticamente i tipi
  })
);
```

---

### Database con Mongoose

Il progetto utilizza **Mongoose** come ODM:

**Schema Definition:**
```typescript
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;
}
```

**Repository Pattern:**
```typescript
@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: RegisterUserDto): Promise<UserDocument> {
    const user = new this.userModel(dto);
    return user.save();
  }
}
```

---

## 🐳 Docker Support

### Opzione 1: Solo MongoDB
Per avviare solo MongoDB (e poi le app in locale):

```bash
docker-compose up -d
```

### Opzione 2: Stack Completo
Per avviare l'intera applicazione containerizzata:

```bash
docker-compose -f docker-compose.full.yml up --build
```

Questo comando:
- Builda entrambe le applicazioni
- Avvia MongoDB
- Avvia Authentication service
- Avvia Gateway
- Configura la rete interna

**Accesso:**
- Gateway: http://localhost:3000
- Swagger: http://localhost:3000/api

**Stop:**
```bash
docker-compose -f docker-compose.full.yml down
```

### Build Manuale delle Immagini

Ogni app ha il proprio Dockerfile multi-stage per build ottimizzate.

**Build Gateway:**
```bash
docker build -f apps/gateway/Dockerfile -t gateway-app .
```

**Build Authentication:**
```bash
docker build -f apps/authentication/Dockerfile -t auth-app .
```

**Run manuale:**
```bash
# Avvia MongoDB
docker-compose up -d

# Avvia Authentication
docker run -d --name auth-service \
  -p 3001:3001 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/nestjs-monorepo \
  auth-app

# Avvia Gateway
docker run -d --name gateway \
  -p 3000:3000 \
  -e AUTH_SERVICE_HOST=host.docker.internal \
  -e AUTH_SERVICE_PORT=3001 \
  gateway-app
```

---

## 📝 Note Aggiuntive

### Sicurezza
⚠️ **IMPORTANTE**: In questo progetto, le password vengono salvate in chiaro nel database per semplicità. In un'applicazione di produzione, dovresti:
- Usare **bcrypt** o **argon2** per hashare le password
- Implementare autenticazione JWT
- Aggiungere rate limiting
- Usare HTTPS

### Testing
Per testare i servizi, puoi usare:
- **Swagger UI**: http://localhost:3000/api
- **Postman** o **Insomnia**
- **curl**:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"testuser","password":"password123"}'
```

### Monorepo Benefits
- **Codice condiviso**: DTOs e interfaces in `common/`
- **Deploy indipendente**: Le app possono essere deployate separatamente
- **Type-safety**: TypeScript attraverso tutto il codebase
- **Scalabilità**: Facile aggiungere nuovi microservizi

---

## 🎓 Concetti Implementati

✅ **Architettura Monorepo**: Struttura `apps/` con due applicazioni
✅ **Pattern MVC**: Controller → Service → Repository
✅ **Microservices**: Comunicazione TCP con @nestjs/microservices
✅ **DTOs/RTOs**: Request/Response validation
✅ **Database**: MongoDB con Mongoose
✅ **Validazione**: class-validator
✅ **Documentazione**: Swagger/OpenAPI
✅ **Dockerization**: Docker e Docker Compose
✅ **Best Practices**: Separazione responsabilità, modularità, type-safety

---

## 🤝 Contributi

Questo progetto è stato creato come demo per valutare competenze NestJS e architettura a microservizi.

---

## 📄 Licenza

UNLICENSED - Progetto privato per scopi dimostrativi.
