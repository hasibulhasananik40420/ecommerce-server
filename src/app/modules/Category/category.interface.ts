import { Schema } from "mongoose";

export type TCategory = {
  category_name: string;
  slug: string;
};

export type TSubCategory = {
  sub_category_name: string;
  slug: string;
  parent_category_id: Schema.Types.ObjectId;
};

export type TThirdCategory = {
  category_name: string;
  slug: string;
  parent_category_id: Schema.Types.ObjectId;
  sub_category_id: Schema.Types.ObjectId;
};
