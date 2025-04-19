/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, Query } from "mongoose";
import moment from "moment-timezone";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
    console.log(this.query)
  }

  // search(searchableFields: string[]) {
    
  //   const searchTerm = this?.query?.searchTerm as string;
    
  //   if (searchTerm) {
  //     this.modelQuery = this.modelQuery.find({
  //       $or: searchableFields.map(
  //         (field) =>
  //           ({
  //             [field]: { $regex: searchTerm, $options: "i" },
  //           }) as FilterQuery<T>
  //       ),
  //     });
  //   }
  //   return this;
  // }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm as string;
    
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => {
          // Check if the field is "tags" and use $in for array fields, else use $regex for strings
          if (field === "tags") {
            return {
              [field]: { $in: [new RegExp(searchTerm, "i")] },
            };
          } else {
            return {
              [field]: { $regex: searchTerm, $options: "i" },
            };
          }
        }),
      });
    }
  
    return this;
  }

  
  filter() {
    if (this.query.onSale === "true") {
      this.modelQuery = this.modelQuery.find({ onSale: true });
    }
    delete this.query.onSale;
    if (this.query.today === "today") {
      const dateField = "updatedAt";
      const startOfDay = new Date();
      const endOfDay = new Date();
      startOfDay.setUTCHours(0, 0, 0, 0);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const filterCondition: any = {
        [dateField]: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      };

      this.modelQuery = this.modelQuery.find(filterCondition as FilterQuery<T>);
      delete this.query.today;
    } else {
      delete this.query.today;
    }

    // ✅ Price range filter added here
    if (this.query.price && typeof this.query.price === "string") {
      const [minPrice, maxPrice] = this.query.price.split(",").map(Number);

      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        this.modelQuery = this.modelQuery.find({
          price: { $gte: minPrice, $lte: maxPrice },
        });
      }

      delete this.query.price;
    }

    const queryObj = Object.fromEntries(
      Object.entries(this.query).map(([key, value]) => [
        key.trim(),
        value === "null" || value === "" ? null : value,
      ])
    );

    if (typeof queryObj.orderStatus === "string") {
      queryObj.orderStatus = queryObj.orderStatus
        .split(",")
        .map((status) => status.trim());
    }

    const excludeFields = [
      "searchTerm",
      "sort",
      "limit",
      "page",
      "fields",
      "categories",
      "startDate",
      "endDate",
      "fromDate",
      "toDate",
    ];
    excludeFields.forEach((el) => delete queryObj[el]);

    for (const key in queryObj) {
      if (queryObj[key] === null) {
        delete queryObj[key];
      }
    }

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  todyOrder(dateField: string) {
    if (!dateField) {
      return this;
    }

    const orderDate = this.query.todyOrder as string;
    if (!orderDate) {
      return this;
    }

    const isValidDate = (date: string) => date && !isNaN(Date.parse(date));

    const validFromDate = isValidDate(orderDate);

    if (validFromDate) {
      const filterCondition: any = {
        [dateField]: {},
      };

      if (validFromDate) {
        const startOfDay = new Date();
        const endOfDay = new Date();
        startOfDay.setUTCHours(0, 0, 0, 0);
        endOfDay.setUTCHours(23, 59, 59, 999);
        filterCondition[dateField].$gte = startOfDay;
        filterCondition[dateField].$lte = endOfDay;
      }

      this.modelQuery = this.modelQuery.find(filterCondition as FilterQuery<T>);
    }

    return this;
  }
  dateFilterOne(dateField: string) {
    if (!dateField) {
      return this;
    }

    const orderDate = this.query.fromDate as string;

    const isValidDate = (date: string) => date && !isNaN(Date.parse(date));

    const validFromDate = isValidDate(orderDate);

    if (validFromDate) {
      const filterCondition: any = {
        [dateField]: {},
      };

      if (validFromDate) {
        const startOfDay = new Date(orderDate);
        const endOfDay = new Date(orderDate);
        startOfDay.setUTCHours(0, 0, 0, 0);
        endOfDay.setUTCHours(23, 59, 59, 999);
        filterCondition[dateField].$gte = startOfDay;
        filterCondition[dateField].$lte = endOfDay;
      }

      this.modelQuery = this.modelQuery.find(filterCondition as FilterQuery<T>);
    }

    return this;
  }

  dateFilterTow(dateField: string) {
    if (!dateField) {
      return this;
    }

    const devilryDate = this.query.toDate as string;

    const isValidDate = (date: string) => date && !isNaN(Date.parse(date));

    const validToDate = isValidDate(devilryDate);

    if (validToDate) {
      const filterCondition: any = {
        [dateField]: {},
      };

      if (validToDate) {
        const startOfDay = moment
          .tz(devilryDate, "Asia/Dhaka")
          .startOf("day")
          .toDate();
        const endOfDay = moment
          .tz(devilryDate, "Asia/Dhaka")
          .endOf("day")
          .toDate();

        filterCondition[dateField].$gte = startOfDay;
        filterCondition[dateField].$lte = endOfDay;
      }

      this.modelQuery = this.modelQuery.find(filterCondition as FilterQuery<T>);
    }

    return this;
  }

  dateFilter(dateField: string) {
    if (!dateField) {
      return this;
    }

    const fromDate = this.query.startDate as string;
    const toDate = this.query.endDate as string;

    const isValidDate = (date: string) => date && !isNaN(Date.parse(date));
    const validFromDate = isValidDate(fromDate);
    const validToDate = isValidDate(toDate);

    if (!validFromDate || !validToDate) {
      return this;
    }

    const filterCondition: any = {
      [dateField]: {},
    };

    const startOfDay = new Date(fromDate);
    startOfDay.setUTCHours(18, 0, 0, 0);
    filterCondition[dateField].$gte = startOfDay;

    const endOfDay = new Date(toDate);
    endOfDay.setUTCHours(17, 59, 59, 999);
    filterCondition[dateField].$lte = endOfDay;

    this.modelQuery = this.modelQuery.find(filterCondition as FilterQuery<T>);
    return this;
  }

  // sort() {
  //   const sort =
  //     (this?.query?.sort as string)?.split(",")?.join(" ") || "-createdAt";
  //   this.modelQuery = this.modelQuery.sort(sort as string);
  //   return this;
  // }
  sort() {
    const sortParam = this.query.sort as string;

    if (sortParam === "lowPrice") {
      this.modelQuery = this.modelQuery.sort({ price: 1 });
    } else if (sortParam === "highPrice") {
      this.modelQuery = this.modelQuery.sort({ price: -1 });
    } else if (sortParam === "latest" || !sortParam) {
      this.modelQuery = this.modelQuery.sort({ createdAt: -1 });
    }

    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 20;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(",")?.join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  populate(path: string, select?: string) {
    this.modelQuery = this.modelQuery.populate(path, select);
    return this;
  }

  async countTotal() {
    const filteredQuery = this.modelQuery.model.find(
      this.modelQuery.getFilter()
    );
    const total = await filteredQuery.countDocuments();

    // Check if no documents found after filtering
    if (total === 0) {
      return {
        page: Number(this.query.page) || 1,
        limit: Number(this.query.limit) || 20,
        total: 0,
        totalPage: 0,
      };
    }

    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 20;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
