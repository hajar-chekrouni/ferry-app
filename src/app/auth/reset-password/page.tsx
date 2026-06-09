export const dynamic = "force-dynamic";

import { Header } from "@/components/layout/Header";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export default async function ResetPasswordPage() {
  const configured = isSupabaseConfigured();
  return (
    <>
      <Header />
      <main className="mx-auto max-w-sm px-4 py-16">
        <ResetPasswordForm supabaseConfigured={configured} />
      </main>
    </>
  );
}
