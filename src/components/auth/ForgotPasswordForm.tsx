"use client";

import { useState } from "react";
import { Anchor, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export function ForgotPasswordForm({ supabaseConfigured }: { supabaseConfigured: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError("E-mail requis."); return; }
    setError(""); setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) { setError(error.message); return; }
      setSent(true);
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm">
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
          <Anchor className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-xl font-bold">Mot de passe oublié</h1>
        <p className="text-sm text-muted-foreground">
          Entrez votre e-mail pour recevoir un lien de réinitialisation
        </p>
      </div>

      {sent ? (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 text-center">
          ✅ Lien envoyé ! Vérifiez votre boîte mail.
          <br />
          <Link href="/auth/login" className="mt-2 inline-block font-medium text-primary hover:underline">
            Retour à la connexion
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label>E-mail *</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              autoComplete="email"
              disabled={!supabaseConfigured}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading || !supabaseConfigured} className="w-full" size="lg">
            {loading ? "Envoi…" : "Envoyer le lien"}
          </Button>
        </form>
      )}

      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
          ← Retour à la connexion
        </Link>
      </p>
    </div>
  );
}
