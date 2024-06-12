import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage } from "../utils/features.js";

export const getDashboardStats = TryCatch(async (req, res, next) => {
  let stats = {};

  if (myCache.has("admin-stats")) {
    stats = JSON.parse(myCache.get("admin-stats")!);
  } else {
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

    const [
      thisMonthProducts,
      thisMonthOrders,
      thisMonthUsers,
      lastMonthProducts,
      lastMonthOrders,
      lastMonthUsers,
      productsCount,
      usersCount,
      allOrders,
      sixMonthAgoOrders,
      categories,
      femaleUserCount,
      latestTransaction
    ] = await Promise.all([
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
      latestTransactionPromise
    ]);

    const thisMonthRevenue = thisMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      //   order: The current order object in the iteration.
      0 // Initial value of the accumulator(total)
    );
    const lastMonthRevenue = lastMonthOrders.reduce(
      (total, order) => total + (order.total || 0),
      //   order: The current order object in the iteration.
      0 // Initial value of the accumulator(total)
    );

    const changePercent = {
      user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
      revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
      product: calculatePercentage(
        thisMonthProducts.length,
        lastMonthProducts.length
      ),
      order: calculatePercentage(
        thisMonthOrders.length,
        lastMonthOrders.length
      ),
    };

    const revenue = allOrders.reduce(
      (total, order) => total + (order.total || 0),
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
    sixMonthAgoOrders.forEach((order) => {
      const creationDate = order.createdAt;
      const monthDiff = today.getMonth() - creationDate.getMonth();

      // working flow: createmonth : 10 as per 0 base indexing , today month : 5 => so,  monthDiff = 5, so at 0th index it will be increase by 1

      //if month diffrence less than 6..
      if (monthDiff < 6) {
        //5 bcz of last index of the oorderMonthCount array.
        orderMonthCounts[5 - monthDiff] += 1;
        orderMonthRevenue[5 - monthDiff] += order.total;
      }
    });

    //for make key value pair of the categories.
    const categoriesCountPromise = categories.map((category) =>
      Product.countDocuments({ category })
    );

    //did promise.all because for every category it awaits and also have to made the function async .
    const categoriesCount = await Promise.all(categoriesCountPromise);

    const categoryCount: Record<string, number>[] = [];

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
    const modifiedLatestTransaction =  latestTransaction.map((i)=>({
      _id:i._id,
      discount:i.discount,
      amount:i.total,
      quantity:i.orderItems.length,
      status:i.status
    }))
    stats = {
      changePercent,
      count,
      chart: {
        order: orderMonthCounts,
        revenue: orderMonthRevenue,
      },
      categoryCount,
      userRatio,
      latestTransaction : modifiedLatestTransaction
    };


    myCache.set("admin-stats",JSON.stringify(stats))

  }
  return res.status(200).json({
    success: true,
    stats,
  });
});

export const getPieCharts = TryCatch(async (req, res, next) => {});
export const getBarCharts = TryCatch(async (req, res, next) => {});
export const getLineCharts = TryCatch(async (req, res, next) => {});
