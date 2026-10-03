// lib/wallet.ts — client-side worker wallet (non-custodial by design, CA-1).
// The keypair is generated in the browser via WebCrypto; only the public
// address ever leaves the device. The secret stored is the base58-encoded
// 32-byte Ed25519 seed — same format the demo payer env secrets use.

"use client";

import {
  createKeyPairSignerFromPrivateKeyBytes,
  generateKeyPairSigner,
  type KeyPairSigner,
} from "@solana/kit";
import bs58 from "bs58";

const STORAGE_KEY = "claro.worker.key.v1";

export interface WorkerWallet {
  address: string;
  secretB58: string;
}

// WebCrypto can only export Ed25519 private keys as PKCS#8-DER
// (16-byte header + 32-byte seed). kit's create*FromPrivateKeyBytes wants the
// raw 32-byte seed — slice it out of the DER wrapper.
export function pkcs8ToSeed(pkcs8: Uint8Array): Uint8Array {
  if (pkcs8.length === 32) return pkcs8;
  if (pkcs8.length === 48) return pkcs8.slice(16);
  throw new Error(`unexpected private key encoding length: ${pkcs8.length}`);
}

export async function exportSecretB58(signer: KeyPairSigner): Promise<string> {
  const pkcs8 = new Uint8Array(
    await crypto.subtle.exportKey("pkcs8", signer.keyPair.privateKey)
  );
  return bs58.encode(pkcs8ToSeed(pkcs8));
}

export async function generateWorkerWallet(): Promise<WorkerWallet> {
  // extractable: the user must be able to back up / export the key (CA-1).
  const signer = await generateKeyPairSigner({ extractable: true });
  return { address: signer.address, secretB58: await exportSecretB58(signer) };
}

export async function addressFromSecretB58(secretB58: string): Promise<string> {
  const signer = await createKeyPairSignerFromPrivateKeyBytes(
    pkcs8ToSeed(bs58.decode(secretB58.trim()))
  );
  return signer.address;
}

export function isValidSecretB58(secretB58: string): boolean {
  try {
    const bytes = pkcs8ToSeed(bs58.decode(secretB58.trim()));
    return bytes.length === 32;
  } catch {
    return false;
  }
}

export function saveSecret(secretB58: string): void {
  localStorage.setItem(STORAGE_KEY, secretB58);
}

export function loadSecret(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function clearSecret(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export async function loadWorkerSigner(): Promise<KeyPairSigner | null> {
  const secret = loadSecret();
  if (!secret) return null;
  try {
    return await createKeyPairSignerFromPrivateKeyBytes(pkcs8ToSeed(bs58.decode(secret)));
  } catch {
    return null;
  }
}
