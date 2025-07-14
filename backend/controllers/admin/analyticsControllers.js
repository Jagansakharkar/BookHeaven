const Order = require('../../models/order');
const User = require('../../models/user');
const Book = require('../../models/books');

const Category = require('../../models/Category');

exports.getOverview = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments();
    const blockedCustomers = await User.countDocuments({ isBlocked: true });

    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const pendingOrders = await Order.countDocuments({ status: 'Placed' });

    const totalRevenueAgg = await Order.aggregate([
      { $match: { status: 'Delivered' } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const lowStock = await Book.countDocuments({ stock: { $lt: 10, $gt: 0 } });
    const outOfStock = await Book.countDocuments({ stock: 0 });

    res.status(200).json({
      success: true,
      data: {
        customers: { total: totalCustomers, blocked: blockedCustomers },
        orders: { total: totalOrders, delivered: deliveredOrders, pending: pendingOrders },
        revenue: totalRevenueAgg[0]?.total || 0,
        inventory: { lowStock, outOfStock }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching overview' });
  }
};

exports.getOrdersPerDay = async (req, res) => {
  try {
    const recentOrders = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // last 7 days
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data: recentOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders per day" });
  }
};

exports.getRevenuePerDay = async (req, res) => {
  try {
    const revenueData = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
          createdAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data: revenueData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching revenue data" });
  }
};

exports.getTopBooks = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $unwind: "$books" },
      {
        $group: {
          _id: "$books.bookid",
          totalSold: { $sum: "$books.quantity" }
        }
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book"
        }
      },
      { $unwind: "$book" },
      {
        $project: {
          title: "$book.title",
          totalSold: 1
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching top books" });
  }
};



exports.getBooksByCategory = async (req, res) => {
  try {
    const books = await Book.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "categories", // your collection name in MongoDB
          localField: "_id",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 0,
          category: "$category.name",
          count: 1
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({ success: true, data: books });
  } catch (error) {
    console.error("Error in getBooksByCategory:", error);
    res.status(500).json({ success: false, message: "Error fetching books by category" });
  }
};
