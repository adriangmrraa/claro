"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseUsdc } from "@/lib/money";

export function CobrarForm() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [url, setUrl] = useState("");
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!url) return;
    QRCode.toDataURL(url, { width: 192, margin: 1 }).then(setQr).catch(() => {});
  }, [url]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const amountMicro = amount.trim() ? parseUsdc(amount) : null;
    if (amount.trim() && (amountMicro === null || amountMicro <= 0n)) {
      setError("Monto inválido — usá números, ej: 150.50");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountMicro: amountMicro?.toString(),
          memo: memo.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "error");
      setUrl(`${window.location.origin}/pagar/${data.link.slug}`);
    } catch {
      setError("No se pudo crear el link. Probá de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  if (url) {
    return (
      <Card>
        <CardContent className="space-y-4 pt-6">
          <p className="text-center text-sm font-medium">Tu link está listo</p>
          {qr && (
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt="QR del link de cobro" className="rounded-lg border" />
            </div>
          )}
          <div className="rounded-lg bg-muted p-3">
            <p className="break-all font-mono text-xs">{url}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "Copiado" : "Copiar link"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setUrl("");
                setQr("");
                setAmount("");
                setMemo("");
              }}
            >
              Otro link
            </Button>
          </div>
          <Button className="w-full" onClick={() => router.push("/app")}>
            Volver a mi panel
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Monto en USD (opcional)</Label>
            <Input
              id="amount"
              inputMode="decimal"
              placeholder="Ej: 150.00 — vacío = el pagador elige"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="memo">Descripción (opcional)</Label>
            <Input
              id="memo"
              maxLength={120}
              placeholder="Ej: Trabajo de la semana"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Creando…" : "Crear link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
