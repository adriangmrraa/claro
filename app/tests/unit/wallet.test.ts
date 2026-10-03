import { beforeEach, describe, expect, it } from "vitest";

// Minimal localStorage shim — wallet.ts is "use client" code; Node has no DOM.
const store = new Map<string, string>();
beforeEach(() => {
  store.clear();
  globalThis.localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
    key: () => null,
    get length() {
      return store.size;
    },
  } as Storage;
});

describe("worker wallet (client-side keygen, CA-1)", () => {
  it("generates a keypair and restores the same address from the secret", async () => {
    const { generateWorkerWallet, addressFromSecretB58 } = await import("@/lib/wallet");
    const w = await generateWorkerWallet();
    expect(w.address).toMatch(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/);
    expect(w.secretB58.length).toBeGreaterThan(40);
    expect(await addressFromSecretB58(w.secretB58)).toBe(w.address);
  });

  it("different wallets produce different addresses", async () => {
    const { generateWorkerWallet } = await import("@/lib/wallet");
    const a = await generateWorkerWallet();
    const b = await generateWorkerWallet();
    expect(a.address).not.toBe(b.address);
  });

  it("save/load/clear round-trips the secret in localStorage only", async () => {
    const { saveSecret, loadSecret, clearSecret, loadWorkerSigner } = await import("@/lib/wallet");
    saveSecret("abc123");
    expect(loadSecret()).toBe("abc123");
    clearSecret();
    expect(loadSecret()).toBeNull();
    expect(await loadWorkerSigner()).toBeNull();
  });

  it("loadWorkerSigner rebuilds a signing-capable signer", async () => {
    const { generateWorkerWallet, saveSecret, loadWorkerSigner } = await import("@/lib/wallet");
    const w = await generateWorkerWallet();
    saveSecret(w.secretB58);
    const signer = await loadWorkerSigner();
    expect(signer?.address).toBe(w.address);
    // capable of signing (partial/modifying signer, not sending)
    expect(typeof signer?.signTransactions).toBe("function");
  });
});
