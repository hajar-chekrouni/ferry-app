"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Anchor, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

interface Props {
  mode: "login" | "signup";
  next?: string;
  supabaseConfigured: boolean;
  error?: string;
}

export function AuthForm({ mode, next = "/account", supabaseConfigured, error: initialError }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError ?? "");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("E-mail et mot de passe requis."); return; }
    setError(""); setLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) { setError(error.message); return; }
        router.push(next);
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { first_name: firstName, last_name: lastName },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
          },
        });
        if (error) { setError(error.message); return; }
        setSuccess("Vérifiez votre e-mail pour activer votre compte.");
      }
    } catch {
      setError("Erreur réseau. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm">
      {/* Logo */}
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
          <Anchor className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-xl font-bold">
          {mode === "login" ? "Connexion" : "Créer un compte"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "login"
            ? "Accédez à vos réservations"
            : "Suivez vos traversées en ferry"}
        </p>
      </div>

      {/* Supabase not configured warning */}
      {!supabaseConfigured && (
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">Auth non configurée</p>
            <p>Ajoutez <code className="rounded bg-amber-100 px-1 text-xs">NEXT_PUBLIC_SUPABASE_URL</code> et <code className="rounded bg-amber-100 px-1 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> dans <code className="rounded bg-amber-100 px-1 text-xs">.env.local</code>.</p>
          </div>
        </div>
      )}

      {success ? (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
          ✅ {success}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Prénom</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Hajar" />
              </div>
              <div className="space-y-1">
                <Label>Nom</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Chekrouni" />
              </div>
            </div>
          )}

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

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label>Mot de passe *</Label>
              {mode === "login" && (
                <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              )}
            </div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === "signup" ? "Min. 8 caractères" : "••••••••"}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              disabled={!supabaseConfigured}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !supabaseConfigured}
            className="w-full"
            size="lg"
          >
            {loading
              ? "Chargement…"
              : mode === "login"
              ? "Se connecter"
              : "Créer mon compte"}
          </Button>
        </form>
      )}

      <p className="mt-4 text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            Pas encore de compte ?{" "}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              S&apos;inscrire
            </Link>
          </>
        ) : (
          <>
            Déjà un compte ?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Se connecter
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
