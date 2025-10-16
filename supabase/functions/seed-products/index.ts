import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const products = [
  {
    id: "p1001",
    name: "Nimbus Wireless Headphones",
    description: "Over-ear wireless headphones with active noise canceling and 30h battery life.",
    category: "Electronics",
    price: 129.99,
    tags: "audio,headphones,wireless,noise-canceling",
    image_url: "/images/headphones.jpg"
  },
  {
    id: "p1002",
    name: "Aero Running Shoes",
    description: "Lightweight running shoes designed for daily training with breathable mesh.",
    category: "Apparel",
    price: 79.99,
    tags: "shoes,fitness,running,lightweight",
    image_url: "/images/shoes.jpg"
  },
  {
    id: "p1003",
    name: "Elmwood Coffee Table",
    description: "Solid wood coffee table with natural finish and storage shelf.",
    category: "Home",
    price: 199.00,
    tags: "furniture,table,wood,home-decor",
    image_url: "/images/coffee_table.jpg"
  },
  {
    id: "p1004",
    name: "Lumen Desk Lamp",
    description: "Adjustable LED desk lamp with dimmable color temperatures.",
    category: "Home",
    price: 39.99,
    tags: "lighting,lamp,desk,led",
    image_url: "/images/lamp.jpg"
  },
  {
    id: "p1005",
    name: "Atlas Yoga Mat",
    description: "Non-slip, cushion yoga mat for home practice and studio.",
    category: "Fitness",
    price: 24.50,
    tags: "yoga,fitness,mat,exercise",
    image_url: "/images/yoga_mat.jpg"
  },
  {
    id: "p1006",
    name: "Verve Smartwatch",
    description: "Health-tracking smartwatch with heart-rate monitor and sleep tracking.",
    category: "Electronics",
    price: 149.00,
    tags: "wearable,watch,fitness,smartwatch",
    image_url: "/images/smartwatch.jpg"
  },
  {
    id: "p1007",
    name: "KettlePro Electric Kettle",
    description: "Rapid boil cordless kettle with auto shutoff and 1.7L capacity.",
    category: "Kitchen",
    price: 29.99,
    tags: "kitchen,appliances,kettle,coffee",
    image_url: "/images/kettle.jpg"
  },
  {
    id: "p1008",
    name: "Aurora Silk Scarf",
    description: "100% silk scarf with vibrant print.",
    category: "Apparel",
    price: 45.00,
    tags: "fashion,scarf,silk,accessory",
    image_url: "/images/scarf.jpg"
  },
  {
    id: "p1009",
    name: "Arc Bluetooth Speaker",
    description: "Portable speaker with deep bass and waterproof design.",
    category: "Electronics",
    price: 59.99,
    tags: "audio,speaker,bluetooth,portable",
    image_url: "/images/speaker.jpg"
  },
  {
    id: "p1010",
    name: "Chef's Knife 8\"",
    description: "High-carbon stainless steel chef's knife with ergonomic handle.",
    category: "Kitchen",
    price: 69.50,
    tags: "kitchen,knife,cooking,chef",
    image_url: "/images/knife.jpg"
  },
  {
    id: "p1011",
    name: "Cozy Fleece Blanket",
    description: "Ultra-soft fleece blanket, perfect for chilly nights.",
    category: "Home",
    price: 29.00,
    tags: "home,blanket,bedding,comfort",
    image_url: "/images/blanket.jpg"
  },
  {
    id: "p1012",
    name: "Focus Mechanical Keyboard",
    description: "Tactile mechanical keyboard with hot-swappable switches.",
    category: "Electronics",
    price: 109.99,
    tags: "keyboard,pc,mechanical,gaming",
    image_url: "/images/keyboard.jpg"
  },
  {
    id: "p1013",
    name: "Urban Backpack Pro",
    description: "Water-resistant laptop backpack with USB charging port.",
    category: "Accessories",
    price: 89.99,
    tags: "backpack,laptop,travel,usb",
    image_url: "/images/headphones.jpg"
  },
  {
    id: "p1014",
    name: "Glow LED Strip Lights",
    description: "Smart RGB LED strips with app control and music sync.",
    category: "Home",
    price: 34.99,
    tags: "lighting,led,smart-home,rgb",
    image_url: "/images/lamp.jpg"
  },
  {
    id: "p1015",
    name: "Titan Protein Shaker",
    description: "BPA-free shaker bottle with mixing ball and measurements.",
    category: "Fitness",
    price: 12.99,
    tags: "fitness,shaker,protein,gym",
    image_url: "/images/yoga_mat.jpg"
  },
  {
    id: "p1016",
    name: "Brew Master Coffee Maker",
    description: "Programmable coffee maker with thermal carafe.",
    category: "Kitchen",
    price: 79.99,
    tags: "coffee,kitchen,appliances,programmable",
    image_url: "/images/kettle.jpg"
  },
  {
    id: "p1017",
    name: "Summit Hiking Boots",
    description: "Waterproof hiking boots with ankle support.",
    category: "Apparel",
    price: 139.99,
    tags: "shoes,hiking,outdoor,waterproof",
    image_url: "/images/shoes.jpg"
  },
  {
    id: "p1018",
    name: "Wireless Earbuds Pro",
    description: "True wireless earbuds with ANC and 24h battery.",
    category: "Electronics",
    price: 89.99,
    tags: "audio,earbuds,wireless,anc",
    image_url: "/images/headphones.jpg"
  },
  {
    id: "p1019",
    name: "Memory Foam Pillow",
    description: "Ergonomic memory foam pillow for neck support.",
    category: "Home",
    price: 44.99,
    tags: "bedding,pillow,memory-foam,sleep",
    image_url: "/images/blanket.jpg"
  },
  {
    id: "p1020",
    name: "Stainless Steel Water Bottle",
    description: "Insulated water bottle keeps drinks cold for 24h.",
    category: "Fitness",
    price: 24.99,
    tags: "fitness,water,bottle,insulated",
    image_url: "/images/yoga_mat.jpg"
  },
  {
    id: "p1021",
    name: "Canvas Tote Bag",
    description: "Eco-friendly canvas tote with reinforced handles.",
    category: "Accessories",
    price: 19.99,
    tags: "bag,canvas,eco-friendly,tote",
    image_url: "/images/scarf.jpg"
  },
  {
    id: "p1022",
    name: "Digital Air Fryer",
    description: "7-quart air fryer with 8 preset cooking modes.",
    category: "Kitchen",
    price: 119.99,
    tags: "kitchen,appliances,air-fryer,cooking",
    image_url: "/images/kettle.jpg"
  },
  {
    id: "p1023",
    name: "Gaming Mouse RGB",
    description: "High-precision gaming mouse with customizable RGB.",
    category: "Electronics",
    price: 49.99,
    tags: "gaming,mouse,pc,rgb",
    image_url: "/images/keyboard.jpg"
  },
  {
    id: "p1024",
    name: "Ceramic Plant Pot Set",
    description: "Set of 3 decorative ceramic plant pots with drainage.",
    category: "Home",
    price: 29.99,
    tags: "home-decor,plants,ceramic,gardening",
    image_url: "/images/coffee_table.jpg"
  },
  {
    id: "p1025",
    name: "Resistance Bands Set",
    description: "5-piece resistance band set for strength training.",
    category: "Fitness",
    price: 19.99,
    tags: "fitness,resistance,bands,strength",
    image_url: "/images/yoga_mat.jpg"
  },
  {
    id: "p1026",
    name: "Portable Phone Charger",
    description: "20000mAh power bank with fast charging.",
    category: "Electronics",
    price: 39.99,
    tags: "charger,portable,battery,phone",
    image_url: "/images/smartwatch.jpg"
  },
  {
    id: "p1027",
    name: "Bamboo Cutting Board",
    description: "Large bamboo cutting board with juice groove.",
    category: "Kitchen",
    price: 24.99,
    tags: "kitchen,cutting-board,bamboo,cooking",
    image_url: "/images/knife.jpg"
  },
  {
    id: "p1028",
    name: "Winter Gloves Touch Screen",
    description: "Thermal gloves with touchscreen-compatible fingertips.",
    category: "Apparel",
    price: 22.99,
    tags: "gloves,winter,touchscreen,warm",
    image_url: "/images/scarf.jpg"
  },
  {
    id: "p1029",
    name: "Portable Bluetooth Projector",
    description: "Mini projector with built-in speakers and WiFi.",
    category: "Electronics",
    price: 199.99,
    tags: "projector,bluetooth,portable,entertainment",
    image_url: "/images/speaker.jpg"
  },
  {
    id: "p1030",
    name: "Aromatherapy Diffuser",
    description: "Ultrasonic essential oil diffuser with LED lights.",
    category: "Home",
    price: 29.99,
    tags: "home,aromatherapy,diffuser,wellness",
    image_url: "/images/lamp.jpg"
  },
  {
    id: "p1031",
    name: "Foam Roller",
    description: "High-density foam roller for muscle recovery.",
    category: "Fitness",
    price: 17.99,
    tags: "fitness,foam-roller,recovery,massage",
    image_url: "/images/yoga_mat.jpg"
  },
  {
    id: "p1032",
    name: "Smart Watch Band",
    description: "Silicone replacement band for smartwatches.",
    category: "Accessories",
    price: 14.99,
    tags: "watch,band,accessory,silicone",
    image_url: "/images/smartwatch.jpg"
  },
  {
    id: "p1033",
    name: "Cast Iron Skillet",
    description: "Pre-seasoned 12-inch cast iron skillet.",
    category: "Kitchen",
    price: 39.99,
    tags: "kitchen,skillet,cast-iron,cooking",
    image_url: "/images/knife.jpg"
  },
  {
    id: "p1034",
    name: "Wireless Charging Pad",
    description: "Fast wireless charger for smartphones.",
    category: "Electronics",
    price: 24.99,
    tags: "charger,wireless,phone,fast-charging",
    image_url: "/images/keyboard.jpg"
  },
  {
    id: "p1035",
    name: "Velvet Throw Pillows",
    description: "Set of 2 luxury velvet decorative pillows.",
    category: "Home",
    price: 34.99,
    tags: "home-decor,pillows,velvet,comfort",
    image_url: "/images/blanket.jpg"
  },
  {
    id: "p1036",
    name: "Jump Rope Speed",
    description: "Adjustable speed jump rope for cardio workouts.",
    category: "Fitness",
    price: 11.99,
    tags: "fitness,jump-rope,cardio,workout",
    image_url: "/images/yoga_mat.jpg"
  },
  {
    id: "p1037",
    name: "Sunglasses Polarized",
    description: "UV400 polarized sunglasses with metal frame.",
    category: "Accessories",
    price: 49.99,
    tags: "sunglasses,polarized,uv-protection,fashion",
    image_url: "/images/scarf.jpg"
  },
  {
    id: "p1038",
    name: "Electric Toothbrush",
    description: "Rechargeable sonic toothbrush with 3 modes.",
    category: "Personal Care",
    price: 59.99,
    tags: "toothbrush,electric,sonic,dental",
    image_url: "/images/smartwatch.jpg"
  },
  {
    id: "p1039",
    name: "Wall Clock Modern",
    description: "Silent quartz wall clock with minimalist design.",
    category: "Home",
    price: 27.99,
    tags: "home-decor,clock,wall,minimalist",
    image_url: "/images/lamp.jpg"
  },
  {
    id: "p1040",
    name: "Dumbbell Set Adjustable",
    description: "Adjustable dumbbell pair 5-25 lbs per hand.",
    category: "Fitness",
    price: 149.99,
    tags: "fitness,dumbbells,weights,strength",
    image_url: "/images/yoga_mat.jpg"
  },
  {
    id: "p1041",
    name: "USB-C Hub Multiport",
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader.",
    category: "Electronics",
    price: 34.99,
    tags: "usb,hub,adapter,multiport",
    image_url: "/images/keyboard.jpg"
  },
  {
    id: "p1042",
    name: "Spice Rack Organizer",
    description: "3-tier bamboo spice rack for kitchen organization.",
    category: "Kitchen",
    price: 22.99,
    tags: "kitchen,organizer,spice-rack,bamboo",
    image_url: "/images/coffee_table.jpg"
  },
  {
    id: "p1043",
    name: "Noise Cancelling Sleep Earbuds",
    description: "Ultra-comfortable sleep earbuds with ambient noise masking.",
    category: "Electronics",
    price: 79.99,
    tags: "audio,sleep,earbuds,wellness",
    image_url: "/images/sleep_earbuds.jpg"
  },
  {
    id: "p1044",
    name: "Stainless Steel French Press",
    description: "Double-wall insulated French press, 34 oz capacity.",
    category: "Kitchen",
    price: 44.99,
    tags: "coffee,french-press,kitchen,stainless-steel",
    image_url: "/images/french_press.jpg"
  },
  {
    id: "p1045",
    name: "Meditation Cushion Set",
    description: "Zafu and zabuton meditation cushion set with organic cotton.",
    category: "Fitness",
    price: 59.99,
    tags: "meditation,wellness,yoga,cushion",
    image_url: "/images/meditation_cushion.jpg"
  },
  {
    id: "p1046",
    name: "Smart LED Bulbs 4-Pack",
    description: "WiFi-enabled color-changing LED bulbs with voice control.",
    category: "Home",
    price: 49.99,
    tags: "smart-home,lighting,led,wifi",
    image_url: "/images/led_bulbs.jpg"
  },
  {
    id: "p1047",
    name: "Leather Journal Notebook",
    description: "Handcrafted leather journal with 200 lined pages.",
    category: "Accessories",
    price: 34.99,
    tags: "journal,notebook,leather,writing",
    image_url: "/images/journal.jpg"
  },
  {
    id: "p1048",
    name: "Titanium Water Filter Bottle",
    description: "Portable water filter bottle removes 99.9% contaminants.",
    category: "Fitness",
    price: 39.99,
    tags: "water,filter,bottle,outdoor",
    image_url: "/images/filter_bottle.jpg"
  },
  {
    id: "p1049",
    name: "Ergonomic Office Chair",
    description: "Adjustable lumbar support chair with breathable mesh.",
    category: "Home",
    price: 249.99,
    tags: "furniture,chair,office,ergonomic",
    image_url: "/images/office_chair.jpg"
  },
  {
    id: "p1050",
    name: "Wireless Gaming Headset",
    description: "7.1 surround sound gaming headset with RGB lighting.",
    category: "Electronics",
    price: 119.99,
    tags: "gaming,headset,audio,wireless",
    image_url: "/images/gaming_headset.jpg"
  },
  {
    id: "p1051",
    name: "Bamboo Laptop Stand",
    description: "Adjustable height bamboo stand for laptops and tablets.",
    category: "Accessories",
    price: 29.99,
    tags: "laptop,stand,bamboo,desk",
    image_url: "/images/laptop_stand.jpg"
  },
  {
    id: "p1052",
    name: "Herb Garden Starter Kit",
    description: "Indoor herb garden with LED grow light and planters.",
    category: "Home",
    price: 54.99,
    tags: "gardening,herbs,indoor,plants",
    image_url: "/images/herb_garden.jpg"
  },
  {
    id: "p1053",
    name: "Compact Blender Pro",
    description: "Personal blender for smoothies with travel cup.",
    category: "Kitchen",
    price: 39.99,
    tags: "blender,kitchen,smoothie,portable",
    image_url: "/images/blender.jpg"
  },
  {
    id: "p1054",
    name: "Running Armband Phone Holder",
    description: "Adjustable armband for phones up to 6.7 inches.",
    category: "Fitness",
    price: 14.99,
    tags: "fitness,running,phone,accessory",
    image_url: "/images/armband.jpg"
  },
  {
    id: "p1055",
    name: "Ceramic Cookware Set",
    description: "Non-stick ceramic cookware set, 10 pieces.",
    category: "Kitchen",
    price: 159.99,
    tags: "cookware,kitchen,ceramic,cooking",
    image_url: "/images/cookware.jpg"
  },
  {
    id: "p1056",
    name: "Wool Winter Beanie",
    description: "Merino wool beanie with fleece lining.",
    category: "Apparel",
    price: 24.99,
    tags: "winter,hat,wool,warm",
    image_url: "/images/beanie.jpg"
  },
  {
    id: "p1057",
    name: "Streaming Webcam 1080p",
    description: "Full HD webcam with auto-focus and noise reduction mic.",
    category: "Electronics",
    price: 69.99,
    tags: "webcam,streaming,video,pc",
    image_url: "/images/webcam.jpg"
  },
  {
    id: "p1058",
    name: "Massage Gun Deep Tissue",
    description: "Percussion massage gun with 6 intensity levels.",
    category: "Fitness",
    price: 89.99,
    tags: "massage,fitness,recovery,wellness",
    image_url: "/images/massage_gun.jpg"
  },
  {
    id: "p1059",
    name: "Smart Door Lock",
    description: "Keyless entry smart lock with fingerprint scanner.",
    category: "Home",
    price: 129.99,
    tags: "smart-home,security,lock,keyless",
    image_url: "/images/door_lock.jpg"
  },
  {
    id: "p1060",
    name: "Portable Espresso Maker",
    description: "Manual espresso maker for travel and camping.",
    category: "Kitchen",
    price: 49.99,
    tags: "coffee,espresso,portable,travel",
    image_url: "/images/espresso_maker.jpg"
  },
  {
    id: "p1061",
    name: "Microfiber Towel Set",
    description: "Quick-dry microfiber towels for gym and travel.",
    category: "Fitness",
    price: 19.99,
    tags: "towel,microfiber,gym,travel",
    image_url: "/images/towel_set.jpg"
  },
  {
    id: "p1062",
    name: "Minimalist Watch",
    description: "Classic minimalist watch with leather strap.",
    category: "Accessories",
    price: 79.99,
    tags: "watch,fashion,minimalist,leather",
    image_url: "/images/minimalist_watch.jpg"
  },
  {
    id: "p1063",
    name: "Air Purifier HEPA",
    description: "HEPA air purifier for rooms up to 500 sq ft.",
    category: "Home",
    price: 149.99,
    tags: "air-purifier,hepa,home,health",
    image_url: "/images/air_purifier.jpg"
  },
  {
    id: "p1064",
    name: "Trail Running Backpack",
    description: "Hydration-compatible running backpack, 12L capacity.",
    category: "Fitness",
    price: 64.99,
    tags: "backpack,running,hiking,hydration",
    image_url: "/images/trail_backpack.jpg"
  },
  {
    id: "p1065",
    name: "Wireless Earbuds Sport",
    description: "Sweat-proof wireless earbuds with ear hooks.",
    category: "Electronics",
    price: 49.99,
    tags: "audio,earbuds,sport,wireless",
    image_url: "/images/sport_earbuds.jpg"
  },
  {
    id: "p1066",
    name: "Cutting Board Set Premium",
    description: "3-piece premium cutting board set with juice grooves.",
    category: "Kitchen",
    price: 34.99,
    tags: "kitchen,cutting-board,cooking,set",
    image_url: "/images/cutting_boards.jpg"
  },
  {
    id: "p1067",
    name: "Insulated Lunch Box",
    description: "Leak-proof insulated lunch box with compartments.",
    category: "Kitchen",
    price: 27.99,
    tags: "lunch,insulated,portable,food",
    image_url: "/images/lunch_box.jpg"
  },
  {
    id: "p1068",
    name: "Standing Desk Converter",
    description: "Adjustable standing desk converter for any desk.",
    category: "Home",
    price: 179.99,
    tags: "desk,standing,ergonomic,office",
    image_url: "/images/desk_converter.jpg"
  },
  {
    id: "p1069",
    name: "Yoga Block Set",
    description: "High-density foam yoga blocks, set of 2.",
    category: "Fitness",
    price: 16.99,
    tags: "yoga,blocks,fitness,foam",
    image_url: "/images/yoga_blocks.jpg"
  },
  {
    id: "p1070",
    name: "Smart Thermostat",
    description: "WiFi-enabled programmable thermostat with app control.",
    category: "Home",
    price: 129.99,
    tags: "smart-home,thermostat,energy,wifi",
    image_url: "/images/thermostat.jpg"
  },
  {
    id: "p1071",
    name: "Denim Jacket Classic",
    description: "Vintage-style denim jacket with button closure.",
    category: "Apparel",
    price: 69.99,
    tags: "jacket,denim,fashion,casual",
    image_url: "/images/denim_jacket.jpg"
  },
  {
    id: "p1072",
    name: "Wireless Mouse Ergonomic",
    description: "Vertical ergonomic mouse reduces wrist strain.",
    category: "Electronics",
    price: 34.99,
    tags: "mouse,ergonomic,wireless,pc",
    image_url: "/images/ergonomic_mouse.jpg"
  },
  {
    id: "p1073",
    name: "Tea Infuser Bottle",
    description: "Glass tea infuser bottle with bamboo lid.",
    category: "Kitchen",
    price: 22.99,
    tags: "tea,infuser,glass,portable",
    image_url: "/images/tea_infuser.jpg"
  },
  {
    id: "p1074",
    name: "Workout Resistance Bands",
    description: "5-level resistance bands set with handles.",
    category: "Fitness",
    price: 24.99,
    tags: "resistance,bands,fitness,strength",
    image_url: "/images/resistance_bands.jpg"
  },
  {
    id: "p1075",
    name: "Wall Shelf Floating Set",
    description: "Modern floating wall shelves, set of 3.",
    category: "Home",
    price: 44.99,
    tags: "shelves,wall,home-decor,floating",
    image_url: "/images/wall_shelves.jpg"
  },
  {
    id: "p1076",
    name: "Bluetooth Headband Sleep",
    description: "Soft headband with built-in Bluetooth speakers.",
    category: "Electronics",
    price: 29.99,
    tags: "audio,sleep,headband,bluetooth",
    image_url: "/images/sleep_headband.jpg"
  },
  {
    id: "p1077",
    name: "Stainless Steel Straws Set",
    description: "Reusable metal straws with cleaning brush.",
    category: "Kitchen",
    price: 12.99,
    tags: "straws,reusable,eco-friendly,kitchen",
    image_url: "/images/metal_straws.jpg"
  },
  {
    id: "p1078",
    name: "Fitness Tracker Band",
    description: "Activity tracker with heart rate and sleep monitor.",
    category: "Fitness",
    price: 39.99,
    tags: "fitness,tracker,wearable,health",
    image_url: "/images/fitness_tracker.jpg"
  },
  {
    id: "p1079",
    name: "Canvas Wall Art Set",
    description: "Modern abstract canvas prints, set of 3.",
    category: "Home",
    price: 79.99,
    tags: "art,canvas,home-decor,wall",
    image_url: "/images/wall_art.jpg"
  },
  {
    id: "p1080",
    name: "Laptop Sleeve 15 inch",
    description: "Padded laptop sleeve with front pocket.",
    category: "Accessories",
    price: 19.99,
    tags: "laptop,sleeve,protection,accessory",
    image_url: "/images/laptop_sleeve.jpg"
  },
  {
    id: "p1081",
    name: "Smart Doorbell Camera",
    description: "HD video doorbell with two-way audio.",
    category: "Home",
    price: 99.99,
    tags: "smart-home,security,doorbell,camera",
    image_url: "/images/doorbell.jpg"
  },
  {
    id: "p1082",
    name: "Organic Cotton T-Shirt",
    description: "Premium organic cotton crew neck tee.",
    category: "Apparel",
    price: 29.99,
    tags: "shirt,cotton,organic,casual",
    image_url: "/images/tshirt.jpg"
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Seeding products...');

    // Insert products
    const { data: insertedProducts, error: productError } = await supabase
      .from('products')
      .upsert(products, { onConflict: 'id' })
      .select();

    if (productError) {
      console.error('Error inserting products:', productError);
      throw productError;
    }

    console.log(`Successfully seeded ${insertedProducts?.length || 0} products (82 total)`);

    // Create demo user if not exists
    const demoUser = {
      id: 'demo_user_001',
      name: 'Demo User',
      email: 'demo@example.com',
      preferences: 'audio,fitness,home-decor'
    };

    const { error: userError } = await supabase
      .from('users')
      .upsert(demoUser, { onConflict: 'id' });

    if (userError) {
      console.error('Error creating demo user:', userError);
    } else {
      console.log('Demo user created/updated');
    }

    // Create some sample interactions for the demo user
    const sampleInteractions = [
      { user_id: 'demo_user_001', product_id: 'p1009', event_type: 'view', event_value: null },
      { user_id: 'demo_user_001', product_id: 'p1006', event_type: 'purchase', event_value: 149.00 },
      { user_id: 'demo_user_001', product_id: 'p1002', event_type: 'click', event_value: null },
      { user_id: 'demo_user_001', product_id: 'p1005', event_type: 'view', event_value: null },
      { user_id: 'demo_user_001', product_id: 'p1001', event_type: 'click', event_value: null },
    ];

    const { error: interactionError } = await supabase
      .from('interactions')
      .insert(sampleInteractions);

    if (interactionError) {
      console.log('Note: Sample interactions may already exist');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Products seeded successfully',
        count: insertedProducts?.length || 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in seed-products function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});