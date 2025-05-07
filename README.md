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

## 👨‍💻 Autor

**Ian da Costa Gama**  
Universidade de Brasília (UnB) — Engenharia de Software  
Matrícula: 190125829
