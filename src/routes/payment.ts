import { Router } from "express"
import { allCoupons, applyDiscount, deleteCoupon, newCoupon } from "../controllers/payment.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const router = Router();

//route- /api/v1/payment/...
//test all the apis in postman

router.get("/discount", applyDiscount);

router.post("/coupon/new",adminOnly ,newCoupon);
router.get("/discount/all",adminOnly,allCoupons);
router.delete("/coupon/:id",adminOnly,deleteCoupon);


export default router;