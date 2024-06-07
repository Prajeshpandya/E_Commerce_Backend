import { Router } from "express";
import { allCoupons, applyDiscount, deleteCoupon, newCoupon } from "../controllers/payment.js";
const router = Router();
//route- /api/v1/payment/...
router.get("/discount", applyDiscount);
router.post("/coupon/new", newCoupon);
router.get("/discount/all", allCoupons);
router.delete("/coupon/:id", deleteCoupon);
export default router;
