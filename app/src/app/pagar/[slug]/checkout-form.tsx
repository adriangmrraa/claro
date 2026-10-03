"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseUsdc } from "@/lib/money";
import { txUrl } from "@/lib/explorer";

type State = "form" | "paying" | "done" | "error";

export function CheckoutForm({
  slug,
  fixedAmountMicro,
}: {
  slug: string;
  fixedAmountMicro: string | null;
}) {
  const [state, setState] = useState<State>("form");
  const [amount, setAmount] = useState("");
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");

  async function onPay(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    let amountMicro: string | undefined;
    if (!fixedAmountMicro) {
      const parsed = parseUsdc(amount);
      if (parsed === null || parsed <= 0n) {
        setError("Ingresá un monto válido");
        return;
      }
      amountMicro = parsed.toString();
    }
    setState("paying");
    try {
      const res = await fetch("/api/checkout/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, amountMicro }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "error");
      setSignature(data.signature);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "El pago no pudo procesarse");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <Card>
        <CardContent className="space-y-4 pt-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
            ✓
          </div>
          <p className="font-medium">Pago enviado</p>
          <p className="text-sm text-muted-foreground">
            El cobro quedó registrado y es verificable.
          </p>
          <a
            href={txUrl(signature)}
            target="_blank"
            rel="noopener noreferrer"
            className="block break-all rounded-lg bg-muted p-3 font-mono text-xs text-primary underline-offset-4 hover:underline"
          >
            {signature.slice(0, 20)}…{signature.slice(-8)}
          </a>
          <p className="text-xs text-muted-foreground">
            Tocá la firma para ver la transacción real en Solana Explorer.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={onPay} className="space-y-4">
          {!fixedAmountMicro && (
            <div className="space-y-2">
              <Label htmlFor="amount">Monto en USD</Label>
              <Input
                id="amount"
                inputMode="decimal"
                required
                placeholder="Ej: 150.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          )}
          {/* Simulated card fields — the fiat ramp is fake by design (demo). */}
          <div className="space-y-2 opacity-60">
            <Label>Tarjeta / billetera</Label>
            <Input disabled placeholder="4111 1111 1111 1111" />
            <div className="grid grid-cols-2 gap-2">
              <Input disabled placeholder="MM/AA" />
              <Input disabled placeholder="CVV" />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={state === "paying"}>
            {state === "paying" ? "Procesando pago…" : "Pagar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
