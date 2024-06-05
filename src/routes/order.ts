import { Router } from "express";

import { myOrders, newOrder } from "../controllers/order.js";

const router = Router();

//route- /api/v1/order/...
router.post("/new", newOrder);
router.get("/my", myOrders);
router.post("/new", newOrder);


export default router;
