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
  price: number;
  brand: string;
  sku: string;
  currency: string;
  materials: [string];
  sale_price?: number;
  stock: number;
  availability: "In Stock" | "Out of Stock" | "Preorder";
  attributes: {
    attribute_name: string;
    values: {
      value: string;
      price: number;
      image?: string;
      quantity: number;
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
