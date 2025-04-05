import { ObjectId } from 'mongoose';

export type TProduct = {
  product_name: string;
  description: string;
  regular_price: number;
  sale_price?: number;
  stock_quantity: number;
  stock_status: 'In Stock' | 'Out of Stock' | 'Preorder';
  attributes: {
    attribute_name: string;
    values: string[];
  }[];
  primary_image: string;
  gallery_images: string[];
  weight?: number;
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
  };
  categories: ObjectId[];  // Array of category references
  tags: string[];
  status: 'Draft' | 'Published';
  publish_date?: Date;
};
