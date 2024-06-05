import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role: string;
  _id: string;
  dob: Date;
}
export interface NewProductRequestBody {
  name: string;
  photo: string;
  price: number;
  stock: number;
  category: string;
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export interface BaseQuery {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: { $lte: number };
  category?: string;
}

export type InValidateCacheProps = {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  userId?: string;
  orderId?: string;
};

export type orderItemType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
};

export type shippingInfoType = {
  address: string;
  city: string;
  state: number;
  country: number;
  pinCode: number;
};

export interface NewOrderRequestBody {
  shippingInfo: shippingInfoType;
  user: string;
  subTotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItems: orderItemType[];
}
