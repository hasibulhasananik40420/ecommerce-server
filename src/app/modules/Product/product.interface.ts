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
  variants: {
    variant_name: string;
    values: {
      value: string;
      price: number;
      image: string[];
      sizes?: {size : string, stock : Number}[];
      quantity?: number;
    }[];
  }[];
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
