export type TVariant = 
  {
    color: string;
    colorCode: string;
    image: string;
    sizes?: { size: string; stock: number; price: number }[];
  }[]


export type TProduct = {
  name: string;
  product_type: string;
  image: string;
  rating: number;
  reviewsCount: number;
  images: string[];
  description: string;
  min_price: number;
  max_price: number;
  brand: string;
  sku: string;
  currency: string;
  materials: [string];
  onSale?: boolean;
  price: number;
  discountPrice?: number;
  stock: number;
  availability: "In Stock" | "Out of Stock" | "Pre Order";
  variants?: TVariant;
  weight?: number;
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
  };
  category: string;
  subcategory: string;
  item: string;
  tags: string[];
  status: "Draft" | "Published";
  publish_date?: Date;
};
