export type TProduct = {
  product_name: string;
  description: string;
  min_price: number;
  max_price: number;
  regular_price: number;
  sale_price?: number;
  stock_quantity: number;
  stock_status: "In Stock" | "Out of Stock" | "Preorder";
  attributes: {
    attribute_name: string;
    values: {
      value: string;
      price: number;
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
