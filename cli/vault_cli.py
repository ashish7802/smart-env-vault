#!/usr/bin/env python3
# vault — manage your .env files without losing your mind
# usage: python vault_cli.py --help

import os
import sys
import json
import click
import requests
from pathlib import Path
from rich.console import Console
from rich.table import Table
from rich.panel import Panel

console  = Console()
API_BASE = os.environ.get("VAULT_API", "http://localhost:8000/api")
CFG_FILE = Path.home() / ".smart-env-vault" / "config.json"


def load_cfg() -> dict:
    if CFG_FILE.exists():
        return json.loads(CFG_FILE.read_text())
    return {}


def save_cfg(data: dict):
    CFG_FILE.parent.mkdir(parents=True, exist_ok=True)
    CFG_FILE.write_text(json.dumps(data, indent=2))


def headers() -> dict:
    token = load_cfg().get("token")
    if not token:
        console.print("[red]not logged in — run `vault login` first[/red]")
        sys.exit(1)
    return {"Authorization": f"Bearer {token}"}


@click.group()
@click.version_option("1.0.0", prog_name="vault")
def cli():
    """🔐 smart-env-vault — stop sharing secrets over slack"""
    pass


@cli.command()
@click.option("--project", "-p", default=None)
def init(project):
    """init vault in current directory"""
    name = project or Path.cwd().name
    cfg  = load_cfg()
    cfg["current_project"] = name
    save_cfg(cfg)
    console.print(Panel(f"[green]vault ready → [bold]{name}[/bold][/green]"))


@cli.command()
@click.option("--email",    prompt=True)
@click.option("--password", prompt=True, hide_input=True)
def login(email, password):
    """authenticate"""
    r = requests.post(f"{API_BASE}/auth/login", json={"email": email, "password": password})
    if r.status_code == 200:
        cfg = load_cfg()
        cfg["token"] = r.json()["access_token"]
        cfg["email"] = email
        save_cfg(cfg)
        console.print("[green]logged in[/green]")
    else:
        console.print(f"[red]login failed — {r.json().get('detail', '?')}[/red]")


@cli.command()
@click.option("--file", "-f", default=".env")
@click.option("--env",  "-e", default="development")
@click.option("--master-password", "-m", prompt=True, hide_input=True)
def push(file, env, master_password):
    """push .env to vault (encrypted before leaving your machine)"""
    p = Path(file)
    if not p.exists():
        console.print(f"[red]{file} not found[/red]")
        return

    project = load_cfg().get("current_project", Path.cwd().name)
    with console.status("encrypting and pushing..."):
        r = requests.post(
            f"{API_BASE}/vaults/{project}/secrets",
            headers=headers(),
            json={"content": p.read_text(), "env": env, "master_password": master_password},
        )

    if r.status_code == 200:
        console.print(f"[green]pushed[/green] {file} → {project}/{env}")
    else:
        console.print(f"[red]push failed — {r.text}[/red]")


@cli.command()
@click.option("--env", "-e", default="development")
@click.option("--out", "-o", default=".env")
@click.option("--master-password", "-m", prompt=True, hide_input=True)
def pull(env, out, master_password):
    """pull secrets and write to .env"""
    project = load_cfg().get("current_project", Path.cwd().name)
    with console.status("fetching and decrypting..."):
        r = requests.get(
            f"{API_BASE}/vaults/{project}/secrets",
            headers=headers(),
            params={"env": env, "master_password": master_password},
        )

    if r.status_code == 200:
        Path(out).write_text(r.json()["content"])
        console.print(f"[green]pulled[/green] {project}/{env} → {out}")
    else:
        console.print(f"[red]pull failed — {r.text}[/red]")


@cli.command()
@click.option("--path", "-p", default=".")
def scan(path):
    """scan repo for leaked secrets"""
    with console.status("scanning..."):
        r = requests.post(
            f"{API_BASE}/scan",
            headers=headers(),
            json={"path": str(Path(path).resolve())},
        )

    result = r.json()
    console.print(f"\nscanned [bold]{result['scanned_files']}[/bold] files\n")

    if result["safe"]:
        console.print("[green]✓ no secrets found — you're good[/green]")
        return

    console.print(f"[red]⚠ found {result['total_findings']} potential leaks[/red]\n")
    t = Table(show_header=True, header_style="bold red")
    t.add_column("type",    style="yellow")
    t.add_column("file",    style="cyan")
    t.add_column("line",    style="magenta")
    t.add_column("preview")
    for f in result["findings"]:
        t.add_row(f["type"], f["file"], str(f["line"]), f["preview"])
    console.print(t)


@cli.command()
def envs():
    """list environments for current project"""
    project = load_cfg().get("current_project", Path.cwd().name)
    r = requests.get(f"{API_BASE}/vaults/{project}/envs", headers=headers())
    if r.status_code == 200:
        t = Table(title=project, show_header=True, header_style="bold cyan")
        t.add_column("env")
        t.add_column("updated")
        t.add_column("version")
        for e in r.json()["environments"]:
            t.add_row(e["name"], e["updated_at"], str(e["version"]))
        console.print(t)


if __name__ == "__main__":
    cli()
