import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Calculate similarity between two tag sets
function calculateTagSimilarity(tags1: string, tags2: string): number {
  const set1 = new Set(tags1.split(',').map(t => t.trim().toLowerCase()));
  const set2 = new Set(tags2.split(',').map(t => t.trim().toLowerCase()));
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
}

// Calculate category match score
function calculateCategoryScore(userCategory: string, productCategory: string): number {
  return userCategory.toLowerCase() === productCategory.toLowerCase() ? 1.0 : 0.0;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id = 'demo_user_001', limit = 6 } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Getting recommendations for user: ${user_id}`);

    // Get user preferences
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('preferences')
      .eq('id', user_id)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
    }

    // Get user's interaction history
    const { data: interactions, error: interactionError } = await supabase
      .from('interactions')
      .select('product_id, event_type, event_value, created_at')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (interactionError) {
      console.error('Error fetching interactions:', interactionError);
    }

    // Get all products
    const { data: allProducts, error: productsError } = await supabase
      .from('products')
      .select('*');

    if (productsError || !allProducts) {
      throw new Error('Failed to fetch products');
    }

    // Build interaction weights
    const eventWeights: Record<string, number> = {
      'view': 1,
      'click': 3,
      'add_to_cart': 5,
      'purchase': 10
    };

    const interactedProductIds = new Set(interactions?.map(i => i.product_id) || []);
    
    // Calculate user vector based on interactions
    const userInterestTags = new Set<string>();
    const userCategories = new Set<string>();
    let totalWeight = 0;

    if (interactions && interactions.length > 0) {
      for (const interaction of interactions) {
        const product = allProducts.find(p => p.id === interaction.product_id);
        if (product) {
          const weight = eventWeights[interaction.event_type] || 1;
          totalWeight += weight;
          
          // Add tags to user interests with weights
          product.tags?.split(',').forEach((tag: string) => {
            userInterestTags.add(tag.trim().toLowerCase());
          });
          
          userCategories.add(product.category.toLowerCase());
        }
      }
    } else if (user?.preferences) {
      // Use stated preferences if no interactions
      user.preferences.split(',').forEach((pref: string) => {
        userInterestTags.add(pref.trim().toLowerCase());
      });
    }

    // Score each product
    const scoredProducts = allProducts
      .filter(product => !interactedProductIds.has(product.id)) // Exclude already interacted products
      .map(product => {
        let score = 0;

        // Content-based scoring using tags (40%)
        const tagSimilarity = calculateTagSimilarity(
          Array.from(userInterestTags).join(','),
          product.tags || ''
        );
        score += tagSimilarity * 0.4;

        // Category match (30%)
        const categoryMatches = Array.from(userCategories).some(
          cat => product.category.toLowerCase() === cat
        );
        if (categoryMatches) {
          score += 0.3;
        }

        // Collaborative filtering - simple co-occurrence (20%)
        // In a real system, this would be more sophisticated
        const coOccurrenceBonus = interactions?.some(i => {
          const interactedProduct = allProducts.find(p => p.id === i.product_id);
          return interactedProduct?.category === product.category;
        }) ? 0.2 : 0;
        score += coOccurrenceBonus;

        // Price affordability (10%) - prefer products within typical price range
        const interactionsTotal = interactions?.reduce((sum, i) => {
          const p = allProducts.find(prod => prod.id === i.product_id);
          return sum + (p?.price || 0);
        }, 0) || 0;
        const avgInteractedPrice = interactionsTotal / (interactions?.length || 1) || 100;
        
        const priceDiff = Math.abs(product.price - avgInteractedPrice) / avgInteractedPrice;
        const priceScore = Math.max(0, 1 - priceDiff) * 0.1;
        score += priceScore;

        return {
          ...product,
          score: Math.round(score * 100) / 100
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    console.log(`Returning ${scoredProducts.length} recommendations`);

    return new Response(
      JSON.stringify({ 
        recommendations: scoredProducts,
        user_id
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in get-recommendations function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});