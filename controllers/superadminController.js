import Order from "../models/Order.js";
import Student from "../models/Student.js";
import Food from "../models/Food.js";

export const getDashboardStats = async (req, res) => {
  try {
    
    const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const todayRevenue = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfDay, $lte: endOfDay }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" }
          }
        }
      ]);

      const revenue = todayRevenue[0]?.total || 0;
    
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
    const todayStudents = await Order.distinct("studentId", {
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
    const todayStudentCount = todayStudents.length;
    const totalStudents = await Student.countDocuments();

    const todayFoods = await Food.countDocuments({
      isAvailable: true
    });
    
    const latestTransactions = await Order
    .find()
    .populate("studentId", "name regNo")
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      todayRevenue: revenue,
      todayOrders,
      todayFoods,
      todayStudentCount,
      totalStudents,
      latestTransactions
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllStudents = async (req, res) => {
  try {

    const {
      search,
      department,
      shift,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      order = "desc"
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { regNo: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    if (department) {
      query.department = department;
    }

    if (shift) {
      query.shift = shift;
    }

    // Sorting
    const sort = {};
    sort[sortBy] = order === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const students = await Student
      .find(query)
      .select("-password")
      .sort(sort)
      .limit(Number(limit))
      .skip(skip);

    const totalStudents = await Student.countDocuments(query);

    res.json({
      data: students,
      pagination: {
        total: totalStudents,
        page: Number(page),
        pages: Math.ceil(totalStudents / limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

export const superAdminTransactions = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1;
    const limit = 20;

    const orders = await Order.find()
      .populate("studentId","-password")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const filterTransactions = async (req, res) => {
  try {

    const {
      shift,
      department,
      startDate,
      endDate,
      search,
      page = 1
    } = req.query;

    const limit = 20;

    let orderFilter = {};
    let studentFilter = {};

    // Date filter
    if (startDate && endDate) {
      orderFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Department filter
    if (department) {
      studentFilter.department = department;
    }

    // Shift filter
    if (shift) {
      studentFilter.shift = shift;
    }

    // Search filter (name / regNo)
    if (search) {
      studentFilter.$or = [
        { name: { $regex: search, $options: "i" } },
        { regNo: { $regex: search, $options: "i" } }
      ];
    }

    const orders = await Order.find(orderFilter)
      .populate({
        path: "studentId",
        select: "name regNo department shift",
        match: studentFilter
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    // Remove orders where student not matched
    const filteredOrders = orders.filter(order => order.studentId);

    res.json(filteredOrders);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const totalTransaction = async (req, res) => {
  try {

    const result = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    res.json(result[0] || { totalAmount: 0, totalOrders: 0 });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};