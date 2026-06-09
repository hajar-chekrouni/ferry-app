"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogOut, UserCircle } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

interface Props {
  user: User | null;
}

export function AccountHeader({ user }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
          <UserCircle className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="font-bold">Mes réservations</h1>
          {user ? (
            <p className="text-sm text-muted-foreground">{user.email}</p>
          ) : (
            <p className="text-sm text-muted-foreground">Mode démo — toutes les réservations</p>
          )}
        </div>
      </div>
      {user && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={loading}
          className="gap-1.5"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      )}
    </div>
  );
}
