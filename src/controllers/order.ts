import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { NewOrderRequestBody } from "../types/type.js";
import { Request } from "express";
import { inValidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utilityClass.js";

export const newOrder = TryCatch(
  async (req: Request<{}, {}, NewOrderRequestBody>, res, next) => {
    const {
      shippingInfo,
      orderItems,
      user,
      subTotal,
      discount,
      total,
      shippingCharges,
      tax,
    } = req.body;

    if (
      !shippingInfo ||
      !orderItems ||
      !user ||
      !subTotal ||
      !discount ||
      !total ||
      !shippingCharges ||
      !tax
    )
      return next(new ErrorHandler("Please add the all valid Credentials!", 400));

    await Order.create({
      shippingInfo,
      orderItems,
      user,
      subTotal,
      discount,
      total,
      shippingCharges,
      tax,
    });

    await reduceStock(orderItems);
    await inValidateCache({ product: true, order: true, admin: true });

    res.status(201).json({
      success: "true",
      message: "Your Order Has Been Placed Successfully!",
    });
  }
);
