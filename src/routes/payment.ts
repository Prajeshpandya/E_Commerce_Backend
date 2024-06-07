import { Router } from "express"
import { allCoupons, applyDiscount, newCoupon } from "../controllers/payment.js";

const router = Router();

//route- /api/v1/payment/...

router.post("/coupon/new",newCoupon);
router.get("/discount",applyDiscount);
router.get("/discount/all",allCoupons);



export default router;