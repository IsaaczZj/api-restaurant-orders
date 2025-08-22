# 🍽️ API Restaurant Orders

Uma API REST para gerenciamento de pedidos de restaurante, desenvolvida em Node.js com TypeScript, Express e Knex.js.

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Endpoints](#-endpoints)
- [Banco de Dados](#-banco-de-dados)
- [Desenvolvimento](#-desenvolvimento)

## ⚡ Funcionalidades

- ✅ **Gestão de Produtos**: CRUD completo de produtos do cardápio
- ✅ **Gestão de Mesas**: Criação e listagem de mesas
- ✅ **Sessões de Mesa**: Abertura e fechamento de sessões por mesa
- ✅ **Gestão de Pedidos**: Criação de pedidos vinculados às sessões
- ✅ **Resumo de Conta**: Cálculo total de pedidos por sessão
- ✅ **Validação de Dados**: Validação robusta com Zod
- ✅ **Tratamento de Erros**: Sistema centralizado de tratamento de erros

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática
- **Express** - Framework web
- **Knex.js** - Query builder SQL
- **SQLite** - Banco de dados
- **Zod** - Validação de schemas
- **TSX** - Execução TypeScript em desenvolvimento

## 📁 Estrutura do Projeto

```
api-restaurant-orders/
├── src/
│   ├── controllers/        # Controladores das rotas
│   │   ├── products-controller.ts
│   │   ├── tables-controller.ts
│   │   ├── tables-sessios-controller.ts
│   │   └── orders-controller.ts
│   ├── database/          # Configuração do banco
│   │   ├── migrations/    # Migrações do banco
│   │   ├── seeds/         # Seeds para popular o banco
│   │   └── types/         # Tipos TypeScript do banco
│   ├── middlewares/       # Middlewares personalizados
│   │   └── error-handling.ts
│   ├── routes/           # Definição das rotas
│   │   ├── index.ts
│   │   ├── products-routes.ts
│   │   ├── tables-routes.ts
│   │   ├── tables-sessios-route.ts
│   │   └── orders-routes.ts
│   ├── utils/            # Utilitários
│   │   └── app-error.ts
│   └── server.ts         # Ponto de entrada da aplicação
├── package.json
├── tsconfig.json
├── knexfile.ts
└── README.md
```

## 🚀 Instalação

1. **Clone o repositório**

   ```bash
   git clone https://github.com/IsaaczZj/api-restaurant-orders.git
   cd api-restaurant-orders
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Execute as migrações do banco**

   ```bash
   npx knex migrate:latest
   ```

4. **Popule o banco com dados iniciais (opcional)**

   ```bash
   npx knex seed:run
   ```

5. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

A API estará disponível em `http://localhost:3333`

## 🎯 Uso

### Fluxo Básico

1. **Criar uma mesa** (se não existir)
2. **Abrir uma sessão** para a mesa
3. **Criar pedidos** vinculados à sessão
4. **Consultar resumo** da conta
5. **Fechar a sessão** quando finalizar

## 📡 Endpoints

### 🍕 Produtos

| Método   | Endpoint        | Descrição               |
| -------- | --------------- | ----------------------- |
| `GET`    | `/products`     | Lista todos os produtos |
| `POST`   | `/products`     | Cria um novo produto    |
| `PUT`    | `/products/:id` | Atualiza um produto     |
| `DELETE` | `/products/:id` | Remove um produto       |

**Exemplo - Criar produto:**

```json
POST /products
{
  "name": "Pizza Margherita",
  "price": 45.90
}
```

### 🪑 Mesas

| Método | Endpoint               | Descrição            |
| ------ | ---------------------- | -------------------- |
| `GET`  | `/tables`              | Lista todas as mesas |
| `POST` | `/tables/create-table` | Cria uma nova mesa   |

**Exemplo - Criar mesa:**

```json
POST /tables/create-table
{
  "table_number": 5
}
```

### 🎫 Sessões de Mesa

| Método  | Endpoint               | Descrição              |
| ------- | ---------------------- | ---------------------- |
| `GET`   | `/tables-sessions`     | Lista todas as sessões |
| `POST`  | `/tables-sessions`     | Abre nova sessão       |
| `PATCH` | `/tables-sessions/:id` | Fecha uma sessão       |

**Exemplo - Abrir sessão:**

```json
POST /tables-sessions
{
  "table_id": 1
}
```

### 📝 Pedidos

| Método | Endpoint                                        | Descrição               |
| ------ | ----------------------------------------------- | ----------------------- |
| `GET`  | `/orders/table-session/:table_session_id`       | Lista pedidos da sessão |
| `POST` | `/orders`                                       | Cria um novo pedido     |
| `GET`  | `/orders/table-session/:table_session_id/total` | Resumo da conta         |

**Exemplo - Criar pedido:**

```json
POST /orders
{
  "table_session_id": 1,
  "product_id": 5,
  "quantity": 2
}
```

## 🗄️ Banco de Dados

### Modelo de Dados

```sql
-- Produtos do cardápio
tables (id, table_number, created_at, updated_at)

-- Produtos do cardápio
products (id, name, price, created_at, updated_at)

-- Sessões de mesa (uma mesa pode ter várias sessões ao longo do tempo)
tables_sessions (id, table_id, opened_at, closed_at)

-- Pedidos (vinculados a uma sessão específica)
orders (id, table_session_id, product_id, quantity, price, created_at, updated_at)
```

### Comandos Úteis

```bash
# Criar nova migração
npm run knex migrate:make nome_da_migracao

# Executar migrações
npm run knex migrate:latest

# Reverter última migração
npm run knex migrate:rollback

# Executar seeds
npm run knex seed:run

# Verificar status das migrações
npm run knex migrate:status
```

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
npm run dev


# Executar migrações
npm run migrate


### Estrutura de Erros

A API utiliza um sistema centralizado de tratamento de erros:

- **AppError**: Erros de negócio (400, 404, etc.)
- **ZodError**: Erros de validação (400)
- **Erros Inesperados**: Erros internos (500)

### Validações

Todas as entradas são validadas usando Zod:

- **Produtos**: Nome (min 6 chars), preço positivo
- **Mesas**: Número da mesa obrigatório
- **Pedidos**: IDs válidos, quantidade positiva

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
