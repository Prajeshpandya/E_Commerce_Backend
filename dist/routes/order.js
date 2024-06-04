import { Router } from "express";
import { newOrder } from "../controllers/order.js";
const router = Router();
//route- /api/v1/order/...
router.post("/new", newOrder);
export default router;
