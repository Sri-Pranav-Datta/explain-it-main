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
    const { user_id, product_id, prompt_override } = await req.json();
    
    if (!user_id || !product_id) {
      return new Response(
        JSON.stringify({ error: 'user_id and product_id are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Explaining recommendation for user: ${user_id}, product: ${product_id}`);

    // Fetch user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single();

    if (userError) {
      throw new Error('User not found');
    }

    // Fetch product data
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', product_id)
      .single();

    if (productError) {
      throw new Error('Product not found');
    }

    // Fetch recent interactions
    const { data: interactions, error: interactionError } = await supabase
      .from('interactions')
      .select('product_id, event_type, created_at')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (interactionError) {
      console.error('Error fetching interactions:', interactionError);
    }

    // Get details of interacted products
    const interactedProductIds = interactions?.map(i => i.product_id) || [];
    const { data: interactedProducts } = await supabase
      .from('products')
      .select('id, name, category, tags')
      .in('id', interactedProductIds);

    // Build interaction summary
    const interactionSummary = interactions?.map((interaction, idx) => {
      const prod = interactedProducts?.find(p => p.id === interaction.product_id);
      return {
        product_name: prod?.name || 'Unknown',
        event: interaction.event_type,
        category: prod?.category
      };
    }) || [];

    // Prepare context for LLM
    const context = {
      user_profile: {
        name: user.name,
        preferences: user.preferences?.split(',') || [],
        recent_interactions: interactionSummary
      },
      product: {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        tags: product.tags?.split(',') || [],
        description: product.description
      }
    };

    // Build prompt
    const systemPrompt = `You are a helpful product recommendation explainer. Your task is to generate a concise (2-4 sentences) explanation of why a specific product is recommended to a user.

Guidelines:
- Reference the user's recent behavior (their interactions with other products)
- Mention relevant product attributes (category, tags, features, price)
- Provide an explicit actionable reason (e.g., "best for...", "matches your interest in...")
- Be factual and only use information provided in the context
- Keep the tone friendly, concise, and trust-building

Output format: Return ONLY a JSON object with this exact structure:
{
  "explanation": "2-4 sentence explanation here",
  "highlights": ["short bullet 1", "short bullet 2", "short bullet 3"]
}`;

    const userPrompt = prompt_override || `Based on this user profile and product, explain why this product is recommended:

User: ${context.user_profile.name}
User preferences: ${context.user_profile.preferences.join(', ')}
Recent interactions: ${context.user_profile.recent_interactions.map(i => `${i.event} on ${i.product_name} (${i.category})`).join(', ')}

Recommended Product:
Name: ${context.product.name}
Category: ${context.product.category}
Price: $${context.product.price}
Tags: ${context.product.tags.join(', ')}
Description: ${context.product.description}

Generate a compelling explanation for why this product is recommended.`;

    let explanation = '';
    let highlights: string[] = [];

    // Call Lovable AI for explanation
    if (lovableApiKey) {
      try {
        console.log('Calling Lovable AI for explanation...');
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const content = aiData.choices?.[0]?.message?.content;
          
          if (content) {
            try {
              // Try to parse as JSON
              const parsed = JSON.parse(content);
              explanation = parsed.explanation || content;
              highlights = parsed.highlights || [];
            } catch {
              // If not valid JSON, use the content directly
              explanation = content;
              highlights = [`Matches interest in ${context.product.category}`, `Great value at $${context.product.price}`];
            }
          }
        } else {
          console.error('AI API error:', aiResponse.status, await aiResponse.text());
          throw new Error('AI API request failed');
        }
      } catch (aiError) {
        console.error('Error calling Lovable AI:', aiError);
        // Fallback to template
        explanation = `We recommended ${product.name} because it aligns with your interests. This ${product.category} product has features that match your browsing history and preferences.`;
        highlights = [`Matches ${product.category} interest`, `Highly rated product`, `Good value at $${product.price}`];
      }
    } else {
      // Fallback template explanation
      const recentCategories = new Set(interactionSummary.map(i => i.category));
      const matchingInterests = context.user_profile.preferences.filter((pref: string) => 
        product.tags?.toLowerCase().includes(pref.toLowerCase())
      );

      explanation = `We recommended ${product.name} because you recently ${interactionSummary[0]?.event || 'viewed'} ${interactionSummary[0]?.product_name || 'similar products'}${recentCategories.has(product.category) ? ` in the ${product.category} category` : ''}. This ${product.category.toLowerCase()} product offers ${product.description?.split('.')[0].toLowerCase() || 'great features'} and is priced at $${product.price}, which fits well with your typical product range.`;
      
      highlights = [
        matchingInterests.length > 0 ? `Matches your interest in ${matchingInterests[0]}` : `Popular in ${product.category}`,
        `Well-priced at $${product.price}`,
        `Highly rated ${product.category.toLowerCase()} product`
      ];
    }

    // Log to rec_logs
    const { error: logError } = await supabase
      .from('rec_logs')
      .insert({
        user_id,
        product_id,
        score: 0.85, // Would come from recommendation engine in real system
        explanation
      });

    if (logError) {
      console.error('Error logging recommendation:', logError);
    }

    return new Response(
      JSON.stringify({ 
        explanation,
        highlights,
        context: {
          user: context.user_profile.name,
          product: context.product.name
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in explain-recommendation function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});