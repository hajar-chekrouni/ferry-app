export const dynamic = "force-dynamic";

import { Header } from "@/components/layout/Header";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function ForgotPasswordPage() {
  const configured = isSupabaseConfigured();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-sm px-4 py-16">
        <ForgotPasswordForm supabaseConfigured={configured} />
      </main>
    </>
  );
}
