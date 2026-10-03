"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SyncButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<number | null>(null);

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const res = await fetch("/api/history/sync", { method: "POST" });
          const data = await res.json();
          if (res.ok) setLast(data.synced);
          router.refresh();
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? "Actualizando…" : last !== null ? `Actualizado (+${last})` : "Actualizar historial"}
    </Button>
  );
}
