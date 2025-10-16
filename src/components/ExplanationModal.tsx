import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { Product, Explanation } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExplanationModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ExplanationModal = ({ product, open, onOpenChange }: ExplanationModalProps) => {
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [promptOverride, setPromptOverride] = useState('');
  const [showPromptEditor, setShowPromptEditor] = useState(false);

  useEffect(() => {
    if (product && open) {
      fetchExplanation();
    }
  }, [product, open]);

  const fetchExplanation = async (customPrompt?: string) => {
    if (!product) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('explain-recommendation', {
        body: {
          user_id: 'demo_user_001',
          product_id: product.id,
          prompt_override: customPrompt || undefined
        }
      });

      if (error) throw error;

      setExplanation(data);
    } catch (error) {
      console.error('Error fetching explanation:', error);
      toast.error('Failed to generate explanation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateWithPrompt = () => {
    if (promptOverride.trim()) {
      fetchExplanation(promptOverride);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Why this product?
          </DialogTitle>
          <DialogDescription>
            AI-powered explanation for your personalized recommendation
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : explanation ? (
          <div className="space-y-6">
            <div className="rounded-lg border bg-muted/50 p-4">
              <h3 className="mb-2 font-semibold">Recommendation Explanation</h3>
              <p className="text-sm leading-relaxed">{explanation.explanation}</p>
            </div>

            {explanation.highlights && explanation.highlights.length > 0 && (
              <div>
                <h3 className="mb-3 font-semibold">Key Highlights</h3>
                <div className="space-y-2">
                  {explanation.highlights.map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 rounded-lg border bg-card p-3"
                    >
                      <Badge variant="secondary" className="mt-0.5">
                        {index + 1}
                      </Badge>
                      <p className="text-sm flex-1">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPromptEditor(!showPromptEditor)}
                className="mb-2"
              >
                {showPromptEditor ? 'Hide' : 'Show'} Prompt Override (for testing)
              </Button>

              {showPromptEditor && (
                <div className="space-y-2">
                  <Textarea
                    placeholder="Enter custom prompt to regenerate explanation..."
                    value={promptOverride}
                    onChange={(e) => setPromptOverride(e.target.value)}
                    rows={4}
                    className="text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={handleRegenerateWithPrompt}
                    disabled={!promptOverride.trim() || isLoading}
                    className="w-full"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate with Custom Prompt
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No explanation available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExplanationModal;