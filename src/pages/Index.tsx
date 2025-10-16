import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, Settings } from 'lucide-react';
import RecommendationsGrid from '@/components/RecommendationsGrid';
import ThemeToggle from '@/components/ThemeToggle';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [userId, setUserId] = useState('demo_user_001');
  const navigate = useNavigate();

  const handleRefreshUser = () => {
    const newUserId = `demo_user_${Date.now()}`;
    setUserId(newUserId);
    toast.success('Switched to new user for fresh recommendations!');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Explain It</h1>
                <p className="text-xs text-muted-foreground">Powered by Google Gemini</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshUser}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                New User
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Admin
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <RecommendationsGrid userId={userId} key={userId} />
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-12 border-t">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span>Hybrid Recommendation Engine</span>
            <span>•</span>
            <span>LLM-Powered Explanations</span>
            <span>•</span>
            <span>Real-time Personalization</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Built with Supabase, Lovable AI, and React
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;