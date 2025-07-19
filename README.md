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

# 2. Configure as variáveis de ambiente
# Backend (opcional, já configurado no docker-compose)
cp backend/.env.example backend/.env

# Frontend (necessário para comunicação com a API)
cp frontend/.env.local.example frontend/.env.local

# 3. Suba todos os serviços
docker-compose up -d --build
```

---

### 🔗 Endpoints disponíveis

- **Frontend**: http://localhost:3000
- **API base**: http://localhost:8000
- **Documentação Swagger**: http://localhost:8000/docs
- **pgAdmin**: http://localhost:5050

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
# Executar todos os testes
docker-compose run --rm api pytest

# Executar testes com mais detalhes (verbose)
docker-compose run --rm api pytest -v

# Executar apenas testes de produto
docker-compose run --rm api pytest tests/test_product.py

# Executar apenas testes de carrinho
docker-compose run --rm api pytest tests/test_cart.py

# Executar testes excluindo falhas conhecidas
docker-compose run --rm api pytest -k "not test_listar_todos_os_carrinhos"
```

> **⚠️ Nota:** Atualmente há 1 teste falhando (`test_listar_todos_os_carrinhos`) porque a rota `GET /cart/` não está implementada no backend.

## 🔧 Ferramentas de qualidade de código

Para executar linting e formatação:

```bash
# Executar linting (flake8, black, isort)
docker-compose run --rm lint

# Ou individual:
docker-compose run --rm api flake8 app tests
docker-compose run --rm api black app tests
docker-compose run --rm api isort app tests
```

## 🛠️ Variáveis de ambiente

Este projeto utiliza arquivos de configuração para diferentes serviços:

### Backend (.env)

Para facilitar, você pode criar o `.env` a partir do arquivo de exemplo:

```bash
cp backend/.env.example backend/.env
```

**Conteúdo esperado do `backend/.env`:**

```
DB_HOST=db
DB_PORT=5432
DB_NAME=cartdb
DB_USER=admin
DB_PASSWORD=admin
```

### Frontend (.env.local)

O frontend precisa saber onde encontrar a API:

```bash
cp frontend/.env.local.example frontend/.env.local
```

**Conteúdo esperado do `frontend/.env.local`:**

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

⚠️ Ambos os arquivos `.env` estão listados no `.gitignore` e **não devem ser versionados**.

---

## 🔗 Links úteis

- 🔹 [📄 Histórias de Usuário (Backlog)](./docs/backlog/historias_de_usuario.md)
- 🔹 [📊 Diagrama de Classes UML (PNG)](./docs/uml/diagrama_UML.png)

---

## 👨‍💻 Autor

**Ian da Costa Gama**  
Universidade de Brasília (UnB) — Engenharia de Software  
Matrícula: 190125829
