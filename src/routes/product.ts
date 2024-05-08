import { Router } from "express";
import {
  getLatestProducts,
  getAllCategories,
  newProduct,
} from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
import { adminOnly } from "../middlewares/adminOnly.js";

const router = Router();

//route- /api/v1/product/...

router.post("/new", adminOnly, singleUpload, newProduct);
router.get("/latest", getLatestProducts);
router.get("/categories", getAllCategories);

export default router;
