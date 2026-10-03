import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // WebCrypto keypair generation is slow on this machine
    testTimeout: 60_000,
    env: {
      // keep test DB isolated and in-memory
      CLARO_DB: ":memory:",
      CLARO_SESSION_SECRET: "test-secret",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
