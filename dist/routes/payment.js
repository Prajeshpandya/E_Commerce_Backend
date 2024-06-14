import { Router } from "express";
import { allCoupons, applyDiscount, createPaymentIntent, deleteCoupon, newCoupon, } from "../controllers/payment.js";
import { adminOnly } from "../middlewares/adminOnly.js";
const router = Router();
//route- /api/v1/payment/...
router.post("/create", createPaymentIntent);
router.get("/discount", applyDiscount);
router.get("/discount/all", adminOnly, allCoupons);
router.post("/coupon/new", adminOnly, newCoupon);
router.delete("/coupon/:id", adminOnly, deleteCoupon);
export default router;
