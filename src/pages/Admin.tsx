import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, ArrowLeft, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const navigate = useNavigate();

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      const { error } = await supabase.functions.invoke('seed-products');
      
      if (error) throw error;

      toast.success('Database seeded with 82 products!');
    } catch (error) {
      console.error('Error seeding data:', error);
      toast.error('Failed to seed database');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Database Administration</h1>
            <p className="text-muted-foreground">
              Manage your product catalog and database
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Seed Product Database</CardTitle>
                  <CardDescription>
                    Load 82 products with demo data and sample interactions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <h3 className="font-semibold">What this does:</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Adds/updates 82 products across multiple categories</li>
                  <li>• Creates a demo user (demo_user_001)</li>
                  <li>• Generates sample interaction history</li>
                  <li>• Enables the recommendation engine with real data</li>
                </ul>
              </div>

              <Button
                size="lg"
                onClick={handleSeedDatabase}
                disabled={isSeeding}
                className="w-full gap-2"
              >
                {isSeeding ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Seeding Database...
                  </>
                ) : (
                  <>
                    <Database className="h-5 w-5" />
                    Seed Database Now
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                This operation is safe to run multiple times and will update existing products
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Stats</CardTitle>
              <CardDescription>
                Current state of your database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold">82</div>
                  <div className="text-sm text-muted-foreground">Total Products</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-2xl font-bold">6</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;
