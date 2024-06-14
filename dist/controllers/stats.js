import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/features.js";
export const getDashboardStats = TryCatch(async (req, res, next) => {
    let stats = {};
    const key = "admin-stats";
    if (myCache.has(key)) {
        stats = JSON.parse(myCache.get(key));
    }
    else {
        const today = new Date(); //here the last day of this month is today obiosly because we can no go to future and make changes in stats.. so from today we can decode the last month
        const sixMonthAgo = new Date();
        sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);
        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today,
        };
        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            //here 0 means ex: if today 23th october ;
            // last month's last date is , today's month is october and if october 0 means its september 30th  );
            // 0 specifies the day of the month (which effectively gives the last day of the previous month).
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
        const lastSixMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: sixMonthAgo,
                $lte: today,
            },
        });
        const latestTransactionPromise = Order.find({})
            .select(["orderItems", "discount", "total", "status"])
            .limit(4);
        const [thisMonthProducts, thisMonthOrders, thisMonthUsers, lastMonthProducts, lastMonthOrders, lastMonthUsers, productsCount, usersCount, allOrders, lastSixMonthOrders, categories, femaleUserCount, latestTransaction,] = await Promise.all([
            thisMonthProductsPromise,
            thisMonthOrdersPromise,
            thisMonthUsersPromise,
            lastMonthProductsPromise,
            lastMonthOrdersPromise,
            lastMonthUsersPromise,
            Product.countDocuments(),
            User.countDocuments(),
            Order.find({}).select("total"),
            lastSixMonthOrdersPromise,
            Product.distinct("category"),
            User.countDocuments({ gender: "female" }),
            latestTransactionPromise,
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
            order: allOrders.length,
        };
        const orderMonthCounts = new Array(6).fill(0);
        const orderMonthRevenue = new Array(6).fill(0);
        //for BarChart of home page..
        lastSixMonthOrders.forEach((order) => {
            const creationDate = order.createdAt;
            const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
            // working flow: createmonth : 10 as per 0 base indexing , today month : 5 => so,  monthDiff = 5, so at 0th index it will be increase by 1
            //if month diffrence less than 6..
            if (monthDiff < 6) {
                //5 bcz of last index of the oorderMonthCount array.
                orderMonthCounts[5 - monthDiff] += 1;
                orderMonthRevenue[5 - monthDiff] += order.total;
            }
        });
        //for make key value pair of the categories.
        const categoriesCountPromise = categories.map((category) => Product.countDocuments({ category }));
        //did promise.all because for every category it awaits and also have to made the function async .
        const categoriesCount = await Promise.all(categoriesCountPromise);
        const categoryCount = [];
        //Without the square brackets, category would be interpreted as a literal property name, not a variable.
        categories.forEach((category, i) => {
            categoryCount.push({
                [category]: Math.round((categoriesCount[i] / productsCount) * 100),
            });
        });
        //ration of men & women..
        const userRatio = {
            male: usersCount - femaleUserCount,
            female: femaleUserCount,
        };
        //latest modified Transaction
        const modifiedLatestTransaction = latestTransaction.map((i) => ({
            _id: i._id,
            discount: i.discount,
            amount: i.total,
            quantity: i.orderItems.length,
            status: i.status,
        }));
        stats = {
            changePercent,
            count,
            chart: {
                order: orderMonthCounts,
                revenue: orderMonthRevenue,
            },
            categoryCount,
            userRatio,
            latestTransaction: modifiedLatestTransaction,
        };
        myCache.set(key, JSON.stringify(stats));
    }
    return res.status(200).json({
        success: true,
        stats,
    });
});
export const getPieCharts = TryCatch(async (req, res, next) => {
    let charts;
    const key = "admin-pie-charts";
    if (myCache.has(key)) {
        charts = JSON.parse(myCache.get(key));
    }
    else {
        const allOrdersPromise = Order.find({}).select([
            "total",
            "discount",
            "subTotal",
            "tax",
            "shippingCharges",
        ]);
        const [processingOrder, shippedOrder, deliveredOrder, categories, productsCount, productsOutOfStock, allOrders, allUsers, adminUsers, customers,] = await Promise.all([
            Order.countDocuments({ status: "Processing" }),
            Order.countDocuments({ status: "Shipped" }),
            Order.countDocuments({ status: "Delivered" }),
            Product.distinct("category"),
            Product.countDocuments(),
            Product.countDocuments({ stock: 0 }),
            allOrdersPromise,
            User.find({}).select(["dob"]), //here use select dob because in age function there are use in dob directly.
            User.countDocuments({ role: "admin" }),
            User.countDocuments({ role: "user" }),
        ]);
        const orderFullfillmentRatio = {
            processing: processingOrder,
            shipping: shippedOrder,
            delivered: deliveredOrder,
        };
        const categoriesCountPromise = categories.map((category) => Product.countDocuments({ category }));
        //did promise.all because for every category it awaits and also have to made the function async .
        const categoriesCount = await Promise.all(categoriesCountPromise);
        const categoryCount = [];
        //Without the square brackets, category would be interpreted as a literal property name, not a variable.
        categories.forEach((category, i) => {
            categoryCount.push({
                [category]: Math.round((categoriesCount[i] / productsCount) * 100),
            });
        });
        //for stock avalability..
        const stockAvailability = {
            inStock: productsCount - productsOutOfStock,
            outOfStock: productsOutOfStock,
        };
        const grossIncome = allOrders.reduce((prev, order) => prev + (order.total || 0), 0);
        const totalDiscount = allOrders.reduce((prev, order) => prev + (order.discount || 0), 0);
        const productionCost = allOrders.reduce((prev, order) => prev + (order.shippingCharges || 0), 0);
        const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
        const marketingCost = Math.round(grossIncome * (30 / 100));
        const netMargin = grossIncome - (totalDiscount + productionCost + burnt + marketingCost);
        const revenueDistribution = {
            netMargin,
            totalDiscount,
            productionCost,
            burnt,
            marketingCost,
        };
        const adminCustomer = {
            admin: adminUsers,
            customer: customers,
        };
        const usersAgeGroup = {
            // access virtual properties directly on an instance of the model USer
            teen: allUsers.filter((i) => i.age < 20).length,
            adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
            old: allUsers.filter((i) => i.age >= 40).length,
        };
        charts = {
            orderFullfillmentRatio,
            categoryCount,
            stockAvailability,
            revenueDistribution,
            adminCustomer,
            usersAgeGroup,
        };
        myCache.set(key, JSON.stringify(charts));
    }
    res.status(200).json({
        success: true,
        charts,
    });
});
export const getBarCharts = TryCatch(async (req, res, next) => {
    let charts;
    const key = "admin-bar-charts";
    if (myCache.has(key)) {
        //here as string or ! operator bcz the parse expect the string or undefined but if there are has key? so it can not be undefined
        charts = JSON.parse(myCache.get(key));
    }
    else {
        const today = new Date();
        let sixMonthAgo = new Date();
        sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);
        let twelveMonthAgo = new Date();
        sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 12);
        const lastSixMonthProductsPromise = Product.find({
            createdAt: {
                $gte: sixMonthAgo,
                $lte: today,
            },
        });
        const lastSixMonthUsersPromise = User.find({
            createdAt: {
                $gte: sixMonthAgo,
                $lte: today,
            },
        });
        const lastTwelveMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: twelveMonthAgo,
                $lte: today,
            },
        });
        const [lastSixMonthProducts, lastSixMonthUsers, lastTwelveMonthOrders] = await Promise.all([
            lastSixMonthProductsPromise,
            lastSixMonthUsersPromise,
            lastTwelveMonthOrdersPromise,
        ]);
        const lastSixMonthProductsCount = new Array(6).fill(0);
        lastSixMonthProducts.forEach((product) => {
            const today = new Date();
            const creationDate = product.createdAt;
            const monthDiff = today.getMonth() - creationDate.getMonth();
            if (monthDiff < 6) {
                lastSixMonthProductsCount[5 - monthDiff] += 1;
            }
        });
        charts = {
            product: lastSixMonthProductsCount,
        };
        myCache.set(key, JSON.stringify(charts));
    }
    res.status(200).json({
        success: true,
        charts,
    });
});
export const getLineCharts = TryCatch(async (req, res, next) => { });
