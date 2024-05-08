import { Router } from "express";
import { getLatestProducts, getAllCategories, newProduct, getAdminProducts, getSingleProduct, updateProduct, } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
import { adminOnly } from "../middlewares/adminOnly.js";
const router = Router();
//route- /api/v1/product/...
router.post("/new", adminOnly, singleUpload, newProduct);
router.get("/latest", getLatestProducts);
router.get("/categories", getAllCategories);
router.get("/admin-products", getAdminProducts);
router.route("/:id").get(getSingleProduct).put(singleUpload, updateProduct);
export default router;
