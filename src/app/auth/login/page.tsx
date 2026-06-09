export const dynamic = "force-dynamic";

import { Header } from "@/components/layout/Header";
import { AuthForm } from "@/components/auth/AuthForm";
import { isSupabaseConfigured } from "@/lib/supabase/server";

interface PageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-sm px-4 py-16">
        <AuthForm
          mode="login"
          next={sp.next}
          supabaseConfigured={configured}
          error={sp.error}
        />
      </main>
    </>
  );
}
