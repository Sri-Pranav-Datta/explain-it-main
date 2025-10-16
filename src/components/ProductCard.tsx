import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2 } from 'lucide-react';
import { Product } from '@/types/product';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Import product images
import headphones from '@/assets/headphones.jpg';
import shoes from '@/assets/shoes.jpg';
import coffeeTable from '@/assets/coffee_table.jpg';
import lamp from '@/assets/lamp.jpg';
import yogaMat from '@/assets/yoga_mat.jpg';
import smartwatch from '@/assets/smartwatch.jpg';
import kettle from '@/assets/kettle.jpg';
import scarf from '@/assets/scarf.jpg';
import speaker from '@/assets/speaker.jpg';
import knife from '@/assets/knife.jpg';
import blanket from '@/assets/blanket.jpg';
import keyboard from '@/assets/keyboard.jpg';
// New product images
import sleepEarbuds from '@/assets/sleep_earbuds.jpg';
import frenchPress from '@/assets/french_press.jpg';
import meditationCushion from '@/assets/meditation_cushion.jpg';
import ledBulbs from '@/assets/led_bulbs.jpg';
import journal from '@/assets/journal.jpg';
import filterBottle from '@/assets/filter_bottle.jpg';
import officeChair from '@/assets/office_chair.jpg';
import gamingHeadset from '@/assets/gaming_headset.jpg';
import laptopStand from '@/assets/laptop_stand.jpg';
import herbGarden from '@/assets/herb_garden.jpg';
import blender from '@/assets/blender.jpg';
import armband from '@/assets/armband.jpg';
import cookware from '@/assets/cookware.jpg';
import beanie from '@/assets/beanie.jpg';
import webcam from '@/assets/webcam.jpg';
import massageGun from '@/assets/massage_gun.jpg';
import doorLock from '@/assets/door_lock.jpg';
import espressoMaker from '@/assets/espresso_maker.jpg';
import towelSet from '@/assets/towel_set.jpg';
import minimalistWatch from '@/assets/minimalist_watch.jpg';
import airPurifier from '@/assets/air_purifier.jpg';
import trailBackpack from '@/assets/trail_backpack.jpg';
import sportEarbuds from '@/assets/sport_earbuds.jpg';
import cuttingBoards from '@/assets/cutting_boards.jpg';
import lunchBox from '@/assets/lunch_box.jpg';
import deskConverter from '@/assets/desk_converter.jpg';
import yogaBlocks from '@/assets/yoga_blocks.jpg';
import thermostat from '@/assets/thermostat.jpg';
import denimJacket from '@/assets/denim_jacket.jpg';
import ergonomicMouse from '@/assets/ergonomic_mouse.jpg';
import teaInfuser from '@/assets/tea_infuser.jpg';
import resistanceBands from '@/assets/resistance_bands.jpg';
import wallShelves from '@/assets/wall_shelves.jpg';
import sleepHeadband from '@/assets/sleep_headband.jpg';
import metalStraws from '@/assets/metal_straws.jpg';
import fitnessTracker from '@/assets/fitness_tracker.jpg';
import wallArt from '@/assets/wall_art.jpg';
import laptopSleeve from '@/assets/laptop_sleeve.jpg';
import doorbell from '@/assets/doorbell.jpg';
import tshirt from '@/assets/tshirt.jpg';

const imageMap: Record<string, string> = {
  'p1001': headphones, 'p1013': headphones, 'p1018': headphones,
  'p1002': shoes, 'p1017': shoes,
  'p1003': coffeeTable, 'p1024': coffeeTable, 'p1042': coffeeTable,
  'p1004': lamp, 'p1014': lamp, 'p1030': lamp, 'p1039': lamp,
  'p1005': yogaMat, 'p1015': yogaMat, 'p1020': yogaMat, 'p1025': yogaMat, 'p1031': yogaMat, 'p1036': yogaMat,
  'p1006': smartwatch, 'p1026': smartwatch, 'p1032': smartwatch, 'p1038': smartwatch,
  'p1007': kettle, 'p1016': kettle, 'p1022': kettle,
  'p1008': scarf, 'p1021': scarf, 'p1028': scarf, 'p1037': scarf,
  'p1009': speaker, 'p1029': speaker,
  'p1010': knife, 'p1027': knife, 'p1033': knife,
  'p1011': blanket, 'p1019': blanket, 'p1035': blanket,
  'p1012': keyboard, 'p1023': keyboard, 'p1034': keyboard, 'p1041': keyboard,
  // New products p1043-p1082
  'p1043': sleepEarbuds,
  'p1044': frenchPress,
  'p1045': meditationCushion,
  'p1046': ledBulbs,
  'p1047': journal,
  'p1048': filterBottle,
  'p1049': officeChair,
  'p1050': gamingHeadset,
  'p1051': laptopStand,
  'p1052': herbGarden,
  'p1053': blender,
  'p1054': armband,
  'p1055': cookware,
  'p1056': beanie,
  'p1057': webcam,
  'p1058': massageGun,
  'p1059': doorLock,
  'p1060': espressoMaker,
  'p1061': towelSet,
  'p1062': minimalistWatch,
  'p1063': airPurifier,
  'p1064': trailBackpack,
  'p1065': sportEarbuds,
  'p1066': cuttingBoards,
  'p1067': lunchBox,
  'p1068': deskConverter,
  'p1069': yogaBlocks,
  'p1070': thermostat,
  'p1071': denimJacket,
  'p1072': ergonomicMouse,
  'p1073': teaInfuser,
  'p1074': resistanceBands,
  'p1075': wallShelves,
  'p1076': sleepHeadband,
  'p1077': metalStraws,
  'p1078': fitnessTracker,
  'p1079': wallArt,
  'p1080': laptopSleeve,
  'p1081': doorbell,
  'p1082': tshirt,
};

interface ProductCardProps {
  product: Product;
  onExplainClick: (product: Product) => void;
  isRecommended?: boolean;
  rank?: number;
}

const ProductCard = ({ product, onExplainClick, isRecommended, rank }: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleProductClick = async () => {
    setIsLoading(true);
    try {
      await supabase.functions.invoke('log-interaction', {
        body: {
          user_id: 'demo_user_001',
          product_id: product.id,
          event_type: 'click'
        }
      });
    } catch (error) {
      console.error('Error logging interaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplain = async () => {
    await handleProductClick();
    onExplainClick(product);
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-[var(--shadow-hover)]">
      <CardHeader className="p-0">
        <div className="relative aspect-video w-full overflow-hidden">
          <img 
            src={imageMap[product.id]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isRecommended && rank && (
            <Badge className="absolute left-2 top-2 bg-primary text-primary-foreground font-bold text-base">
              #{rank}
            </Badge>
          )}
          {product.score && product.score > 0 && (
            <Badge className="absolute right-2 top-2 bg-gradient-to-r from-primary to-secondary">
              Match: {Math.round(product.score * 100)}%
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <span className="text-lg font-bold text-primary whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
          {product.tags.split(',').slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag.trim()}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          variant="default" 
          className="flex-1"
          onClick={handleProductClick}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'View Details'}
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleExplain}
          disabled={isLoading}
          className="border-primary/20 hover:bg-primary/10"
        >
          <Sparkles className="h-4 w-4 text-primary" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;