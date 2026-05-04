# contributing

glad you're here. here's how to get started:

## setup

```bash
git clone https://github.com/ashish7802/smart-env-vault
cd smart-env-vault

# backend
cd backend && pip install -r requirements.txt
uvicorn main:app --reload

# frontend (new terminal)
cd frontend && npm install && npm run dev

# cli (new terminal)
cd cli && pip install click rich requests
python vault_cli.py --help
```

## what needs work

check open issues. quick wins are labeled `good first issue`.

some ideas nobody's picked up yet:
- bitwarden / 1password import
- github actions integration  
- vscode extension
- vault diff (compare two envs side by side)
- audit log ui

## pr rules

- one thing per pr — don't mix features
- add tests if adding new logic
- update readme if adding new commands
- don't force push to main
