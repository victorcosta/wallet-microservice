# Wallet Microservices

## Descrição

Este projeto implementa uma arquitetura de microserviços para gerenciar transações financeiras e saldos de usuários. Ele consiste em dois principais microserviços: `transaction-service` e `statement-service`. A comunicação entre os serviços é feita via RabbitMQ, e os dados são armazenados em bancos de dados PostgreSQL.

## Arquitetura

![architecture](https://github.com/user-attachments/assets/1146e91b-b84b-4950-80b7-4c8c4c384cc9)

### Microserviços

1. **Transaction Service**
   - Responsável por gerenciar transações.
   - Recebe transações simples ou em lote.
   - Envia atualizações para o `statement-service` após processar transações.

2. **Statement Service**
   - Responsável por gerenciar o saldo e o extrato de transações.
   - Atualiza o saldo com base nas transações recebidas do `transaction-service`.

### Comunicação

- Os microserviços se comunicam via RabbitMQ.

### Bancos de Dados

- Ambos os serviços utilizam PostgreSQL.

### Tecnologias

- NestJS
- TypeORM
- PostgreSQL
- RabbitMQ
- Docker

## Estrutura do Projeto

```
wallet-microservices/
├── migrations/
│   ├── transaction-service.sql
│   └── statement-service.sql
├── services/
│   ├── transaction-service/
│   │   └── src/
│   │       ├── dto/
│   │       │   └── create-transaction.dto.ts
│   │       ├── entity/
│   │       │   └── transaction.entity.ts
│   │       ├── test/
│   │       │   ├── transaction.controller.spec.ts
│   │       │   ├── transaction.service.spec.ts
│   │       │   └── transaction.service.integration.spec.ts
│   │       ├── transaction.controller.ts
│   │       ├── transaction.controller.ts
│   │       ├── transaction.module.ts
│   │       ├── transaction.service.ts
│   │       ├── main.ts
│   │       └──...
│   ├── statement-service/
│   │   └── src/
│   │       ├── dto/
│   │       │   └── create-statement.dto.ts
│   │       ├── entity/
│   │       │   └── statement.entity.ts
│   │       ├── test/
│   │       │   ├── statement.controller.spec.ts
│   │       │   ├── statement.service.spec.ts
│   │       │   └── statement.service.integration.spec.ts
│   │       ├── statement.controller.ts
│   │       ├── statement.module.ts
│   │       ├── statement.service.ts
│   │       ├── main.ts
│   │       └──...
├── docker-compose.yml
└── README.md
```

## Requisitos

- Node.js (versão 18 ou superior)
- Docker
- Docker Compose

## Configuração

### Variáveis de Ambiente

As variáveis de ambiente são definidas no docker-compose.yml

#### Transaction Service

```
RABBITMQ_URI=amqp://myuser:mypassword@rabbitmq:5672
RABBITMQ_ROUTING_KEY_CREATED=transaction_created
UPDATE_STATEMENT_QUEUE=update_statement_queue
UPDATE_STATEMENT_EXCHANGE=update_statement_exchange
TRANSACTION_PROCESS_QUEUE_EXCHANGE=transaction_exchange
TRANSACTION_PROCESS_QUEUE_ROUTING_KEY=transaction_key
TRANSACTION_PROCESS_QUEUE_NAME=transaction_queue

DATABASE_HOST=postgres-transaction
DATABASE_PORT=5432
DATABASE_USER=postgres_user
DATABASE_PASSWORD=postgres_pwd
DATABASE_NAME=transaction_db
PORT=3001
```

#### Statement Service

```
RABBITMQ_URI=amqp://myuser:mypassword@rabbitmq:5672
TRANSACTION_QUEUE=transaction_queue
UPDATE_STATEMENT_QUEUE=update_statement_queue
UPDATE_STATEMENT_EXCHANGE=update_statement_exchange
RABBITMQ_ROUTING_KEY=transaction_created

DATABASE_HOST=postgres-statement
DATABASE_PORT=5432
DATABASE_USER=postgres_user
DATABASE_PASSWORD=postgres_pwd
DATABASE_NAME=statement_db
PORT=3000
```

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/wallet-microservices.git
cd wallet-microservices
```

2. Suba os containers Docker:

```bash
docker-compose up -d
```

3. Instale as dependências de cada microserviço:

```bash
cd services/transaction-service
yarn install

cd ../statement-service
yarn install
```

## Uso

### Endpoints

#### Transaction Service

- **POST** `/transactions` - Cria uma nova transação.
- **POST** `/transactions/batch` - Cria um lote de novas transações.
- **GET** `/transactions/:userID` - Obtém todas as transações de um usuário.

#### Statement Service

- **POST** `/statements` - Cria um novo extrato.
- **GET** `/statements/:userID` - Obtém todos os extratos de um usuário.
- **GET** `/statements/balance/:userID` - Obtém o saldo de um usuário.

### Testes

Execute os testes unitários e de integração de cada microserviço:

#### Transaction Service


```bash
docker exec -it <container_id> /bin/bash
yarn test
```

#### Statement Service

```bash
docker exec -it <container_id> /bin/bash
yarn test
```

### Documentação da API

A documentação da API está disponível via Swagger nos seguintes endpoints:

- **Transaction Service**: http://localhost:3000/api
- **Statement Service**: http://localhost:3001/api