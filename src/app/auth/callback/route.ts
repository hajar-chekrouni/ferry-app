import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // For password recovery, redirect to reset-password page
  const type = searchParams.get("type");
  if (type === "recovery") {
    return Response.redirect(new URL("/auth/reset-password", request.url));
  }

  return Response.redirect(new URL(next, request.url));
}
