import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { db, type UserRow } from "./db";
import { env } from "./env";

// Demo-grade auth: email -> cookie httpOnly firmada (HMAC). NO es auth de producción — documentado en design ADR-2.

const COOKIE = "claro_session";

function sign(uid: string): string {
  return crypto
    .createHmac("sha256", env.sessionSecret)
    .update(uid)
    .digest("base64url");
}

export async function createSession(email: string): Promise<UserRow> {
  const normalized = email.trim().toLowerCase();
  let user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(normalized) as UserRow | undefined;
  if (!user) {
    user = {
      id: crypto.randomUUID(),
      email: normalized,
      wallet_pubkey: null,
      created_at: Date.now(),
    };
    db.prepare(
      "INSERT INTO users (id, email, wallet_pubkey, created_at) VALUES (?, ?, ?, ?)",
    ).run(user.id, user.email, null, user.created_at);
  }
  const jar = await cookies();
  jar.set(COOKIE, `${user.id}.${sign(user.id)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return user;
}

export async function getSessionUser(): Promise<UserRow | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  const dot = raw.lastIndexOf(".");
  if (dot <= 0) return null;
  const uid = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  const expected = sign(uid);
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(uid) as
    | UserRow
    | undefined;
  return user ?? null;
}

export function setUserWallet(userId: string, wallet: string) {
  db.prepare("UPDATE users SET wallet_pubkey = ? WHERE id = ?").run(
    wallet,
    userId,
  );
}
