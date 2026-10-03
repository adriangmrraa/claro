"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ReportActions({ slug, revoked }: { slug: string; revoked: boolean }) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const url = typeof window !== "undefined" ? `${window.location.origin}/verificar/${slug}` : `/verificar/${slug}`;

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        {copied ? "Copiado" : "Copiar link"}
      </Button>
      {!revoked && (
        <Button
          variant="ghost"
          size="sm"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            await fetch(`/api/reports/${slug}/revoke`, { method: "POST" });
            router.refresh();
          }}
        >
          Revocar
        </Button>
      )}
    </div>
  );
}
