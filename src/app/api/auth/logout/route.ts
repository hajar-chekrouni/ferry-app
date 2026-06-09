import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST() {
  if (!isSupabaseConfigured()) {
    return Response.redirect("/");
  }
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  return Response.json({ ok: true });
}
