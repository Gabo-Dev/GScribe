import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Responds to any HTTP request.
 *
 * @param {Request} request
 */
serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  /**
   * Read the JSON and the environment variables's secret key from Supabase.
   */
  try{
    const { token } = await req.json();
    const secret = Deno.env.get("HCAPTCHA_SECRET_KEY");
    if(!token || !secret){
      return new Response(JSON.stringify({error: 'Configuration error'}), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      })
    }
    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);

    const verification = await fetch('https://api.hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    })
    
    const data = await verification.json();
    if (data.success) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    } else {
      return new Response(JSON.stringify({ success: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }
  }catch(error){
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})