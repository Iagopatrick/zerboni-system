# Electron React TypeScript Tailwind Starter

> Instruções básicas para inicializar o backend e o frontend do projeto.

---

## Pré-requisitos

- Node.js (recomendado v18+)
- pnpm ou npm
- postgreSQL

---

## 1. Instalando as dependências

Na raiz do projeto, execute:

```bash
pnpm install
# ou
npm install
```

---

## 2. Inicializando o Backend

1. Acesse a pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências do backend:
   ```bash
   pnpm install
   # ou
   npm install
   ```
3. Configure o arquivo `.env`:
   - Copie `.env.example` para `.env` e ajuste as variáveis conforme necessário.

   ```bash
    cp .env.example .env
   ```
4. Execute as migrações do banco de dados (se necessário):
   ```bash
   pnpm migrate
   # ou
   npm run migrate
   ```
5. Inicie o servidor backend:
   ```bash
   pnpm dev
   # ou
   npm dev
   ```

---

## 3. Inicializando o Frontend (Electron + React)

1. Volte para a raiz do projeto (se estiver na pasta backend):
   ```bash
   cd ..
   ```
2. Inicie o aplicativo Electron:
   ```bash
   pnpm start
   # ou
   npm start
   ```

---

## Estrutura do Projeto

- `/backend`: Código do backend (Fastify, banco de dados, scripts)
- `/src`: Código do frontend (Electron, React, Tailwind)

---

## Observações

- Certifique-se de que o backend esteja rodando antes de utilizar funcionalidades que dependam da API.
- Para empacotar o projeto Electron:
  ```bash
  pnpm make
  # ou
  npm run make
  ```
- Para configurações avançadas, consulte a documentação do Electron Forge, Fastify, React e Tailwind CSS.

