import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
  const { type, record } = await req.json();

  // Solo actuamos cuando un usuario se crea
  if (type !== "INSERT") {
    return new Response("Not an insert event", { status: 200 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  await supabase.from("profiles").insert({
    id: record.id,
    full_name: "",
  });

  return new Response("Profile created", { status: 200 });
});
