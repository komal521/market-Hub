const express = require("express");
const cors = require("cors");
const db = require("./db");
const path = require("path");
const multer = require("multer");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require ("./routes/categoryRoutes");
const brandRoutes = require("./routes/brandRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();
const PORT = process.env.ADMIN_PORT || 5001;
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/products", productRoutes);
app.use("/api/categories",categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/auth", authRoutes);
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../backend/uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const uploadProfile = multer({ storage: profileStorage });
app.get("/", (req, res) => {
  res.send("Admin Backend Running");});
app.get("/api/users", async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT
        id,
        full_name AS fullName,
        username,
        email,
        phone,
        gender,
        dob,
        department,
        role,
        status,
        address,
        profile_image AS profileImage
      FROM users
      ORDER BY id DESC`);
    res.json({
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error Loading Users",
    });
  }
});
app.get("/api/dashboard/cards", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT COUNT(*) AS totalUsers FROM users" );
    res.json({
      totalUsers: rows[0].totalUsers, });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Dashboard Error",
    });
  }
});
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(
      "DELETE FROM products WHERE id = ?",
      [id] );
    res.json({
      success: true,
      message: "Product deleted successfully",  }); } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
});
const ensureTablesExist = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        items TEXT,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) `);
    await db.query(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(255),
        message TEXT,
        status VARCHAR(50) DEFAULT 'Pending',
        priority VARCHAR(20) DEFAULT 'Medium',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
         await db.query(`
      CREATE TABLE IF NOT EXISTS shipping_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        tracking_number VARCHAR(100),
        carrier VARCHAR(100),
        shipping_status VARCHAR(50) DEFAULT 'Pending',
        estimated_delivery DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )  `);
  } catch (err) {
    console.error("Error ensuring tables exist:", err);
  }};
app.get("/api/activities", async (req, res) => {
  try {
    await ensureTablesExist();
    const [orders] = await db.query("SELECT id, customer_name, items, created_at FROM orders ORDER BY id DESC LIMIT 5");
    const [users] = await db.query("SELECT id, full_name, created_at FROM users ORDER BY id DESC LIMIT 5");
    const [enquiries] = await db.query("SELECT id, full_name, subject, created_at FROM enquiries ORDER BY id DESC LIMIT 5");
    const [categories] = await db.query("SELECT id, category_name, created_at FROM categories ORDER BY id DESC LIMIT 5");
    const activities = [];
    orders.forEach(o => {
      activities.push({
        name: o.customer_name,
        text: `placed a new order #${o.id} for ${o.items || "Products"}`,
        time: o.created_at,
        type: "order"
      });  });
    users.forEach(u => {
      activities.push({
        name: u.full_name,
        text: `registered as a new organization member`,
        time: u.created_at,
        type: "user"
      });  });
    enquiries.forEach(e => {
      activities.push({
        name: e.full_name,
        text: `submitted support ticket regarding: ${e.subject || "General Inquiry"}`,
        time: e.created_at,
        type: "support"
      });  });
    categories.forEach(c => {
      activities.push({
        name: "Admin",
        text: `created a new category: ${c.category_name}`,
        time: c.created_at,
        type: "category"
      });  });
    activities.sort((a, b) => new Date(b.time) - new Date(a.time));
    const getRelativeTime = (dateStr) => {
      const diffMs = new Date() - new Date(dateStr);
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      if (diffMins < 1) return "just now";
      if (diffMins < 60) return `${diffMins} mins ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      return `${diffDays} days ago`; };
    const formattedActivities = activities.slice(0, 5).map(act => ({
      name: act.name,
      text: act.text,
      time: getRelativeTime(act.time), }));
    res.json(formattedActivities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching activities" });
  }});
app.get("/api/orders", async (req, res) => {
  try {
    await ensureTablesExist();
    const [orders] = await db.query("SELECT * FROM orders ORDER BY id DESC");
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }});
app.post("/api/orders", async (req, res) => {
  try {
    await ensureTablesExist();
    const {
      customer_name,
      email,
      phone,
      address,
      items,
      total_amount,
      status,
    } = req.body;
    const [result] = await db.query(
      `
      INSERT INTO orders
      (
        customer_name,
        email,
        phone,
        address,
        items,
        total_amount,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        customer_name,
        email,
        phone || "",
        address || "",
        items || "Products",
        total_amount || 0,
        status || "Pending",
      ]
    );
    const trackingNumber = "TRK" + Date.now();
    await db.query(
      `
      INSERT INTO shipping_details
      (
        order_id,
        tracking_number,
        carrier,
        shipping_status
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        result.insertId,
        trackingNumber,
        "Standard Delivery",
        "Pending",
      ]
    );
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId: result.insertId,
      trackingNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to place order",
    });
  }
});
app.put("/api/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_name, email, phone, address, items, total_amount, status } = req.body;
    await db.query(
      "UPDATE orders SET customer_name = ?, email = ?, phone = ?, address = ?, items = ?, total_amount = ?, status = ? WHERE id = ?",
      [customer_name, email, phone, address, items, total_amount, status, id] );
    res.json({ success: true, message: "Order updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update order" });
  }});
app.delete("/api/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM orders WHERE id = ?", [id]);
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
});
app.get("/api/order/cards", async (req, res) => {
  try {
    await ensureTablesExist();
    const [results] = await db.query(`
      SELECT 
        COUNT(*) as totalOrders,
        SUM(CASE WHEN status = 'Pending' OR status IS NULL THEN 1 ELSE 0 END) as pendingOrders,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completedOrders,
        SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelledOrders
      FROM orders
    `);
    const data = results[0] || { totalOrders: 0, pendingOrders: 0, completedOrders: 0, cancelledOrders: 0 };
    res.json({
      totalOrders: data.totalOrders || 0,
      pendingOrders: data.pendingOrders || 0,
      completedOrders: data.completedOrders || 0,
      cancelledOrders: data.cancelledOrders || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Order cards fetch failed" });
  }
});
app.get("/api/support/tickets", async (req, res) => {
  try {
    await ensureTablesExist();
    const [results] = await db.query("SELECT * FROM enquiries ORDER BY id DESC LIMIT 10");
    const tickets = results.map(e => ({
      id: e.id,
      name: e.full_name || "Unknown",
      subject: e.subject || "General Inquiry",
      priority: e.priority || "Medium",
      status: e.status || "Pending",
      email: e.email,
      phone: e.phone,
      message: e.message,
      created_at: e.created_at
    }));
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch tickets" });
  }
});
app.get("/api/support/cards", async (req, res) => {
  try {
    await ensureTablesExist();
    const today = new Date().toISOString().slice(0, 10);
    const [results] = await db.query(`
      SELECT
        COUNT(*) as totalTickets,
        SUM(CASE WHEN status = 'Pending' OR status = 'Open' THEN 1 ELSE 0 END) as openTickets,
        SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as pendingIssues,
        SUM(CASE WHEN status = 'Resolved' AND DATE(created_at) = ? THEN 1 ELSE 0 END) as resolvedToday
      FROM enquiries
    `, [today]);
    const d = results[0] || { totalTickets: 0, openTickets: 0, pendingIssues: 0, resolvedToday: 0 };
    res.json({
      totalTickets: d.totalTickets || 0,
      openTickets: d.openTickets || 0,
      pendingIssues: d.pendingIssues || 0,
      resolvedToday: d.resolvedToday || 0,
      totalTicketsGrowth: "+5%",
      openTicketsGrowth: "+2%",
      pendingIssuesGrowth: "+0%",
      resolvedTodayGrowth: "+10%"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Support cards fetch failed" });
  }
});
app.put("/api/enquiries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, subject, message } = req.body;
    await db.query(
      "UPDATE enquiries SET status = ?, priority = ?, subject = ?, message = ? WHERE id = ?",
      [status, priority, subject, message, id]
    );
    res.json({ success: true, message: "Ticket updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update ticket" });
  }});

app.delete("/api/enquiries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM enquiries WHERE id = ?", [id]);
    res.json({ success: true, message: "Ticket deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete ticket" });
  }
});
app.post("/api/users/create-user", uploadProfile.single("profileImage"), async (req, res) => {
  try {
    const { fullName, username, email, phone, gender, dob, password, department, role, status, address } = req.body;
    const profileImage = req.file ? req.file.filename : null;
    const [result] = await db.query(
      "INSERT INTO users (full_name, username, email, phone, gender, dob, password, department, role, status, address, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [fullName, username || email, email, phone, gender || "Male", dob || "2000-01-01", password || "123456", department || "General", role || "User", status || "Active", address || "", profileImage]
    );
    res.status(201).json({ success: true, message: "User created successfully", userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create user" });
  }});
app.put("/api/users/:id", uploadProfile.single("profileImage"), async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, username, email, phone, gender, dob, department, role, status, address } = req.body;
    const profileImage = req.file ? req.file.filename : null;
    if (profileImage) {
      await db.query(
        "UPDATE users SET full_name = ?, username = ?, email = ?, phone = ?, gender = ?, dob = ?, department = ?, role = ?, status = ?, address = ?, profile_image = ? WHERE id = ?",
        [fullName, username || '', email, phone, gender, dob, department, role, status, address, profileImage, id]);
    } else {
      await db.query(
        "UPDATE users SET full_name = ?, username = ?, email = ?, phone = ?, gender = ?, dob = ?, department = ?, role = ?, status = ?, address = ? WHERE id = ?",
        [fullName, username || '', email, phone, gender, dob, department, role, status, address, id]);
    }
    res.json({ success: true, message: "User updated successfully", profileImage }); } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update user" });
  }});
app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }});
app.put("/api/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, slug, parent_category, description, seo_title, seo_description, status, breadcrumb } = req.body;
    await db.query(
      "UPDATE categories SET category_name = ?, slug = ?, parent_category = ?, description = ?, seo_title = ?, seo_description = ?, status = ?, breadcrumb = ? WHERE id = ?",
      [category_name, slug, parent_category, description, seo_title, seo_description, status, breadcrumb, id]
    );
    res.json({ success: true, message: "Category updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update category" });
  }
});
app.get("/api/report/cards", async (req, res) => {
  try {
    const [revResult] = await db.query("SELECT SUM(total_amount) as sum FROM orders");
    const [ordersResult] = await db.query("SELECT COUNT(*) as count FROM orders");
    const [usersResult] = await db.query("SELECT COUNT(*) as count FROM users WHERE status = 'Active' OR status IS NULL");
    const totalRevenueVal = revResult[0].sum || 0;
    const totalRevenueStr = `₹${Number(totalRevenueVal).toLocaleString("en-IN")}`;
    res.json({
      totalRevenue: totalRevenueStr,
      totalOrders: ordersResult[0].count || 0,
      activeUsers: usersResult[0].count || 0,
      monthlyGrowth: "+4.1%",
    });
  } catch (error) {
    console.error("Report cards fetch error:", error);
    res.status(500).json({ message: "Error fetching report cards" });
  }
});
app.get("/api/report/recent", async (req, res) => {
  try {
    const [results] = await db.query(`
      (SELECT id, product_name AS name, base_price AS revenue, status, created_at AS date, 'Product' AS type
       FROM products)
      UNION ALL
      (SELECT id, category_name AS name, 0 AS revenue, status, created_at AS date, 'Category' AS type
       FROM categories)
      ORDER BY date DESC
      LIMIT 10
    `);
    const formatted = results.map(o => ({
      id: `#${o.type === 'Product' ? 'PRD' : 'CAT'}-${o.id}`,
      client: o.name,
      revenue: o.type === 'Product' ? `₹${Number(o.revenue || 0).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}` : '-',
      status: o.status || "Active",
      color: o.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800",
      date: o.date ? new Date(o.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" }) : "",
    }));
    res.json({ success: true, recentReports: formatted });
  } catch (error) {
    console.error("Recent report fetch error:", error);
    res.status(500).json({ success: false, message: "Error fetching recent reports" });
  }
});
app.get("/api/revenue-graph", async (req, res) => {
  try {
    const [results] = await db.query(`
      SELECT MONTH(created_at) as month, SUM(total_amount) as revenue 
      FROM orders 
      WHERE YEAR(created_at) = YEAR(CURDATE()) 
      GROUP BY MONTH(created_at) 
      ORDER BY month `);
    const months = Array(12).fill(0);
    results.forEach(r => {
      months[r.month - 1] = Number(r.revenue) || 0; });
    res.json({ success: true, data: months });
  } catch (error) {
    console.error("Revenue graph failed:", error);
    res.status(500).json({ success: false, message: "Revenue graph failed" });
  }});

app.get("/api/report/mix", async (req, res) => {
  try {
    res.json({
      products: 55,
      services: 30,
      other: 15
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch mix" });
  }
});

app.get("/api/report/engagement", async (req, res) => {
  try {
    res.json([
      { week: "Week 1", height: 110 },
      { week: "Week 2", height: 155 },
      { week: "Week 3", height: 130 },
      { week: "Week 4", height: 180 },
    ]);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch engagement" });
  }
});

app.get("/api/shipping/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const [results] = await db.query(
      `SELECT s.*, o.customer_name, o.email, o.phone, o.address, o.items, o.total_amount, o.created_at AS order_date
       FROM shipping_details s
       JOIN orders o ON s.order_id = o.id
       WHERE s.order_id = ?`,
      [orderId]
    );
    if (results && results.length > 0) {
      res.json({ success: true, shipping: results[0] });
    } else {
      res.json({ success: true, shipping: null });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch shipping details" });
  }});
app.put("/api/shipping/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { tracking_number, carrier, shipping_status, estimated_delivery } = req.body;
    const [existing] = await db.query("SELECT * FROM shipping_details WHERE order_id = ?", [orderId]);
    if (existing && existing.length > 0) {
      await db.query(
        "UPDATE shipping_details SET tracking_number = ?, carrier = ?, shipping_status = ?, estimated_delivery = ? WHERE order_id = ?",
        [tracking_number, carrier, shipping_status, estimated_delivery || null, orderId]
      ); } else {
      await db.query(
        "INSERT INTO shipping_details (order_id, tracking_number, carrier, shipping_status, estimated_delivery) VALUES (?, ?, ?, ?, ?)",
        [orderId, tracking_number, carrier, shipping_status, estimated_delivery || null]
      );
    } 
    if (shipping_status === 'Delivered') {
        await db.query("UPDATE orders SET status = 'Completed' WHERE id = ?", [orderId]);
    } 
    res.json({ success: true, message: "Shipping details updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update shipping details" });
  }
});
const ensureSettingsTables = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS admin_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(100) NOT NULL UNIQUE,
      setting_value TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      device_info VARCHAR(255),
      browser VARCHAR(100),
      ip_address VARCHAR(50),
      is_current TINYINT(1) DEFAULT 0,
      logged_in_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);};
app.get("/api/settings", async (req, res) => {
  try {
    await ensureSettingsTables();
    const [rows] = await db.query("SELECT setting_key, setting_value FROM admin_settings");
    const settings = {};
    rows.forEach(r => { settings[r.setting_key] = r.setting_value; });
    res.json({ success: true, settings }); } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to load settings" }); }});
app.post("/api/settings", async (req, res) => {
  try {
    await ensureSettingsTables();
    const { settings } = req.body;
    for (const [key, value] of Object.entries(settings || {})) {
      await db.query(
        `INSERT INTO admin_settings (setting_key, setting_value) VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, value]  ); }
    res.json({ success: true, message: "Settings saved" });  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to save settings" });
  }});
app.put("/api/settings/password", async (req, res) => {
  try {
    await ensureSettingsTables();
    const { currentPassword, newPassword } = req.body;
    const [rows] = await db.query(
      "SELECT setting_value FROM admin_settings WHERE setting_key = 'password'" );
    const stored = rows.length > 0 ? rows[0].setting_value : "admin123";
    if (stored !== currentPassword) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" }); }
    await db.query(
      `INSERT INTO admin_settings (setting_key, setting_value) VALUES ('password', ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [newPassword] );
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update password" });
  }});
app.get("/api/settings/devices", async (req, res) => {
  try {
    await ensureSettingsTables();
    const [rows] = await db.query(
      "SELECT * FROM admin_sessions ORDER BY is_current DESC, logged_in_at DESC");
    res.json({ success: true, devices: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to load devices" });
  }
});
app.post("/api/settings/devices", async (req, res) => {
  try {
    await ensureSettingsTables();
    const { device_info, browser, ip_address } = req.body;
    await db.query("UPDATE admin_sessions SET is_current = 0");
    const [existing] = await db.query(
      "SELECT id FROM admin_sessions WHERE device_info = ? AND browser = ?",
      [device_info, browser]
    );
    if (existing.length > 0) {
      await db.query(
        "UPDATE admin_sessions SET is_current = 1, logged_in_at = NOW(), ip_address = ? WHERE id = ?",
        [ip_address, existing[0].id] ); } else {
      await db.query(
        "INSERT INTO admin_sessions (device_info, browser, ip_address, is_current) VALUES (?, ?, ?, 1)",
        [device_info, browser, ip_address]
      ); }
    res.json({ success: true, message: "Device registered" });} catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to register device" });
  }});
app.delete("/api/settings/devices/others", async (req, res) => {
  try {
    await ensureSettingsTables();
    await db.query("DELETE FROM admin_sessions WHERE is_current = 0");
    res.json({ success: true, message: "Signed out all other devices" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to sign out devices" });
  }});
app.get("/api/performance", async (req, res) => {
  try {
    const [completedRes] = await db.query(
      "SELECT COUNT(*) as completed FROM orders WHERE status = 'Completed'"
    );
    const [totalRes] = await db.query("SELECT COUNT(*) as total FROM orders");
    const [revenueRes] = await db.query(
      "SELECT SUM(total_amount) as revenue FROM orders WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())"
    );
    const [monthlyOrdersRes] = await db.query(
      "SELECT COUNT(*) as count FROM orders WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())"
    );
    const total = totalRes[0].total || 1;
    const completed = completedRes[0].completed || 0;
    const completedPercentage = Math.round((completed / total) * 100);
    res.json({
      completedPercentage,
      totalRevenue: revenueRes[0].revenue || 0,
      monthlyOrders: monthlyOrdersRes[0].count || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Performance fetch failed" });
  }
});
const ensureColorsTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS colors (
      id INT AUTO_INCREMENT PRIMARY KEY,
      color_name VARCHAR(255) NOT NULL,
      hex_code VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

app.get("/api/colors", async (req, res) => {
  try {
    await ensureColorsTable();
    const [colors] = await db.query("SELECT * FROM colors ORDER BY created_at DESC");
    res.json({ success: true, colors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching colors" });
  }
});

app.post("/api/colors", async (req, res) => {
  try {
    await ensureColorsTable();
    const { colorName, hexCode } = req.body;
    if (!colorName) return res.status(400).json({ success: false, message: "Color name required" });
    await db.query("INSERT INTO colors (color_name, hex_code) VALUES (?, ?)", [colorName, hexCode || ""]);
    res.json({ success: true, message: "Color added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error adding color" });
  }
});

app.delete("/api/colors/:id", async (req, res) => {
  try {
    await ensureColorsTable();
    const { id } = req.params;
    await db.query("DELETE FROM colors WHERE id = ?", [id]);
    res.json({ success: true, message: "Color deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting color" });
  }
});

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});