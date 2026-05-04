# scans your repo for secrets you forgot to .gitignore
# runs locally — nothing leaves your machine

import re
from pathlib import Path
from typing import List, Dict

PATTERNS = [
    {"name": "AWS Access Key",       "regex": r"AKIA[0-9A-Z]{16}"},
    {"name": "AWS Secret Key",       "regex": r"(?i)aws.{0,20}['\"][0-9a-zA-Z/+]{40}['\"]"},
    {"name": "GitHub Token",         "regex": r"ghp_[a-zA-Z0-9]{36}"},
    {"name": "OpenAI Key",           "regex": r"sk-[a-zA-Z0-9]{48}"},
    {"name": "Stripe Secret",        "regex": r"sk_live_[a-zA-Z0-9]{24}"},
    {"name": "Slack Token",          "regex": r"xox[baprs]-[a-zA-Z0-9-]+"},
    {"name": "Google API Key",       "regex": r"AIza[0-9A-Za-z\-_]{35}"},
    {"name": "Private Key Block",    "regex": r"-----BEGIN (RSA |EC )?PRIVATE KEY-----"},
    {"name": "DB Connection String", "regex": r"(mongodb|postgres|mysql|redis):\/\/[^\s\"']+:[^\s\"']+@"},
    {"name": "Generic Password",     "regex": r"(?i)(password|passwd|pwd)\s*=\s*['\"][^'\"]{6,}['\"]"},
    {"name": "Generic Secret",       "regex": r"(?i)(secret|api_key|apikey|token)\s*=\s*['\"][^'\"]{8,}['\"]"},
    {"name": "JWT Token",            "regex": r"eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+"},
]

SKIP_DIRS = {".git", "node_modules", "__pycache__", ".venv", "venv", "dist", "build"}
SKIP_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".lock", ".bin"}


def scan_file(content: str, filename: str) -> List[Dict]:
    hits = []
    for i, line in enumerate(content.splitlines(), 1):
        for p in PATTERNS:
            if re.search(p["regex"], line):
                hits.append({
                    "type":    p["name"],
                    "file":    filename,
                    "line":    i,
                    "preview": line.strip()[:80],
                })
    return hits


def scan_directory(path: str) -> Dict:
    root     = Path(path)
    findings = []
    scanned  = 0

    for f in root.rglob("*"):
        if any(d in f.parts for d in SKIP_DIRS):
            continue
        if not f.is_file() or f.suffix in SKIP_EXTS:
            continue
        try:
            content   = f.read_text(encoding="utf-8", errors="ignore")
            findings += scan_file(content, str(f.relative_to(root)))
            scanned  += 1
        except Exception:
            pass

    return {
        "scanned_files":  scanned,
        "total_findings": len(findings),
        "findings":       findings,
        "safe":           len(findings) == 0,
    }
