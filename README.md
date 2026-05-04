# 🔐 Smart Env Vault

<div align="center">

![Smart Env Vault Banner](docs/banner.png)

**Stop leaking secrets. Stop losing `.env` files. Start shipping safely.**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://react.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Stars](https://img.shields.io/github/stars/ashish7802/smart-env-vault?style=social)](https://github.com/ashish7802/smart-env-vault)

[Features](#-features) • [Quick Start](#-quick-start) • [CLI Usage](#-cli-usage) • [API Docs](#-api) • [Contributing](#-contributing)

</div>

---

## 😤 The Problem

Every developer has done this:

```bash
# Monday
cp .env.example .env  # "I'll fill this later"

# Tuesday  
git add .             # accidentally commits .env 💀

# Wednesday
slack: "hey what's the DB password?"  # sharing secrets in plain text 💀

# Thursday
new team member: "what env vars do I need?" # nobody knows 💀
```

**Smart Env Vault fixes all of this.**

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔒 **AES-256 Encryption** | All secrets encrypted locally before storage |
| 🌐 **Web UI** | Beautiful dashboard to manage all your project envs |
| ⚡ **CLI First** | Full terminal workflow — `vault push`, `vault pull`, `vault sync` |
| 👥 **Team Sharing** | Share encrypted vaults with teammates via tokens |
| 📦 **Multi-Project** | Manage envs across unlimited projects |
| 🔄 **Version History** | Roll back to any previous env state |
| 🏷️ **Environment Tags** | Separate dev / staging / prod configs |
| 🔍 **Secret Scanner** | Detect accidentally committed secrets in your repo |

---

## 🚀 Quick Start

### Option 1: CLI (Recommended)

```bash
pip install smart-env-vault

# Initialize vault in your project
vault init

# Push your current .env to vault
vault push --env development

# Pull env on another machine / CI
vault pull --env development --out .env
```

### Option 2: Self-hosted Server

```bash
git clone https://github.com/ashish7802/smart-env-vault
cd smart-env-vault

# Start backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Start frontend (new terminal)
cd frontend
npm install && npm run dev
```

Open `http://localhost:5173` 🎉

### Option 3: Docker

```bash
docker-compose up -d
```

---

## 💻 CLI Usage

```bash
# Initialize a new vault
vault init [--project my-app]

# Push secrets
vault push                          # push .env
vault push --file .env.production   # push specific file
vault push --env staging            # tag as staging

# Pull secrets
vault pull                          # pull latest
vault pull --env production         # pull specific env
vault pull --out /path/to/.env      # output to specific path

# Team management
vault invite teammate@email.com     # invite with read access
vault invite teammate@email.com --write  # invite with write access
vault token create --expires 7d     # create expiring share token

# Scan for leaked secrets
vault scan                          # scan current repo
vault scan --path /path/to/project  # scan specific path

# Version history
vault history                       # list all versions
vault rollback --version 3          # rollback to version 3

# Environment tags
vault envs                          # list all environments
vault switch production             # switch active environment
```

---

## 🏗️ Architecture

```
smart-env-vault/
├── backend/              # FastAPI server
│   ├── main.py           # App entry point
│   ├── routers/          # API routes
│   │   ├── vault.py      # Vault CRUD operations
│   │   ├── auth.py       # Authentication
│   │   └── team.py       # Team management
│   ├── services/
│   │   ├── crypto.py     # AES-256 encryption/decryption
│   │   ├── scanner.py    # Secret leak scanner
│   │   └── vault.py      # Business logic
│   └── models/           # Pydantic models
│
├── frontend/             # React + Vite dashboard
│   └── src/
│       ├── pages/        # Dashboard, Projects, Settings
│       └── components/   # Vault cards, Secret editor, etc.
│
├── cli/                  # Python CLI (Click)
│   └── vault_cli.py
│
└── docker-compose.yml
```

---

## 🔒 Security

- **Zero-knowledge**: Server never sees plaintext secrets
- **AES-256-GCM** encryption with per-vault keys
- **Master password** never leaves your machine
- Keys derived using **PBKDF2** (100k iterations)
- All API endpoints require JWT auth
- Optional **2FA** support

---

## 📡 API

API docs auto-generated at `http://localhost:8000/docs`

Key endpoints:

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/vaults                  # list all vaults
POST   /api/vaults                  # create vault
GET    /api/vaults/{id}/secrets     # get encrypted secrets
PUT    /api/vaults/{id}/secrets     # update secrets
GET    /api/vaults/{id}/history     # version history
POST   /api/team/invite             # invite teammate
POST   /api/scan                    # scan for leaks
```

---

## 🧰 Tech Stack

**Backend:** Python · FastAPI · SQLite/PostgreSQL · Pydantic · Python-jose (JWT) · Cryptography (AES-256)

**Frontend:** React 18 · Vite · TailwindCSS · Zustand · React Query

**CLI:** Python · Click · Rich (terminal UI)

**DevOps:** Docker · GitHub Actions CI

---

## 🤝 Contributing

PRs welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

```bash
git clone https://github.com/ashish7802/smart-env-vault
cd smart-env-vault
# Pick an issue labeled `good first issue`
```

---

## 📄 License

MIT © [Ashish Yadav](https://ashyada.netlify.app)

---

<div align="center">
  <strong>If this saved your secrets, give it a ⭐</strong>
</div>
