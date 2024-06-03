import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utilityClass.js";
import { rm } from "fs";
import { myCache } from "../app.js";
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler("Please Add Photo ", 400));
    if (!name || !price || !stock || !category) {
        rm(photo.path, () => console.log("deleted"));
        return next(new ErrorHandler("Please enter all fields  ", 400));
    }
    await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo.path,
    });
    return res.status(201).json({
        success: "true",
        message: "Product created successfully",
    });
});
export const getLatestProducts = TryCatch(async (req, res, next) => {
    let products = [];
    if (myCache.has("latest-product"))
        products = JSON.parse(myCache.get("latest-product"));
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    myCache.set("latest-product", JSON.stringify(products));
    return res.status(200).json({
        success: "true",
        products,
    });
});
export const getAllCategories = TryCatch(async (req, res, next) => {
    const categories = await Product.distinct("category");
    return res.status(200).json({
        success: "true",
        categories,
    });
});
export const getAdminProducts = TryCatch(async (req, res, next) => {
    const products = await Product.find({});
    return res.status(200).json({
        success: "true",
        products,
    });
});
export const getSingleProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Product Not Found!", 404));
    return res.status(200).json({
        success: "true",
        product,
    });
});
export const updateProduct = TryCatch(async (req, res, next) => {
    //here change controller type req to any.. for pass id to string! or do directly bcz here not all field is required
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Product Not Found!", 404));
    if (photo) {
        rm(product.photo, () => console.log("deleted old photo"));
        product.photo = photo.path;
    }
    console.log(name, category, stock);
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    await product.save();
    return res.status(200).json({
        success: "true",
        message: "Product Updated successfully",
        // product
    });
});
export const deleteProduct = TryCatch(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product)
        return next(new ErrorHandler("Product Not Found!", 404));
    rm(product.photo, () => console.log("Product Photo Deleted"));
    await Product.deleteOne();
    return res.status(200).json({
        success: "true",
        message: "Product Deleted successfully",
    });
});
export const getAllProducts = TryCatch(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit; //example page 2 and limit 8; so at the page number 2 the first 8 product are skipped!
    const baseQuery = {};
    if (search)
        baseQuery.name = {
            $regex: search, //give result if the search name is part of that substring, not exact but substring allow
            $options: "i", //for case insensitive
        };
    if (price)
        baseQuery.price = {
            $lte: Number(price), //return product that PRICE >= product_P
        };
    if (category)
        baseQuery.category = category;
    const productsPromise = Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip);
    const [products, filteredOnlyProduct] = await Promise.all([
        productsPromise,
        Product.find(baseQuery),
    ]);
    // const filteredOnlyproduct = await Product.find(baseQuery); //because total page is according to total product that satisfy the baseQuery condition
    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);
    return res.json({
        success: "true",
        products,
        totalPage,
    });
});
// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];
//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploads\\a9e5262b-2b45-4436-b619-e28a1097256e.png",
//       price: faker.commerce.price({ min: 1500, max: 80000, dec: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, dec: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };
//     products.push(product);
//   }
//   await Product.create(products);
//   console.log({ succecss: true });
// };
// const deleteRandomsProducts = async (count: number = 20) => {
//   const products = await Product.find({}).skip(2);
//   for (let i = 0; i < products.length; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }
//   console.log({ succecss: true });
// };
// deleteRandomsProducts(25)
