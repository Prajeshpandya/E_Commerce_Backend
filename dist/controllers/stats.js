import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/features.js";
export const getDashboardStats = TryCatch(async (req, res, next) => {
    let stats = {};
    if (myCache.has("admin-stats")) {
        stats = JSON.parse(myCache.get("admin-stats"));
    }
    else {
        const today = new Date(); //here the last day of this month is today obiosly because we can no go to future and make changes in stats.. so from today we can decode the last month
        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today,
        };
        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            //here 0 means ex: if today 23th october ;
            // last month's last date is , today's month is october and if october 0 means its september 30st   );
            end: new Date(today.getFullYear(), today.getMonth(), 0),
        };
        const thisMonthProductsPromise = Product.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });
        const lastMonthProductsPromise = Product.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });
        const thisMonthUsersPromise = User.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });
        const lastMonthUsersPromise = User.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });
        const thisMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });
        const lastMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });
        const [thisMonthProducts, thisMonthOrders, thisMonthUsers, lastMonthProducts, lastMonthOrders, lastMonthUsers, productsCount, usersCount, allOrders,] = await Promise.all([
            thisMonthProductsPromise,
            thisMonthOrdersPromise,
            thisMonthUsersPromise,
            lastMonthProductsPromise,
            lastMonthOrdersPromise,
            lastMonthUsersPromise,
            Product.countDocuments(),
            User.countDocuments(),
            Order.find({}).select("total"),
        ]);
        const thisMonthRevenue = thisMonthOrders.reduce((total, order) => total + (order.total || 0), 
        //   order: The current order object in the iteration.
        0 // Initial value of the accumulator(total)
        );
        const lastMonthRevenue = lastMonthOrders.reduce((total, order) => total + (order.total || 0), 
        //   order: The current order object in the iteration.
        0 // Initial value of the accumulator(total)
        );
        const changePercent = {
            user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
            revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
            product: calculatePercentage(thisMonthProducts.length, lastMonthProducts.length),
            order: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length),
        };
        const revenue = allOrders.reduce((total, order) => total + (order.total || 0), 
        //   order: The current order object in the iteration.
        0 // Initial value of the accumulator(total)
        );
        const count = {
            revenue,
            user: usersCount,
            product: productsCount,
            order: allOrders.length
        };
        stats = {
            changePercent,
            count
        };
    }
    return res.status(200).json({
        success: true,
        stats,
    });
});
export const getPieCharts = TryCatch(async (req, res, next) => { });
export const getBarCharts = TryCatch(async (req, res, next) => { });
export const getLineCharts = TryCatch(async (req, res, next) => { });
