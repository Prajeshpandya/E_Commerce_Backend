import { Router } from "express";
import { getLatestProducts, getAllCategories, newProduct, getAdminProducts, getSingleProduct, updateProduct, deleteProduct, getAllProducts, newReview, getReviews, } from "../controllers/product.js";
import { multiUpload, singleUpload } from "../middlewares/multer.js";
import { adminOnly } from "../middlewares/adminOnly.js";
const router = Router();
//route- /api/v1/product/...
router.post("/new", adminOnly, multiUpload, newProduct);
router.get("/latest", getLatestProducts);
router.get("/all", getAllProducts);
router.get("/categories", getAllCategories);
router.get("/admin-products", adminOnly, getAdminProducts);
router.post("/newreview", newReview);
router.get("/getreviews", getReviews);
router
    .route("/:id")
    .get(getSingleProduct)
    .put(adminOnly, singleUpload, updateProduct)
    .delete(adminOnly, deleteProduct);
export default router;
