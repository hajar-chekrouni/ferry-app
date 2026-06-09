import { Header } from "@/components/layout/Header";
import { AuthForm } from "@/components/auth/AuthForm";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function SignupPage() {
  const configured = isSupabaseConfigured();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-sm px-4 py-16">
        <AuthForm mode="signup" supabaseConfigured={configured} />
      </main>
    </>
  );
}
