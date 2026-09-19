import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  const { error } = await supabaseAdmin.from("clima_articles").select("id").limit(1);

  if (error) {
    console.error("Supabase connection test failed:", error);

    return Response.json({ ok: false, error: "Supabase connection failed." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
