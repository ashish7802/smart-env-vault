# AES-256-GCM — zero knowledge, server never sees plaintext
# master password stays on your machine, always

import os
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes


def derive_key(master_password: str, salt: bytes) -> bytes:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100_000,  # slow on purpose
    )
    return kdf.derive(master_password.encode())


def encrypt(plaintext: str, master_password: str) -> dict:
    salt  = os.urandom(16)
    nonce = os.urandom(12)
    key   = derive_key(master_password, salt)

    aesgcm    = AESGCM(key)
    encrypted = aesgcm.encrypt(nonce, plaintext.encode(), None)

    return {
        "ciphertext": base64.b64encode(encrypted).decode(),
        "salt":       base64.b64encode(salt).decode(),
        "nonce":      base64.b64encode(nonce).decode(),
    }


def decrypt(ciphertext_b64: str, salt_b64: str, nonce_b64: str, master_password: str) -> str:
    ciphertext = base64.b64decode(ciphertext_b64)
    salt       = base64.b64decode(salt_b64)
    nonce      = base64.b64decode(nonce_b64)

    key    = derive_key(master_password, salt)
    aesgcm = AESGCM(key)

    return aesgcm.decrypt(nonce, ciphertext, None).decode()
