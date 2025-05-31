# 🛒 Cart App - TPPE

Projeto de refatoração para a disciplina **Técnicas de Programação para Plataformas Emergentes (TPPE)**.

## 📚 Descrição

Aplicativo de gerenciamento de listas de compras, originalmente desenvolvido em Java (orientado a objetos) e agora refatorado para Python com FastAPI.

---

## 🧪 Como rodar o projeto

### 1. Instalar dependências Python

```bash
python -m venv venv
source venv/Scripts/activate      # Git Bash
pip install -r requirements.txt
```

### 2. Subir banco de dados e pgAdmin

```bash
cd docker
docker-compose up -d
```

### 3. Iniciar backend

```bash
./start.sh
```

---

## 📦 Dependências

- Python 3.13+
- FastAPI
- Uvicorn
- PostgreSQL + pgAdmin (via Docker)

---

## 🔗 Links úteis

- 🔹 [📄 Histórias de Usuário (Backlog)](./docs/backlog/historias_de_usuario.md)
- 🔹 [📊 Diagrama de Classes UML (PNG)](./docs/uml/diagrama_UML.png)

---

### 🔗 Endpoints disponíveis

- API base: http://localhost:8000
- Teste banco: http://localhost:8000/db-test
- Documentação Swagger: http://localhost:8000/docs
- pgAdmin: http://localhost:5050

---

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

## 👨‍💻 Autor

**Ian da Costa Gama**  
Universidade de Brasília (UnB) — Engenharia de Software  
Matrícula: 190125829
