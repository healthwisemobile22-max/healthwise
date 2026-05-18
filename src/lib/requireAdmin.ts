import { createClient } from "@supabase/supabase-js";
import { createClient as createServerSupabase } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      ok: false,
      status: 401,
      error: "Unauthorized",
      user: null,
    };
  }

  if (user.app_metadata?.role !== "admin") {
    return {
      ok: false,
      status: 403,
      error: "Forbidden",
      user,
    };
  }

  return {
    ok: true,
    status: 200,
    error: null,
    user,
  };
}

export function getServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}