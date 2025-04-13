// Review Type for type checking in TypeScript
export interface IReview {
  productId: string;
  user: string;
  rating: number;
  images: string[];
  description: string;
  createdAt: Date;
}
