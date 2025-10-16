import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, product_id, event_type, event_value } = await req.json();
    
    if (!user_id || !product_id || !event_type) {
      return new Response(
        JSON.stringify({ error: 'user_id, product_id, and event_type are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Logging interaction: ${event_type} by ${user_id} on ${product_id}`);

    const { data, error } = await supabase
      .from('interactions')
      .insert({
        user_id,
        product_id,
        event_type,
        event_value: event_value || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error logging interaction:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, interaction: data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in log-interaction function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});