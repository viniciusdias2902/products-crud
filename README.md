# Products CRUD API

Um projeto focado em aprender e aplicar as melhores práticas de desenvolvimento backend com Node.js, mesmo em um CRUD simples.

A ideia central deste repositório não é apenas criar uma API funcional, mas sim experimentar uma arquitetura robusta, conhecida como "Over-Engineering Saudável" para iniciantes. É um ambiente de estudos padronizado para compreender conceitos fundamentais que serão utilizados em aplicações de grande escala no futuro.

---

## Objetivos do Projeto

- **Arquitetura em Camadas:** Separação clara de responsabilidades (`Router` -> `Controller` -> `Service` -> `Repository`), mantendo o código testável, limpo e reutilizável.
- **RESTful Design:** Uso correto dos verbos HTTP (GET, POST, PUT, DELETE) e Status Codes padronizados (ex: `201 Created`, `204 No Content`, `404 Not Found`).
- **Validação Rigorosa:** Entrada de dados da API validada na camada de rotas/middlewares (via Schema validation usando bibliotecas).
- **Tratamento de Erros:** Middlewares globais para gerenciamento centralizado de exceções (capturando erros nativos do banco e transformando-os em respostas HTTP amigáveis).
- **Escalabilidade (Em Breve):** Preparar o terreno para testes automatizados, contêinerização (Docker) e esteira de Deploy.

---

## Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes ferramentas modernas do ecossistema Node:

- **[Node.js](https://nodejs.org/)**
- **[Express (v5)](https://expressjs.com/)**: Nova versão do micro-framework que lida nativamente com rotas e middlewares assíncronos.
- **[Prisma ORM](https://www.prisma.io/)**: Para comunicação limpa, tipada e segura com o banco de dados.
- **[PostgreSQL](https://www.postgresql.org/)**: Banco de dados relacional.
- **[Zod](https://zod.dev/)**: Validação e parsing rigoroso de schemas para os dados de entrada (`req.body`, `query`, `params`).

---

## Padrões de Arquitetura (Camadas)

A aplicação segue a divisão de responsabilidades:

1. **Rotas e Validações (`routes` / Middlewares):** Interceptam a requisição, validam schemas com Zod (ex: `req.validated.body`) e repassam.
2. **Controllers (`controllers`):** Lidam exclusivamente com as requisições, respostas da web (Req/Res) e definição de Status Codes HTTP (200, 201, 204...).
3. **Services (`services`):** Coração da aplicação. Contêm as regras de negócios, validações complexas da lógica e orquestração.
4. **Repositories (`repositories`):** Única camada responsável por falar com o Prisma/Banco de Dados. Abstrai a persistência e as queries SQL.
5. **Middlewares Globais (`middlewares`):** Incluindo um `errorHandler.js` centralizado para abstrair erros explodidos, falhas com Chave Estrangeira ou registros não encontrados (ex: Prisma `P2025`).

---

## Como Executar

(Instruções baseadas em um setup com Node instalado localmente)

### 1. Pré-requisitos
- Node.js (v18+)
- Instância do PostgreSQL rodando localmente (ou via Docker)

### 2. Instalação
Clone o projeto e instale as dependências:
```bash
npm install
```

### 3. Configuração do Banco de Dados (.env)
É **necessário** configurar a URL de conexão do PostgreSQL antes de inicializar a aplicação.
Crie um arquivo `.env` na raiz do projeto e adicione sua string de conexão:
```env
# Exemplo de configuração
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nomedobanco?schema=public"
```

### 4. Executando as Migrações
Com o `.env` configurado, você precisa criar as tabelas no banco de dados. Execute as migrations do Prisma:
```bash
npx prisma migrate dev
```
Isso sincronizará o schema do Prisma com o seu PostgreSQL.

### 5. Executando a Aplicação
Inicie a aplicação utilizando o Node:
```bash
node src/index.js

# Dica: Ou utilize a flag --watch se estiver no Node 20+
# node --watch src/index.js
```
A aplicação deverá inicializar na porta definida nas variáveis de ambiente ou na porta 3000 por padrão.

---

## Exemplos de Uso da API

Abaixo estão exemplos básicos no formato JSON para testar a API (via Postman, Insomnia ou cURL) em `http://localhost:3000`.

### Entidade: Categoria

**Criar Categoria (POST `/categories`)**
Requer enviar apenas o nome.
```json
{
  "name": "Eletrônicos"
}
```

**Buscar Categorias (GET `/categories`)**
Retorna a lista completa. Aceita Query Params para filtro (ex: `/categories?name=Eletrônicos`).

### Entidade: Produto

**Criar Produto (POST `/products`)**
Requer vincular a categoria existente (`categoryId`).
```json
{
  "name": "Smartphone",
  "price": 1999.90,
  "sku": "SMART-123",
  "categoryId": 1
}
```

**Atualizar Produto (PUT `/products/:id`)**
Altere propriedades de um produto via ID (ex: `/products/1`).
```json
{
  "price": 1850.00
}
```

**Deletar Produto (DELETE `/products/:id`)**
Requisição vazia para excluir o registro por ID. Retorna \`204 No Content\`.

---

## Roadmap

Como este é um projeto em contínuo aprendizado, as seguintes implementações estão mapeadas para entrar em breve:

- [x] **Testes Unitários:** Concluída a implementação de testes unitários (Services, Repositories e Controllers) com Vitest.
- [ ] **Testes de Integração:** Implementação de testes E2E/Integração nas rotas.
- [ ] **Dockerização:** Criação de `Dockerfile` e `docker-compose.yml` para padronização de ambiente (Node + Postgres).
- [ ] **CI/CD & Deploy:** Deploy da API e banco de dados em plataformas Cloud.
