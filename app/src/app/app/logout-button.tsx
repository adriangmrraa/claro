"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { clearSecret } from "@/lib/wallet";

export function LogoutButton() {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={async () => {
        await fetch("/api/session", { method: "DELETE" });
        clearSecret();
        router.push("/");
      }}
    >
      Salir
    </Button>
  );
}
