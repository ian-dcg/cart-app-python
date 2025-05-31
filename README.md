# 🛒 Cart App - TPPE

Projeto de refatoração para a disciplina **Técnicas de Programação para Plataformas Emergentes (TPPE)**.

## 📚 Descrição

Aplicativo de gerenciamento de listas de compras, originalmente desenvolvido em Java (orientado a objetos) e agora refatorado para Python com FastAPI.

---

## 🚀 Como rodar o projeto (via Docker Compose)

### ✅ Pré-requisitos

- Docker e Docker Compose instalados
- Git Bash (ou terminal compatível)

---

### 📦 Passos para execução

```bash
# 1. Clone o repositório
git clone https://github.com/ian-dcg/cart-app-python.git
cd cart-app-python

# 2. Copie o arquivo de variáveis de ambiente
cp .env.example .env

# 3. Suba os serviços: banco, pgAdmin e backend
cd docker
docker-compose up -d --build
```

---

### 🔗 Endpoints disponíveis

- API base: http://localhost:8000
- Teste de conexão com banco: http://localhost:8000/db-test
- Documentação Swagger: http://localhost:8000/docs
- pgAdmin: http://localhost:5050

---

## 📦 Dependências

- Python 3.13+ (para desenvolvimento local)
- FastAPI
- Uvicorn
- PostgreSQL + pgAdmin (via Docker)

---

## 🧪 Rodando os testes

Para rodar os testes via Docker:

```bash
docker-compose run --rm api pytest
```

## 🛠️ Variáveis de ambiente (.env)

Este projeto utiliza um arquivo `.env` para configurar a conexão com o banco de dados.

Para facilitar, você pode criar o `.env` a partir do arquivo de exemplo:

```bash
cp .env.example .env
```

### 📄 Conteúdo esperado do `.env`:

```
DB_HOST=db
DB_PORT=5432
DB_NAME=cartdb
DB_USER=admin
DB_PASSWORD=admin
```

Essas variáveis são usadas pelo backend FastAPI para se conectar ao banco de dados PostgreSQL dentro do Docker.

⚠️ O `.env` está listado no `.gitignore` e **não deve ser versionado**.

---

## 🔗 Links úteis

- 🔹 [📄 Histórias de Usuário (Backlog)](./docs/backlog/historias_de_usuario.md)
- 🔹 [📊 Diagrama de Classes UML (PNG)](./docs/uml/diagrama_UML.png)

---

## 👨‍💻 Autor

**Ian da Costa Gama**  
Universidade de Brasília (UnB) — Engenharia de Software  
Matrícula: 190125829
