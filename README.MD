# Wallet Microservices

## Descrição
Este projeto implementa uma API REST para um aplicativo de carteira digital utilizando uma arquitetura de microservices. Ele consiste em dois serviços principais: `transaction-service` e `statement-service`, desenvolvidos em NestJS. O `transaction-service` gerencia as transações financeiras, enquanto o `statement-service` mantém e fornece o histórico de transações e o saldo atual.


## Estrutura do Projeto
- `transaction-service`: Serviço para gerenciar transações.
- `statement-service`: Serviço para listar e atualizar extratos.

##Tecnologias Utilizadas
- **NestJS**: Framework para construção de aplicações Node.js escaláveis e eficientes.
- **PostgreSQL**: Banco de dados relacional.
- **Docker**: Ferramenta para criação e gerenciamento de contêineres.
- **TypeORM**: ORM para interagir com o banco de dados.
- **Axios**: Cliente HTTP para comunicação entre serviços.

##Funcionalidades
- **Transaction Service**:
 - CRUD de transações financeiras.
 - Validação para evitar duplicidade de transações.
 - Comunicação com o statement-service para atualizar o saldo.
- **Statement Service**:
 - Listagem de transações filtradas por data.
 - Cálculo e fornecimento do saldo atual.
 - Atualização do histórico de transações e saldo.
 
##Configuração e Execução
###Pré-requisitos

- Docker e Docker Compose instalados.

###Passos para Executar

1. Clone o repositório:
```bash
git clone https://github.com/victorcosta/wallet-microservices.git
cd wallet-microservices
```
2. Configure o Docker e o Docker Compose:
```bash
cd docker
docker-compose up --build
```
3. Configure o Docker e o Docker Compose:
- **Transaction Service**: `http://localhost:3000/api`
- **Statement Service**: `http://localhost:3001/api`

###Variáveis de Ambiente

As variáveis de ambiente são definidas no docker-compose.yml para configurar a conexão com o banco de dados.

###Migrations

As migrações SQL para criar as tabelas necessárias estão localizadas na pasta migrations/ e são aplicadas automaticamente ao iniciar os serviços.

###Testes

Os testes unitários e integrados estão localizados nos respectivos diretórios test/ de cada serviço. Para executar os testes, use:
 ```bash
 # No diretório de cada serviço
npm run test
 ```
###Documentação da API
A documentação da API está disponível via Swagger nos seguintes endpoints:

- **Transaction Service**: http://localhost:3000/api
- **Statement Service**: http://localhost:3001/api





