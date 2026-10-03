import { describe, expect, it } from "vitest";
import { db } from "../../src/lib/db";

describe("db boot smoke", () => {
  it("creates the four CLARO tables", () => {
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
      .all() as { name: string }[];
    expect(tables.map((t) => t.name)).toEqual([
      "payment_links",
      "reports",
      "tx_cache",
      "users",
    ]);
  });

  it("round-trips a user row", () => {
    db.prepare(
      "INSERT INTO users (id, email, wallet_pubkey, created_at) VALUES (?, ?, ?, ?)"
    ).run("u1", "a@b.c", null, 123);
    const row = db.prepare("SELECT * FROM users WHERE id = ?").get("u1") as {
      email: string;
      wallet_pubkey: string | null;
    };
    expect(row.email).toBe("a@b.c");
    expect(row.wallet_pubkey).toBeNull();
  });
});
