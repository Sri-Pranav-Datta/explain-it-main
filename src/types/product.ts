export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  tags: string;
  image_url: string;
  score?: number;
}

export interface Explanation {
  explanation: string;
  highlights: string[];
  context?: {
    user: string;
    product: string;
  };
}

export interface Interaction {
  user_id: string;
  product_id: string;
  event_type: 'view' | 'click' | 'add_to_cart' | 'purchase';
  event_value?: number;
}