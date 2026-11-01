// Phase 0 wiring check: the app calls this to prove it can reach an Edge Function.
import '@supabase/functions-js/edge-runtime.d.ts';
import { withSupabase } from '@supabase/server';

// The web app runs on another origin, so browsers need CORS headers, including on the
// preflight (which carries no API key) and on error responses.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

// Requires the publishable (client) key, so random callers can't use it.
const handler = withSupabase({ auth: ['publishable', 'secret'] }, () =>
  Response.json({ message: 'Hello from the Edge', time: new Date().toISOString() }),
);

export default {
  async fetch(req: Request): Promise<Response> {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    const res = await handler(req);
    const headers = new Headers(res.headers);
    for (const [key, value] of Object.entries(corsHeaders)) headers.set(key, value);
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
  },
};
