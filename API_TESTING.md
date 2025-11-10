# API Testing Guide

Esempi pratici per testare gli endpoint del Gateway.

## Prerequisiti
- Gateway in esecuzione su `http://localhost:3000`
- Authentication service in esecuzione su porta `3001`
- MongoDB attivo

## Testing con curl

### 1. Registra un nuovo utente

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"mario@example.com\",\"username\":\"mariorossi\",\"password\":\"Password123!\"}"
```

**Risposta attesa (201):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "mario@example.com",
  "username": "mariorossi",
  "createdAt": "2025-11-09T22:00:00.000Z"
}
```

### 2. Ottieni tutti gli utenti

```bash
curl -X GET http://localhost:3000/auth/users
```

**Risposta attesa (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "email": "mario@example.com",
    "username": "mariorossi",
    "createdAt": "2025-11-09T22:00:00.000Z"
  }
]
```

## Testing con PowerShell

### 1. Registra un nuovo utente

```powershell
$body = @{
    email = "giulia@example.com"
    username = "giuliabianchi"
    password = "SecurePass456!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

### 2. Ottieni tutti gli utenti

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/auth/users" -Method GET
```

## Swagger UI

Accedi alla documentazione interattiva Swagger:

```
http://localhost:3000/api
```

Da qui puoi testare tutti gli endpoint direttamente dal browser.

## Errori Comuni

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request"
}
```

**Causa**: Dati di input non validi (validazione fallita)

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Email already registered",
  "error": "Conflict"
}
```

**Causa**: Email o username già esistenti nel database

## Script di Test Completo

Crea uno script per testare rapidamente tutti gli endpoint:

**test-api.sh** (Linux/Mac):
```bash
#!/bin/bash

echo "Testing Gateway API..."
echo ""

echo "1. Registering user..."
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","username":"testuser","password":"password123"}'
echo -e "\n"

echo "2. Getting all users..."
curl -X GET http://localhost:3000/auth/users
echo -e "\n"

echo "Done!"
```

**test-api.ps1** (Windows PowerShell):
```powershell
Write-Host "Testing Gateway API..." -ForegroundColor Green

Write-Host "`n1. Registering user..." -ForegroundColor Yellow
$body = @{
    email = "test@test.com"
    username = "testuser"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body | ConvertTo-Json

Write-Host "`n2. Getting all users..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "http://localhost:3000/auth/users" -Method GET | ConvertTo-Json

Write-Host "`nDone!" -ForegroundColor Green
```

## Monitoraggio

### Logs Gateway
```bash
npm run start:gateway:dev
```

### Logs Authentication Service
```bash
npm run start:authentication:dev
```

Entrambi i servizi mostrano log dettagliati delle richieste e delle operazioni.

