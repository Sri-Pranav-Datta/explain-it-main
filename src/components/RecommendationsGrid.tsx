import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { Product } from '@/types/product';
import ProductCard from './ProductCard';
import ExplanationModal from './ExplanationModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from './ui/button';

interface RecommendationsGridProps {
  userId: string;
}

const RecommendationsGrid = ({ userId }: RecommendationsGridProps) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchRecommendations();
  }, [userId]);

  useEffect(() => {
    // Load initial batch
    setDisplayedProducts(allProducts.slice(0, page * ITEMS_PER_PAGE));
  }, [allProducts, page]);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setPage(1);
    try {
      const { data, error } = await supabase.functions.invoke('get-recommendations', {
        body: {
          user_id: userId,
          limit: 100
        }
      });

      if (error) throw error;

      setAllProducts(data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = useCallback(() => {
    if (displayedProducts.length < allProducts.length) {
      setPage(prev => prev + 1);
    }
  }, [displayedProducts.length, allProducts.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, isLoading]);

  const handleExplainClick = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              {displayedProducts.length > 0 && displayedProducts[0].score && displayedProducts[0].score > 0 
                ? 'Recommended For You' 
                : 'All Products'}
            </h2>
            <p className="text-muted-foreground">
              {displayedProducts.length > 0 && displayedProducts[0].score && displayedProducts[0].score > 0
                ? 'Top picks shown first, followed by our full catalog'
                : 'Browse our full catalog'}
            </p>
          </div>
          <Button
            onClick={fetchRecommendations}
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onExplainClick={handleExplainClick}
              isRecommended={product.score ? product.score > 0 : false}
              rank={product.score && product.score > 0 ? index + 1 : undefined}
            />
          ))}
        </div>

        {displayedProducts.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products available</p>
          </div>
        )}

        {/* Infinite scroll loader */}
        <div ref={loaderRef} className="flex justify-center py-8">
          {displayedProducts.length < allProducts.length && (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          )}
        </div>
      </div>

      <ExplanationModal
        product={selectedProduct}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
};

export default RecommendationsGrid;