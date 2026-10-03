import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const dbPath =
  process.env.CLARO_DB ?? path.join(process.cwd(), "data", "claro.db");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  wallet_pubkey TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS payment_links (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  owner_pubkey TEXT NOT NULL,
  reference TEXT UNIQUE NOT NULL,
  amount TEXT,
  memo TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  owner_pubkey TEXT NOT NULL,
  scope_json TEXT NOT NULL,
  facts_json TEXT NOT NULL,
  hash TEXT NOT NULL,
  anchor_sig TEXT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  revoked_at INTEGER
);
CREATE TABLE IF NOT EXISTS tx_cache (
  sig TEXT PRIMARY KEY,
  owner_pubkey TEXT NOT NULL,
  payer TEXT,
  amount TEXT,
  ts INTEGER,
  tier TEXT NOT NULL,
  quality TEXT,
  link_slug TEXT,
  raw_json TEXT
);
`);

export interface UserRow {
  id: string;
  email: string;
  wallet_pubkey: string | null;
  created_at: number;
}

export interface PaymentLinkRow {
  id: string;
  slug: string;
  owner_pubkey: string;
  reference: string;
  amount: string | null;
  memo: string | null;
  created_at: number;
}

export interface ReportRow {
  id: string;
  slug: string;
  owner_pubkey: string;
  scope_json: string;
  facts_json: string;
  hash: string;
  anchor_sig: string | null;
  created_at: number;
  expires_at: number;
  revoked_at: number | null;
}

export interface TxCacheRow {
  sig: string;
  owner_pubkey: string;
  payer: string | null;
  amount: string | null;
  ts: number | null;
  tier: string;
  quality: string | null;
  link_slug: string | null;
  raw_json: string | null;
}
