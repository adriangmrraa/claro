"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addressFromSecretB58,
  generateWorkerWallet,
  isValidSecretB58,
  saveSecret,
} from "@/lib/wallet";

type Step = "email" | "import" | "done";

export default function RegistroPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [secretInput, setSecretInput] = useState("");
  const [address, setAddress] = useState("");
  const [secretB58, setSecretB58] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!address) return;
    QRCode.toDataURL(address, { width: 192, margin: 1 }).then(setQrDataUrl).catch(() => {});
  }, [address]);

  async function finish(addr: string, secret: string) {
    await fetch("/api/user/wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet: addr }),
    });
    saveSecret(secret);
    setAddress(addr);
    setSecretB58(secret);
    setStep("done");
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("No se pudo crear la sesión");
      const wallet = await generateWorkerWallet();
      await finish(wallet.address, wallet.secretB58);
    } catch {
      setError("Algo salió mal. Probá de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  async function onImport(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const trimmed = secretInput.trim();
      if (!isValidSecretB58(trimmed)) throw new Error("bad-secret");
      const addr = await addressFromSecretB58(trimmed);
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("session");
      await finish(addr, trimmed);
    } catch {
      setError("Esa clave no es válida. Revisala y probá de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  function downloadKey() {
    const blob = new Blob(
      [
        "CLARO — tu clave de acceso\n",
        "Guardala en un lugar seguro. Si la perdés, perdés acceso a tu cuenta.\n\n",
        secretB58,
        "\n",
      ],
      { type: "text/plain" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "claro-clave.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">CLARO</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tu historial de cobros es tu prueba de ingresos.
          </p>
        </div>

        {step === "email" && (
          <Card>
            <CardHeader>
              <CardTitle>Crear cuenta</CardTitle>
              <CardDescription>Solo necesitás tu email para empezar.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Creando…" : "Crear mi cuenta"}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("import");
                    setError("");
                  }}
                  className="w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  Ya tengo una clave de acceso
                </button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === "import" && (
          <Card>
            <CardHeader>
              <CardTitle>Recuperar cuenta</CardTitle>
              <CardDescription>Pegá tu clave de acceso guardada.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onImport} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email2">Email</Label>
                  <Input
                    id="email2"
                    type="email"
                    required
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secret">Clave de acceso</Label>
                  <Input
                    id="secret"
                    required
                    placeholder="Pegá tu clave acá"
                    value={secretInput}
                    onChange={(e) => setSecretInput(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Verificando…" : "Recuperar mi cuenta"}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setError("");
                  }}
                  className="w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  Volver
                </button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === "done" && (
          <Card>
            <CardHeader>
              <CardTitle>Tu cuenta está lista</CardTitle>
              <CardDescription>
                Guardá tu clave de acceso — es la única forma de entrar a tu cuenta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {qrDataUrl && (
                <div className="flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrDataUrl} alt="Código QR de tu cuenta" className="rounded-lg border" />
                </div>
              )}
              <div className="rounded-lg bg-muted p-3 text-center">
                <p className="text-xs text-muted-foreground">Tu cuenta</p>
                <p className="break-all font-mono text-xs">{address}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(secretB58);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                >
                  {copied ? "Copiada" : "Copiar clave"}
                </Button>
                <Button variant="outline" onClick={downloadKey}>
                  Descargar clave
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Sin esta clave no hay forma de recuperar tu cuenta. Nadie más puede verla ni
                pedirla por vos.
              </p>
              <Button className="w-full" onClick={() => router.push("/app")}>
                Ir a mi panel
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
