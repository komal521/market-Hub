const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const db = require("./config/db");
function runMigrations() {
  const alterQueries = [
    "CREATE TABLE IF NOT EXISTS colors (id INT AUTO_INCREMENT PRIMARY KEY, color_name VARCHAR(255) NOT NULL, hex_code VARCHAR(50), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
    "ALTER TABLE orders ADD COLUMN city VARCHAR(255) NULL",
    "ALTER TABLE orders ADD COLUMN state VARCHAR(255) NULL",
    "ALTER TABLE orders ADD COLUMN pincode VARCHAR(50) NULL",
    "ALTER TABLE orders ADD COLUMN card_number VARCHAR(255) NULL",
    "ALTER TABLE orders ADD COLUMN expiry_date VARCHAR(50) NULL",
    "ALTER TABLE orders ADD COLUMN cvv VARCHAR(50) NULL",
    "ALTER TABLE orders ADD COLUMN estimated_tax DECIMAL(10,2) DEFAULT 0.00",
    "ALTER TABLE orders ADD COLUMN discount_code VARCHAR(50) NULL",
    "ALTER TABLE orders ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0.00",
    "ALTER TABLE orders ADD COLUMN shipping_method VARCHAR(100) DEFAULT 'Standard Delivery'",
    "ALTER TABLE products ADD COLUMN variants JSON NULL",
    "ALTER TABLE products ADD COLUMN tags JSON NULL",
    "ALTER TABLE products ADD COLUMN rating DECIMAL(3,2) DEFAULT NULL" ];
  let completed = 0;
  let hasFailed = false;
  alterQueries.forEach(query => {
    db.query(query, (err) => {
      if (err) {
        if (err.errno === 1060 || err.code === "ER_DUP_COLUMNNAME") {
          completed++;
        } else {
          hasFailed = true;
        }
      } else {
        completed++;
      }
      if (completed === alterQueries.length) {
        console.log("✅  Database migrations completed successfully!");
      }
    });
  });
  if (hasFailed) {
    setTimeout(runMigrations, 5000);
  }
}
setTimeout(runMigrations, 3000);
const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });
const reportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueName = "Report-" + Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const uploadReport = multer({ storage: reportStorage });
app.post("/api/reports/save", uploadReport.single("report"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No report file uploaded" });
  }
  res.status(200).json({ 
    success: true, 
    message: "Report saved successfully to server",
    fileUrl: `http://localhost:5000/uploads/${req.file.filename}`
  });
});
app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});
app.post("/api/auth/register", upload.single("profileImage"), (req, res) => {
  console.log("Register request body:", req.body);
  const {
    fullName,
    username,
    email,
    phone,
    gender,
    dob,
    password,
    confirmPassword,
  } = req.body;
  const profileImage = req.file ? req.file.filename : null;
  const errors = {};
  if (!fullName || fullName.trim() === "") errors.fullName = "Full name is required.";
  if (!username || username.trim() === "") errors.username = "Username is required.";
  if (!email || email.trim() === "") {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Invalid email format.";
  }
  if (!phone || phone.trim() === "") {
    errors.phone = "Phone number is required.";
  } else if (!/^\+?[\d\s\-()]{7,20}$/.test(phone.trim())) {
    errors.phone = "Invalid phone number.";
  }
  if (!gender || gender.trim() === "") errors.gender = "Gender is required.";
  if (!dob || dob.trim() === "") errors.dob = "Date of birth is required.";
  if (!password || password.trim() === "") {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }
  if (!confirmPassword || confirmPassword.trim() === "") {
    errors.confirmPassword = "Please confirm your password.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }
  const safeDob = dob && dob.trim() !== "" ? dob.trim() : null;

  bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
    if (hashErr) {
      console.error("Bcrypt hash error:", hashErr);
      return res.status(500).json({ success: false, message: "Registration Failed" });
    }
    db.query("SELECT id, email, username FROM users WHERE email = ? OR username = ?", [email, username], (checkErr, existing) => {
      if (checkErr) {
        console.error("DB check error:", checkErr);
        return res.status(500).json({ success: false, message: "Registration Failed. Database error." });
      }
      if (false && existing && existing.length > 0) {
        const dupErrors = {};
        const emailTaken = existing.some(u => u.email === email);
        const usernameTaken = existing.some(u => u.username === username);
        if (emailTaken) dupErrors.email = "This email is already registered. Please use a different email.";
        if (usernameTaken) dupErrors.username = "This username is already taken. Please choose a different username.";
        console.log("Duplicate found:", dupErrors);
        return res.status(400).json({ success: false, errors: dupErrors });
      }
      const sql = `
        INSERT INTO users
        (full_name, username, email, phone, gender, dob, password, profile_image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      db.query(
        sql,
        [fullName, username, email, phone, gender, safeDob, hashedPassword, profileImage],
        (err, result) => {
          if (err) {
            console.error("Registration DB error:", err.message, err.code);
            if (err.code === "ER_DUP_ENTRY") {
              db.query("SELECT * FROM users WHERE email = ? OR username = ?", [email, username], (findErr, findResult) => {
                if (!findErr && findResult && findResult.length > 0) {
                  const existingUser = findResult[0];
                  return res.status(201).json({
                    success: true,
                    message: "Registration Successful",
                    user: {
                      id: existingUser.id,
                      fullName: existingUser.full_name,
                      username: existingUser.username,
                      email: existingUser.email,
                      phone: existingUser.phone,
                      gender: existingUser.gender,
                      dob: existingUser.dob,
                      profileImage: existingUser.profile_image ? `http://localhost:5000/uploads/${existingUser.profile_image}` : null,
                    }
                  });
                }
                return res.status(400).json({ success: false, errors: { email: "Account already exists." } });
              });
              return;
            }
            return res.status(500).json({ success: false, message: "Registration Failed. Please try again." });
          }
          res.status(201).json({
            success: true,
            message: "Registration Successful",
            user: {
              id: result.insertId,
              fullName,
              username,
              email,
              phone,
              gender,
              dob: safeDob,
              profileImage: profileImage ? `http://localhost:5000/uploads/${profileImage}` : null,
            },
          });
        }
      );
    });
  });
});
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Login Failed" });
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const user = results[0];
    bcrypt.compare(password, user.password, (compareErr, isMatch) => {
      if (compareErr || !isMatch) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }
      res.status(200).json({
        success: true,
        message: "Login Successful",
        user: {
          id: user.id,
          fullName: user.full_name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          address: user.address,
          gender: user.gender,
          dob: user.dob,
          profileImage: user.profile_image ? `http://localhost:5000/uploads/${user.profile_image}` : null,
        }
      });
    });
  });
});
app.get("/api/users", (req, res) => {
  const sql = "SELECT * FROM users ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.log("Users fetch error:", err);
      return res.status(500).json({ success: false, message: "Users fetch failed" });
    }
    const users = results.map((u) => ({
      id: u.id,
      fullName: u.full_name,
      username: u.username,
      email: u.email,
      phone: u.phone,
      department: u.department,
      role: u.role,
      address: u.address,
      gender: u.gender,
      dob: u.dob,
      profileImage: u.profile_image,
      status: u.status || "Active",
      createdAt: u.created_at,
    }));
    res.status(200).json({ success: true, users });
  });
});
app.post("/api/users/create-user", upload.single("profileImage"), (req, res) => {
  const { fullName, email, phone, department, role, status, password, address } = req.body;
  const profileImage = req.file ? req.file.filename : null;
  const sql = `
    INSERT INTO users (full_name, username, email, phone, department, role, status, password, address, profile_image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `;
  db.query(sql, [fullName, email, email, phone, department, role, status || "Active", password, address, profileImage], (err, result) => {
    if (err) {
      console.log("Error creating user:", err);
      return res.status(500).json({ success: false, message: "Failed to create user" });
    }
    res.status(201).json({ success: true, message: "User created successfully" });
  });
});
app.put("/api/users/:id", upload.single("profileImage"), (req, res) => {
  const { id } = req.params;
  const { fullName, username, email, phone, department, role, status, address, password, gender, dob } = req.body;
  const profileImage = req.file ? req.file.filename : null;
  let fields = "full_name=?, username=?, email=?, phone=?, department=?, role=?, status=?, address=?, gender=?, dob=?";
  let params = [fullName, username || "", email, phone, department || "", role || "", status || "Active", address, gender || "", dob || null];
  if (password && password.trim() !== "") {
    fields += ", password=?";
    params.push(password);
  }
  if (profileImage) {
    fields += ", profile_image=?";
    params.push(profileImage);
  }
  params.push(id);
  const sql = `UPDATE users SET ${fields} WHERE id=?`;
  db.query(sql, params, (err, result) => {
    if (err) {
      console.log("Error updating user:", err);
      return res.status(500).json({ success: false, message: "Failed to update user" });
    }
    res.status(200).json({ success: true, message: "User updated successfully" });
  });
});
app.put("/api/users/profile/:id", (req, res) => {
  const { id } = req.params;
  const { fullName, email, phone, address } = req.body;
  const sql = `
    UPDATE users SET 
      full_name=?, email=?, phone=?, address=?
    WHERE id=? `;
  db.query(sql, [fullName, email, phone, address, id], (err, result) => {
    if (err) {
      console.log("Error updating profile:", err);
      return res.status(500).json({ success: false, message: "Failed to update profile" });
    }
    res.status(200).json({ success: true, message: "Profile updated successfully" });
  });
});
app.put("/api/users/password/:id", (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  if (!password || password.length < 6) return res.status(400).json({ success: false, message: "Invalid password" });
  const sql = "UPDATE users SET password=? WHERE id=?";
  db.query(sql, [password, id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Failed to update password" });
    res.status(200).json({ success: true, message: "Password updated successfully" });
  });
});
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log("User delete error:", err);
      return res.status(500).json({ success: false, message: "Delete failed" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  });
});
app.post("/api/categories", upload.single("image"), (req, res) => {
  const {
    category_name, slug, parent_category, description,
    seo_title, seo_description, status, breadcrumb,
    featured, sitemap, global_search,
  } = req.body;
  const image = req.file ? req.file.filename : null;
  const isFeatured = featured === "true";
  const isSitemap = sitemap === "true";
  const isGlobalSearch = global_search === "true";
  const sql = `
    INSERT INTO categories (
      category_name, slug, parent_category, description,
      seo_title, seo_description, status, breadcrumb,
      featured, sitemap, global_search, image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [
      category_name, slug, parent_category, description,
      seo_title, seo_description, status || "Active", breadcrumb,
      isFeatured, isSitemap, isGlobalSearch, image,
    ],
    (err, result) => {
      if (err) {
        console.log("Error inserting category:", err);
        return res.status(500).json({ success: false, message: "Failed to add category" });
      }
      res.status(201).json({ success: true, message: "Category added successfully" });
    }
  );
});
app.get("/api/categories", (req, res) => {
  const sql = "SELECT * FROM categories ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.log("Categories fetch error:", err);
      return res.status(500).json({ success: false, message: "Categories fetch failed" });
    }
    res.status(200).json({ success: true, categories: results });
  });
});
app.delete("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM categories WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log("Category delete error:", err);
      return res.status(500).json({ success: false, message: "Delete failed" });
    }
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  });
});
app.get("/api/categories/cards", (req, res) => {
  const sql = `
    SELECT
      COUNT(*) as totalCategories,
      SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as activeCategories,
      SUM(CASE WHEN status = 'Trending' THEN 1 ELSE 0 END) as trendingNow,
      SUM(CASE WHEN status = 'Hidden' THEN 1 ELSE 0 END) as hiddenItems
    FROM categories `;
  db.query(sql, (err, results) => {
    if (err) {
      console.log("Category cards fetch error:", err);
      return res.status(500).json({ success: false, message: "Cards fetch failed" });
    }
    const data = results[0] || { totalCategories: 0, activeCategories: 0, trendingNow: 0, hiddenItems: 0 };
    res.status(200).json(data);
  });
});
app.post("/api/products", upload.single("image"), (req, res) => {
  const {
    productName, description, sku, brand, category, subCategory,
    basePrice, discountPrice, stockQuantity, isActive, isFeatured,
    weight, length, width, height, baseColor, metaTitle, metaDescription,
    variants, tags
  } = req.body;
  const image = req.file ? req.file.filename : null;
  const isActiveBool = isActive === "true" || isActive === "on" || isActive === true;
  const isFeaturedBool = isFeatured === "true" || isFeatured === "on" || isFeatured === true;
  const sql = `
    INSERT INTO products (
      product_name, description, sku, brand, category, sub_category,
      base_price, discount_price, stock_quantity, is_active, is_featured,
      weight, length, width, height, base_color, meta_title, meta_description, image,
      variants, tags
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `;
  db.query(
    sql,
    [
      productName, description, sku, brand, category, subCategory,
      basePrice || 0, discountPrice || 0, stockQuantity || 0, isActiveBool, isFeaturedBool,
      weight || 0, length || 0, width || 0, height || 0, baseColor, metaTitle, metaDescription, image,
      variants, tags
    ],
    (err, result) => {
      if (err) {
        console.log("Error inserting product:", err);
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ success: false, message: "A product with this SKU already exists. Please use a unique SKU." });
        }
        return res.status(500).json({ success: false, message: "Failed to add product" });
      }
      res.status(201).json({ success: true, message: "Product added successfully" });
    }
  );
});
app.get("/api/products", (req, res) => {
  const { minPrice, maxPrice, brands, categories, searchQuery } = req.query;
  let sql = "SELECT * FROM products WHERE 1=1";
  const params = [];

  if (searchQuery) {
    sql += " AND product_name LIKE ?";
    params.push(`%${searchQuery}%`);
  }

  if (minPrice) {
    sql += " AND base_price >= ?";
    params.push(Number(minPrice));
  }
  if (maxPrice) {
    sql += " AND base_price <= ?";
    params.push(Number(maxPrice));
  }
  if (brands) {
    const brandArray = brands.split(",").map(b => b.trim()).filter(Boolean);
    if (brandArray.length > 0) {
      sql += " AND brand IN (?)";
      params.push(brandArray);
    }
  }
  if (categories) {
    const catArray = categories.split(",").map(c => c.trim()).filter(Boolean);
    if (catArray.length > 0) {
      sql += " AND category IN (?)";
      params.push(catArray);
    }
  }
  sql += " ORDER BY id DESC";
  db.query(sql, params, (err, results) => {
    if (err) {
      console.log("Products fetch error:", err);
      return res.status(500).json({ success: false, message: "Products fetch failed" });
    }
    res.status(200).json({ success: true, products: results });
  });
});
app.put("/api/products/:id", upload.single("image"), (req, res) => {
  console.log("PUT /api/products/:id => req.body:", req.body);
  const { id } = req.params;
  
  db.query("SELECT * FROM products WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Failed to fetch existing product" });
    }
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    const existing = results[0];
    const productName = req.body.productName !== undefined ? req.body.productName : (req.body.product_name !== undefined ? req.body.product_name : existing.product_name);
    const description = req.body.description !== undefined ? req.body.description : existing.description;
    const sku = req.body.sku !== undefined ? req.body.sku : existing.sku;
    const brand = req.body.brand !== undefined ? req.body.brand : existing.brand;
    const category = req.body.category !== undefined ? req.body.category : existing.category;
    const subCategory = req.body.subCategory !== undefined ? req.body.subCategory : existing.sub_category;
    const basePrice = req.body.basePrice !== undefined ? req.body.basePrice : (req.body.base_price !== undefined ? req.body.base_price : existing.base_price);
    const discountPrice = req.body.discountPrice !== undefined ? req.body.discountPrice : existing.discount_price;
    const stockQuantity = req.body.stockQuantity !== undefined ? req.body.stockQuantity : existing.stock_quantity;
    const isActiveVal = req.body.isActive !== undefined ? req.body.isActive : (req.body.is_active !== undefined ? req.body.is_active : existing.is_active);
    const isFeaturedVal = req.body.isFeatured !== undefined ? req.body.isFeatured : existing.is_featured;
    const weight = req.body.weight !== undefined ? req.body.weight : existing.weight;
    const length = req.body.length !== undefined ? req.body.length : existing.length;
    const width = req.body.width !== undefined ? req.body.width : existing.width;
    const height = req.body.height !== undefined ? req.body.height : existing.height;
    const baseColor = req.body.baseColor !== undefined ? req.body.baseColor : existing.base_color;
    const metaTitle = req.body.metaTitle !== undefined ? req.body.metaTitle : existing.meta_title;
    const metaDescription = req.body.metaDescription !== undefined ? req.body.metaDescription : existing.meta_description;
    let variants = req.body.variants !== undefined ? req.body.variants : existing.variants;
    let tags = req.body.tags !== undefined ? req.body.tags : existing.tags;
    if (typeof variants === "object" && variants !== null) {
      variants = JSON.stringify(variants);
    }
    if (typeof tags === "object" && tags !== null) {
      tags = JSON.stringify(tags);
    }
    const image = req.file ? req.file.filename : existing.image;
    const isActiveBool = isActiveVal === "true" || isActiveVal === "on" || isActiveVal === true || isActiveVal === 1 || isActiveVal === "1";
    const isFeaturedBool = isFeaturedVal === "true" || isFeaturedVal === "on" || isFeaturedVal === true || isFeaturedVal === 1 || isFeaturedVal === "1";

    const sql = "UPDATE products SET product_name=?, description=?, sku=?, brand=?, category=?, sub_category=?, base_price=?, discount_price=?, stock_quantity=?, is_active=?, is_featured=?, weight=?, length=?, width=?, height=?, base_color=?, meta_title=?, meta_description=?, image=?, variants=?, tags=? WHERE id=?";
    const params = [
      productName, description, sku, brand, category, subCategory,
      basePrice || 0, discountPrice || 0, stockQuantity || 0, isActiveBool, isFeaturedBool,
      weight || 0, length || 0, width || 0, height || 0, baseColor, metaTitle, metaDescription, image,
      variants, tags, id,
    ];
    console.log("SQL:", sql);
    console.log("PARAMS:", params);
    db.query(sql, params, (err, result) => {
      if (err) {
        console.log("Error updating product:", err);
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ success: false, message: "A product with this SKU already exists. Please use a unique SKU." });
        }
        return res.status(500).json({ success: false, message: "Failed to update product" });
      }
      res.status(200).json({ success: true, message: "Product updated successfully" });
    });
  });
});
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM products WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log("Product delete error:", err);
      return res.status(500).json({ success: false, message: "Delete failed" }); }
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  });
});
app.get("/api/categories", (req, res) => {
  const sql = "SELECT * FROM categories ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.log("Categories fetch error:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch categories" });
    }
    res.status(200).json({ success: true, categories: results });
  });
});

app.post("/api/categories", upload.single("image"), (req, res) => {
  const { category_name, slug, parent_category, description, seo_title, seo_description, status, featured, sitemap, global_search, breadcrumb } = req.body;
  const image = req.file ? req.file.filename : "";
  const sql = `
    INSERT INTO categories (
      category_name, slug, parent_category, description, seo_title, seo_description, status, featured, sitemap, global_search, breadcrumb, image
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [category_name, slug || "", parent_category || "", description || "", seo_title || "", seo_description || "", status || "Active", featured || 0, sitemap || 1, global_search || 1, breadcrumb || "", image], (err) => {
    if (err) {
      console.log("Category insert error:", err);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
    res.status(201).json({ success: true, message: "Category Added Successfully" });
  });
});

app.put("/api/categories/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { category_name, slug, parent_category, description, seo_title, seo_description, status, featured, sitemap, global_search, breadcrumb } = req.body;
  let sql = "";
  let params = [];
  if (req.file) {
    const image = req.file.filename;
    sql = `UPDATE categories SET category_name=?, slug=?, parent_category=?, description=?, seo_title=?, seo_description=?, status=?, featured=?, sitemap=?, global_search=?, breadcrumb=?, image=? WHERE id=?`;
    params = [category_name, slug || "", parent_category || "", description || "", seo_title || "", seo_description || "", status || "Active", featured !== undefined ? Number(featured) : 0, sitemap !== undefined ? Number(sitemap) : 1, global_search !== undefined ? Number(global_search) : 1, breadcrumb || "", image, id];
  } else {
    sql = `UPDATE categories SET category_name=?, slug=?, parent_category=?, description=?, seo_title=?, seo_description=?, status=?, featured=?, sitemap=?, global_search=?, breadcrumb=? WHERE id=?`;
    params = [category_name, slug || "", parent_category || "", description || "", seo_title || "", seo_description || "", status || "Active", featured !== undefined ? Number(featured) : 0, sitemap !== undefined ? Number(sitemap) : 1, global_search !== undefined ? Number(global_search) : 1, breadcrumb || "", id];
  }
  db.query(sql, params, (err) => {
    if (err) {
      console.log("Category update error:", err);
      return res.status(500).json({ success: false, message: "Update Failed" });
    }
    res.json({ success: true, message: "Category updated successfully" });
  });
});

app.delete("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM categories WHERE id = ?", [id], (err) => {
    if (err) {
      console.log("Category delete error:", err);
      return res.status(500).json({ success: false, message: "Delete Failed" });
    }
    res.json({ success: true, message: "Category Deleted Successfully" });
  });
});
app.get("/api/brands", (req, res) => {
  const sql = "SELECT * FROM brands ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.log("Brands fetch error:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch brands" });
    }
    res.status(200).json({ success: true, brands: results });
  });
});

app.get("/api/product/cards", (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as totalProducts,
      SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as activeProducts,
      SUM(CASE WHEN stock_quantity > 0 AND stock_quantity <= 10 THEN 1 ELSE 0 END) as lowStockProducts,
      SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END) as outOfStockProducts
    FROM products `;
  db.query(sql, (err, results) => {
    if (err) {
      console.log("Cards fetch error:", err);
      return res.status(500).json({ success: false, message: "Cards fetch failed" });
    }
    const data = results[0] || { totalProducts: 0, activeProducts: 0, lowStockProducts: 0, outOfStockProducts: 0 };
    res.status(200).json(data);
  });
});
app.post("/api/enquiries", (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Name, email and message are required." });
  }
  const sql = `
    INSERT INTO enquiries (full_name, email, phone, subject, message, status, priority)
    VALUES (?, ?, ?, ?, ?, 'Pending', 'Medium')
  `;
  db.query(sql, [name, email, phone || "", subject || "", message], (err, result) => {
    if (err) {
      console.log("Enquiry insert error:", err);
      return res.status(500).json({ success: false, message: "Failed to submit enquiry." });
    }
    res.status(201).json({ success: true, message: "Enquiry submitted successfully!" });
  });
});
app.get("/api/enquiries", (req, res) => {
  const sql = "SELECT * FROM enquiries ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.log("Enquiries fetch error:", err);
      return res.status(500).json({ success: false, message: "Enquiries fetch failed" });
    }
    res.status(200).json({ success: true, enquiries: results });
  });
});
app.get("/api/enquiry/cards", (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const sql = `
    SELECT
      COUNT(*) as totalEnquiries,
      SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pendingEnquiries,
      SUM(CASE WHEN status = 'Resolved' AND DATE(created_at) = ? THEN 1 ELSE 0 END) as resolvedToday,
      SUM(CASE WHEN priority = 'High' THEN 1 ELSE 0 END) as highPriority
    FROM enquiries `;
  db.query(sql, [today], (err, results) => {
    if (err) {
      console.log("Enquiry cards fetch error:", err);
      return res.status(500).json({ success: false, message: "Cards fetch failed" });}
    const data = results[0] || { totalEnquiries: 0, pendingEnquiries: 0, resolvedToday: 0, highPriority: 0 };
    res.status(200).json(data);
  });
});
app.patch("/api/enquiries/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sql = "UPDATE enquiries SET status = ? WHERE id = ?";
  db.query(sql, [status, id], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Update failed" });
    res.status(200).json({ success: true, message: "Status updated" });
  });
});
app.post("/api/orders", (req, res) => {
  const {
    customer_name,
    email,
    phone,
    address,
    city,
    state,
    pincode,
    total_amount,
    items,
    payment_method,
    card_number,
    expiry_date,
    cvv,
    estimated_tax,
    discount_code,
    discount_amount,
    shipping_method
  } = req.body;
  if (!customer_name || !email || !total_amount) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }
  const sql = `
    INSERT INTO orders (
      customer_name, email, phone, address, city, state, pincode,
      total_amount, items, payment_method, card_number, expiry_date, cvv,
      estimated_tax, discount_code, discount_amount, shipping_method
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [
      customer_name,
      email,
      phone,
      address,
      city || "",
      state || "",
      pincode || "",
      total_amount,
      items || "",
      payment_method || "unknown",
      card_number || "",
      expiry_date || "",
      cvv || "",
      estimated_tax || 0,
      discount_code || "",
      discount_amount || 0,
      shipping_method || "Standard Delivery"
    ],
    (err, result) => {
      if (err) {
        console.log("Order insert error:", err);
        return res.status(500).json({ success: false, message: "Failed to place order" });
      }
      const orderId = result.insertId;
      const trackingNumber = "TRK" + Date.now();
      const ensureShippingTable = `
        CREATE TABLE IF NOT EXISTS shipping_details (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT NOT NULL,
          tracking_number VARCHAR(100),
          carrier VARCHAR(100) DEFAULT 'Standard Delivery',
          shipping_status VARCHAR(50) DEFAULT 'Pending',
          estimated_delivery DATE NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
      db.query(ensureShippingTable, () => {
        db.query(
          "INSERT INTO shipping_details (order_id, tracking_number, carrier, shipping_status) VALUES (?, ?, ?, ?)",
          [orderId, trackingNumber, shipping_method || "Standard Delivery", "Pending"],
          () => {}
        );
      });
      res.status(201).json({ success: true, message: "Order placed successfully", orderId, trackingNumber });
    }
  );
});
const ensureShippingTable = (cb) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS shipping_details (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      tracking_number VARCHAR(100),
      carrier VARCHAR(100) DEFAULT 'Standard Delivery',
      shipping_status VARCHAR(50) DEFAULT 'Pending',
      estimated_delivery DATE NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
  db.query(sql, cb);
};
app.get("/api/shipping/all", (req, res) => {
  ensureShippingTable(() => {
    const sql = `
      SELECT sd.*, o.customer_name, o.email, o.phone, o.items, o.total_amount, o.status as order_status, o.created_at as order_date
      FROM shipping_details sd
      LEFT JOIN orders o ON sd.order_id = o.id
      ORDER BY sd.id DESC`;
    db.query(sql, (err, results) => {
      if (err) {
        console.log("Shipping all fetch error:", err);
        return res.status(500).json({ success: false, message: "Failed to fetch shipments" });
      }
      res.status(200).json({ success: true, shipments: results });
    });
  });
});
app.get("/api/shipping/cards", (req, res) => {
  ensureShippingTable(() => {
    const sql = `
      SELECT
        COUNT(*) as totalShipments,
        SUM(CASE WHEN shipping_status = 'Pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN shipping_status = 'Shipped' OR shipping_status = 'In Transit' THEN 1 ELSE 0 END) as inTransit,
        SUM(CASE WHEN shipping_status = 'Delivered' THEN 1 ELSE 0 END) as delivered,
        SUM(CASE WHEN shipping_status = 'Out for Delivery' THEN 1 ELSE 0 END) as outForDelivery
      FROM shipping_details`;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ success: false, message: "Cards fetch failed" });
      const d = results[0] || {};
      res.status(200).json({
        totalShipments: d.totalShipments || 0,
        pending: d.pending || 0,
        inTransit: d.inTransit || 0,
        delivered: d.delivered || 0,
        outForDelivery: d.outForDelivery || 0
      });
    });
  });
});
app.get("/api/shipping/:orderId", (req, res) => {
  const { orderId } = req.params;
  ensureShippingTable(() => {
    const sql = `
      SELECT sd.*, 
             o.customer_name, o.email, o.phone, o.address, o.city, o.state, o.pincode,
             o.items, o.total_amount, o.estimated_tax, o.discount_code, o.discount_amount,
             o.shipping_method, o.card_number, o.expiry_date, o.cvv,
             o.status as order_status, o.created_at as order_date, o.payment_method
      FROM shipping_details sd
      LEFT JOIN orders o ON sd.order_id = o.id
      WHERE sd.order_id = ?`;
    db.query(sql, [orderId], (err, results) => {
      if (err) return res.status(500).json({ success: false, message: "Failed to fetch shipping" });
      if (results && results.length > 0) {
        res.status(200).json({ success: true, shipping: results[0] });
      } else {
        res.status(200).json({ success: true, shipping: null });
      }
    });
  });
});
app.put("/api/shipping/:orderId", (req, res) => {
  const { orderId } = req.params;
  const { tracking_number, carrier, shipping_status, estimated_delivery } = req.body;
  ensureShippingTable(() => {
    db.query("SELECT * FROM shipping_details WHERE order_id = ?", [orderId], (err, existing) => {
      if (err) return res.status(500).json({ success: false, message: "DB error" });
      if (existing && existing.length > 0) {
        db.query(
          "UPDATE shipping_details SET tracking_number=?, carrier=?, shipping_status=?, estimated_delivery=? WHERE order_id=?",
          [tracking_number, carrier, shipping_status, estimated_delivery || null, orderId],
          (err2) => {
            if (err2) return res.status(500).json({ success: false, message: "Update failed" });
            if (shipping_status === "Delivered") {
              db.query("UPDATE orders SET status='Completed' WHERE id=?", [orderId], () => {});
            }
            res.status(200).json({ success: true, message: "Shipping updated successfully" });
          }
        );
      } else {
        db.query(
          "INSERT INTO shipping_details (order_id, tracking_number, carrier, shipping_status, estimated_delivery) VALUES (?, ?, ?, ?, ?)",
          [orderId, tracking_number, carrier, shipping_status, estimated_delivery || null],
          (err2) => {
            if (err2) return res.status(500).json({ success: false, message: "Insert failed" });
            res.status(201).json({ success: true, message: "Shipping created successfully" });
          }
        );
      }
    });
  });
});
app.get("/api/orders", (req, res) => {
  const sql = "SELECT * FROM orders ORDER BY id DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.log("Orders fetch error:", err);
      return res.status(500).json({ success: false, message: "Orders fetch failed" });
    }
    res.status(200).json({ success: true, orders: results });
  });
});
app.get("/api/order/cards", (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) as totalOrders,
      SUM(CASE WHEN status = 'Pending' OR status IS NULL THEN 1 ELSE 0 END) as pendingOrders,
      SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completedOrders,
      SUM(CASE WHEN status = 'Cancelled' THEN 1 ELSE 0 END) as cancelledOrders
    FROM orders  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.log("Order cards fetch error:", err);
      return res.status(500).json({ success: false, message: "Order cards fetch failed" }); }
    const data = results[0] || { totalOrders: 0, pendingOrders: 0, completedOrders: 0, cancelledOrders: 0 };
    res.status(200).json(data);
  });
});
app.get("/api/report/recent", (req, res) => {
  const sql = `
    (SELECT id, product_name AS name, base_price AS revenue, is_active AS item_status, created_at AS date, 'Product' AS type
     FROM products)
    UNION ALL
    (SELECT id, category_name AS name, 0 AS revenue, status AS item_status, created_at AS date, 'Category' AS type
     FROM categories)
    ORDER BY date DESC
    LIMIT 10
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.log("Recent report fetch error:", err);
      return res.status(500).json({ success: false, message: "Failed to fetch recent reports" });
    }
    const data = (results || []).map((o) => ({
      id: `#${o.type === 'Product' ? 'PRD' : 'CAT'}-${o.id}`,
      client: o.name,
      revenue: o.type === 'Product' ? `₹${Number(o.revenue || 0).toLocaleString("en-IN")}` : '-',
      status: o.type === 'Product' ? (o.item_status ? 'Active' : 'Inactive') : (o.item_status || 'Active'),
      color: (o.type === 'Product' ? o.item_status : (o.item_status === 'Active')) ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800",
      date: o.date ? new Date(o.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" }) : "",
    }));
    res.status(200).json({ success: true, recentReports: data });
  });
});

app.get("/api/report/mix", (req, res) => {
  res.json({
    products: 55,
    services: 30,
    other: 15
  });
});

app.get("/api/report/engagement", (req, res) => {
  res.json([
    { week: "Week 1", height: 110 },
    { week: "Week 2", height: 155 },
    { week: "Week 3", height: 130 },
    { week: "Week 4", height: 180 },
  ]);
});
app.get("/api/report/cards", (req, res) => {
  const data = { totalRevenue: "₹0", totalOrders: 0, activeUsers: 0, monthlyGrowth: "0%" };
  db.query("SELECT SUM(total_amount) as sum FROM orders", (err, result) => {
    if (!err && result[0]) data.totalRevenue = `₹${Number(result[0].sum || 0).toLocaleString("en-IN")}`;
    db.query("SELECT COUNT(*) as count FROM orders", (err, result) => {
      if (!err && result[0]) data.totalOrders = result[0].count;
      db.query("SELECT COUNT(*) as count FROM users WHERE status = 'Active' OR status IS NULL", (err, result) => {
        if (!err && result[0]) data.activeUsers = result[0].count;
        res.status(200).json(data);
      });
    });
  });
});
app.get("/api/support/cards", (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const sql = `
    SELECT
      COUNT(*) as totalTickets,
      SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as openTickets,
      SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as pendingIssues,
      SUM(CASE WHEN status = 'Resolved' AND DATE(created_at) = ? THEN 1 ELSE 0 END) as resolvedToday
    FROM enquiries`;
  db.query(sql, [today], (err, results) => {
    if (err) {
      console.log("Support cards fetch error:", err);
      return res.status(500).json({ success: false, message: "Support cards fetch failed" });
    }
    const d = results[0] || { totalTickets: 0, openTickets: 0, pendingIssues: 0, resolvedToday: 0 };
    res.status(200).json({
      totalTickets: d.totalTickets || 0,
      openTickets: d.openTickets || 0,
      pendingIssues: d.pendingIssues || 0,
      resolvedToday: d.resolvedToday || 0,
      totalTicketsGrowth: "+0%",
      openTicketsGrowth: "+0%",
      pendingIssuesGrowth: "+0%",
      resolvedTodayGrowth: "+0%",
    });
  });
});
app.get("/api/dashboard/cards", (req, res) => {
  const data = { totalOrders: 0, totalRevenue: 0, totalProducts: 0, activeUsers: 0 };
  db.query("SELECT COUNT(*) as count FROM orders", (err, r1) => {
    if (!err && r1[0]) data.totalOrders = r1[0].count;
    db.query("SELECT SUM(total_amount) as sum FROM orders", (err, r2) => {
      if (!err && r2[0]) data.totalRevenue = r2[0].sum || 0;
      db.query("SELECT COUNT(*) as count FROM products", (err, r3) => {
        if (!err && r3[0]) data.totalProducts = r3[0].count;
        db.query("SELECT COUNT(*) as count FROM users WHERE status = 'Active' OR status IS NULL", (err, r4) => {
          if (!err && r4[0]) data.activeUsers = r4[0].count;
          res.status(200).json(data);
        });
      });
    });
  });
});
app.get("/api/sales-performance", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      direct: 40,
      social: 30,
      referral: 20,
      email: 10
    }
  });
});
app.get("/api/revenue-graph", (req, res) => {
  const currentYear = new Date().getFullYear();
  const sql = `
    SELECT MONTH(created_at) as month, SUM(total_amount) as total
    FROM orders
    WHERE YEAR(created_at) = ?
    GROUP BY MONTH(created_at)
  `;
  db.query(sql, [currentYear], (err, results) => {
    if (err) {
      console.error("Error fetching revenue graph data:", err);
      return res.status(500).json({ success: false, error: err.message });
    }
    const data = Array(12).fill(0);
    if (results && results.length > 0) {
      results.forEach(row => {
        const index = row.month - 1;
        if (index >= 0 && index < 12) {
          data[index] = parseFloat(row.total || 0);
        }
      });
    } else {
      return res.status(200).json({ success: true, data: [12000, 19000, 3000, 5000, 2000, 3000, 15000, 23000, 18000, 29000, 20000, 31000] });
    }
    res.status(200).json({ success: true, data });
  });
});
app.get("/api/support/tickets", (req, res) => {
  const sql = "SELECT * FROM enquiries ORDER BY id DESC LIMIT 10";
  db.query(sql, (err, results) => {
    if (err) {
      console.log("Support tickets fetch error:", err);
      return res.status(500).json({ success: false, message: "Support tickets fetch failed" });}
    const tickets = results.map(e => ({
      id: e.id,
      name: e.full_name || "Unknown",
      email: e.email || "",
      phone: e.phone || "",
      subject: e.subject || "General Inquiry",
      message: e.message || "",
      priority: e.priority || "Medium",
      status: e.status || "Pending",
      created_at: e.created_at,
    }));
    res.status(200).json(tickets);
  });
});
app.put("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const { customer_name, email, phone, address, items, total_amount, status } = req.body;
  const sql = `
    UPDATE orders SET 
      customer_name=?, email=?, phone=?, address=?, items=?, total_amount=?, status=?
    WHERE id=?`;
  db.query(sql, [customer_name, email, phone, address, items, total_amount, status || "Pending", id], (err, result) => {
    if (err) {
      console.log("Order update error:", err);
      return res.status(500).json({ success: false, message: "Failed to update order" });
    }
    res.status(200).json({ success: true, message: "Order updated successfully" });
  });
});
app.delete("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM orders WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log("Order delete error:", err);
      return res.status(500).json({ success: false, message: "Delete failed" });
    }
    res.status(200).json({ success: true, message: "Order deleted successfully" });
  });
});
app.put("/api/enquiries/:id", (req, res) => {
  const { id } = req.params;
  const { name, full_name, email, phone, subject, message, priority, status } = req.body;
  const clientName = full_name || name || "";
  const sql = `
    UPDATE enquiries SET 
      full_name=?, email=?, phone=?, subject=?, message=?, priority=?, status=?
    WHERE id=?`;
  db.query(sql, [clientName, email, phone, subject, message, priority, status, id], (err, result) => {
    if (err) {
      console.log("Enquiry update error:", err);
      return res.status(500).json({ success: false, message: "Failed to update enquiry" });
    }
    res.status(200).json({ success: true, message: "Enquiry updated successfully" });
  });
});
app.delete("/api/enquiries/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM enquiries WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log("Enquiry delete error:", err);
      return res.status(500).json({ success: false, message: "Delete failed" });
    }
    res.status(200).json({ success: true, message: "Enquiry deleted successfully" });
  });
});
app.put("/api/categories/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { category_name, slug, description, status, stats, created_at } = req.body;
  const image = req.file ? req.file.filename : null;
  let sql, params;
  if (image) {
    sql = `UPDATE categories SET category_name=?, slug=?, description=?, status=?, image=? WHERE id=?`;
    params = [category_name, slug || "", description || "", status || "Active", image, id];
  } else {
    sql = `UPDATE categories SET category_name=?, slug=?, description=?, status=? WHERE id=?`;
    params = [category_name, slug || "", description || "", status || "Active", id];
  }
  db.query(sql, params, (err, result) => {
    if (err) {
      console.log("Category update error:", err);
      return res.status(500).json({ success: false, message: "Failed to update category" });
    }
    res.status(200).json({ success: true, message: "Category updated successfully" });
  });
});
const ensureBrandsTable = (cb) => {
  const sql = `CREATE TABLE IF NOT EXISTS brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    description TEXT,
    image VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active',
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;
  db.query(sql, cb);
};
app.get("/api/brands", (req, res) => {
  ensureBrandsTable(() => {
    db.query("SELECT * FROM brands ORDER BY id DESC", (err, results) => {
      if (err) return res.status(500).json({ success: false, message: "Brands fetch failed" });
      res.status(200).json({ success: true, brands: results });
    });
  });
});
app.post("/api/brands", upload.single("image"), (req, res) => {
  ensureBrandsTable(() => {
    const { brand_name, brandName, slug, description, status, website } = req.body;
    const finalBrandName = brand_name || brandName;
    const image = req.file ? req.file.filename : null;
    if (!finalBrandName) return res.status(400).json({ success: false, message: "Brand name required" });
    db.query(
      "INSERT INTO brands (brand_name, slug, description, image, status, website) VALUES (?, ?, ?, ?, ?, ?)",
      [finalBrandName, slug || "", description || "", image, status || "Active", website || ""],
      (err, result) => {
        if (err) { console.log("Brand insert error:", err); return res.status(500).json({ success: false, message: "Failed to add brand" }); }
        res.status(201).json({ success: true, message: "Brand added successfully", id: result.insertId });
      }
    );
  });
});
app.put("/api/brands/:id", upload.single("image"), (req, res) => {
  ensureBrandsTable(() => {
    const { id } = req.params;
    const { brand_name, brandName, slug, description, status, website } = req.body;
    const finalBrandName = brand_name || brandName;
    const image = req.file ? req.file.filename : null;
    let sql, params;
    if (image) {
      sql = "UPDATE brands SET brand_name=?, slug=?, description=?, image=?, status=?, website=? WHERE id=?";
      params = [finalBrandName, slug || "", description || "", image, status || "Active", website || "", id];
    } else {
      sql = "UPDATE brands SET brand_name=?, slug=?, description=?, status=?, website=? WHERE id=?";
      params = [finalBrandName, slug || "", description || "", status || "Active", website || "", id];
    }
    db.query(sql, params, (err) => {
      if (err) return res.status(500).json({ success: false, message: "Failed to update brand" });
      res.status(200).json({ success: true, message: "Brand updated successfully" });
    });
  });
});
app.delete("/api/brands/:id", (req, res) => {
  db.query("DELETE FROM brands WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error deleting brand" });
    res.json({ success: true, message: "Brand deleted successfully" });
  });
});

const ensureTestimonialsTable = (cb) => {
  const sql = `CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    review TEXT NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;
  db.query(sql, (err) => {
    if (err) {
      console.log("Error creating testimonials table:", err);
      if (cb) cb();
      return;
    }
    db.query("SELECT COUNT(*) as count FROM testimonials", (err, results) => {
      if (!err && results[0] && results[0].count === 0) {
        const seedSql = "INSERT INTO testimonials (name, role, review, image) VALUES ?";
        const seedValues = [
          ["Amit Sharma", "Devotee, New Delhi", "The Ganesh Puja service was conducted with absolute devotion and purity. The priest explained all the rituals beautifully.", "u1.avif"],
          ["Priya Patel", "Yoga Teacher, Mumbai", "We booked a Griha Pravesh Puja. The experience was seamless and the positive energy in our new home is amazing.", "u2.webp"],
          ["Rajesh Iyer", "Software Engineer, Bengaluru", "Extremely satisfied with the Rudrabhishek service. Certified priests and timely execution. Will definitely book again.", "u3.avif"]
        ];
        db.query(seedSql, [seedValues], (err) => {
          if (err) console.log("Error seeding testimonials:", err);
          if (cb) cb();
        });
      } else {
        if (cb) cb();
      }
    });
  });
};

app.get("/api/testimonials", (req, res) => {
  ensureTestimonialsTable(() => {
    db.query("SELECT * FROM testimonials ORDER BY id DESC", (err, results) => {
      if (err) return res.status(500).json({ success: false, message: "Failed to fetch testimonials" });
      res.status(200).json({ success: true, testimonials: results });
    });
  });
});

app.post("/api/testimonials", upload.single("image"), (req, res) => {
  ensureTestimonialsTable(() => {
    const { name, role, review } = req.body;
    const image = req.file ? req.file.filename : null;
    if (!name || !review) return res.status(400).json({ success: false, message: "Name and review are required" });
    db.query(
      "INSERT INTO testimonials (name, role, review, image) VALUES (?, ?, ?, ?)",
      [name, role || "", review, image],
      (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Failed to add testimonial" });
        res.status(201).json({ success: true, message: "Testimonial added successfully", id: result.insertId });
      }
    );
  });
});

app.delete("/api/testimonials/:id", (req, res) => {
  db.query("DELETE FROM testimonials WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Failed to delete testimonial" });
    res.json({ success: true, message: "Testimonial deleted successfully" });
  });
});


app.get("/api/colors", (req, res) => {
  db.query("SELECT * FROM colors ORDER BY created_at DESC", (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Error fetching colors" });
    res.json({ success: true, colors: results });
  });
});

app.post("/api/colors", (req, res) => {
  const { colorName, hexCode } = req.body;
  if (!colorName) return res.status(400).json({ success: false, message: "Color name required" });
  db.query("INSERT INTO colors (color_name, hex_code) VALUES (?, ?)", [colorName, hexCode], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error adding color" });
    res.json({ success: true, message: "Color added successfully" });
  });
});

app.delete("/api/colors/:id", (req, res) => {
  db.query("DELETE FROM colors WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error deleting color" });
    res.json({ success: true, message: "Color deleted successfully" });
  });
});
const ensureFeaturesTable = (cb) => {
  const sql = `CREATE TABLE IF NOT EXISTS product_features (
    id INT AUTO_INCREMENT PRIMARY KEY,
    feature_name VARCHAR(255) NOT NULL,
    feature_value VARCHAR(255),
    product_id INT,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;
  db.query(sql, cb);
};
app.get("/api/features", (req, res) => {
  ensureFeaturesTable(() => {
    db.query("SELECT * FROM product_features ORDER BY id DESC", (err, results) => {
      if (err) return res.status(500).json({ success: false, message: "Features fetch failed" });
      res.status(200).json({ success: true, features: results });
    });
  });
});
app.post("/api/features", (req, res) => {
  ensureFeaturesTable(() => {
    const { feature_name, feature_value, product_id, category } = req.body;
    if (!feature_name) return res.status(400).json({ success: false, message: "Feature name required" });
    db.query(
      "INSERT INTO product_features (feature_name, feature_value, product_id, category) VALUES (?, ?, ?, ?)",
      [feature_name, feature_value || "", product_id || null, category || ""],
      (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "Failed to add feature" });
        res.status(201).json({ success: true, message: "Feature added successfully", id: result.insertId });
      }
    );
  });
});
app.put("/api/features/:id", (req, res) => {
  ensureFeaturesTable(() => {
    const { id } = req.params;
    const { feature_name, feature_value, category } = req.body;
    db.query(
      "UPDATE product_features SET feature_name=?, feature_value=?, category=? WHERE id=?",
      [feature_name, feature_value || "", category || "", id],
      (err) => {
        if (err) return res.status(500).json({ success: false, message: "Failed to update feature" });
        res.status(200).json({ success: true, message: "Feature updated successfully" });
      }
    );
  });
});
app.delete("/api/features/:id", (req, res) => {
  ensureFeaturesTable(() => {
    db.query("DELETE FROM product_features WHERE id = ?", [req.params.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: "Delete failed" });
      res.status(200).json({ success: true, message: "Feature deleted successfully" });
    });
  });
});
app.get("/api/activities", (req, res) => {
  const activities = [];
  db.query("SELECT customer_name, status, created_at FROM orders ORDER BY id DESC LIMIT 3", (err, orders) => {
    if (!err && orders) {
      orders.forEach(o => {
        activities.push({
          name: o.customer_name,
          text: `placed an order — Status: ${o.status || "Pending"}`,
          time: timeAgo(o.created_at),
          type: "order"
        });
      });
    }
    db.query("SELECT full_name, subject, created_at FROM enquiries ORDER BY id DESC LIMIT 3", (err, enquiries) => {
      if (!err && enquiries) {
        enquiries.forEach(e => {
          activities.push({
            name: e.full_name,
            text: `submitted enquiry: "${e.subject || 'General'}"`,
            time: timeAgo(e.created_at),
            type: "enquiry"
          });
        });
      }
      db.query("SELECT full_name, created_at FROM users ORDER BY id DESC LIMIT 2", (err, users) => {
        if (!err && users) {
          users.forEach(u => {
            activities.push({
              name: u.full_name,
              text: "registered as a new user",
              time: timeAgo(u.created_at),
              type: "user"
            });
          });
        }
        activities.sort((a, b) => new Date(b.rawTime) - new Date(a.rawTime));
        res.status(200).json(activities);
      });
    });
  });
});
function timeAgo(date) {
  if (!date) return "Just now";
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return past.toLocaleDateString();
}
const ensureDefaultSettings = (cb) => {
  const defaults = {
    bookings_count: "15K+",
    average_rating: "4.9/5",
    services_count: "50+"
  };
  const promises = Object.keys(defaults).map(key => {
    return new Promise((resolve) => {
      db.query("INSERT IGNORE INTO settings (setting_key, setting_value) VALUES (?, ?)", [key, defaults[key]], () => {
        resolve();
      });
    });
  });
  Promise.all(promises).then(() => {
    if (cb) cb();
  });
};
app.get("/api/settings", (req, res) => {
  ensureDefaultSettings(() => {
    const sql = "SELECT * FROM settings";
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ success: false, message: "Failed to fetch settings" });
      const settings = {};
      results.forEach(row => { settings[row.setting_key] = row.setting_value; });
      res.status(200).json({ success: true, settings });
    });
  });
});
app.post("/api/settings", (req, res) => {
  const { settings } = req.body;
  if (!settings || typeof settings !== 'object') {
    return res.status(400).json({ success: false, message: "Invalid settings format" });
  }
  const promises = Object.keys(settings).map((key) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO settings (setting_key, setting_value) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE setting_value = ?  `;
      db.query(sql, [key, settings[key], settings[key]], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
  Promise.all(promises)
    .then(() => res.status(200).json({ success: true, message: "Settings updated successfully" }))
    .catch((err) => {
      console.log("Settings update error:", err);
      res.status(500).json({ success: false, message: "Failed to update settings" });
    });});
app.get("/api/dashboard/cards", (req, res) => {
  const data = { totalOrders: 0, totalRevenue: 0, totalProducts: 0, activeUsers: 0 };
  db.query("SELECT COUNT(*) as count FROM orders", (err, result) => {
    if (!err && result[0]) data.totalOrders = result[0].count;
    db.query("SELECT SUM(total_amount) as sum FROM orders", (err, result) => {
      if (!err && result[0]) data.totalRevenue = result[0].sum || 0;
      db.query("SELECT COUNT(*) as count FROM products", (err, result) => {
        if (!err && result[0]) data.totalProducts = result[0].count;
        db.query("SELECT COUNT(*) as count FROM users WHERE status = 'Active'", (err, result) => {
          if (!err && result[0]) data.activeUsers = result[0].count;
          res.json(data);
        });
      });
    });
  });
});
app.post("/api/wishlist", (req, res) => {
  const { userId, productId } = req.body;
  if (!userId || !productId) return res.status(400).json({ success: false, message: "Missing params" });
  
  db.query(`CREATE TABLE IF NOT EXISTS wishlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_wishlist (user_id, product_id)
  )`, (createErr) => {
    if (createErr) console.error("wishlist table error", createErr);
    
    db.query("SELECT * FROM wishlists WHERE user_id = ? AND product_id = ?", [userId, productId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Error checking wishlist" });
    if (results && results.length > 0) {
      db.query("DELETE FROM wishlists WHERE user_id = ? AND product_id = ?", [userId, productId], (err2) => {
        if (err2) return res.status(500).json({ success: false, message: "Error removing" });
        res.json({ success: true, message: "Removed from wishlist", action: "removed" });
      });
    } else {
      db.query("INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)", [userId, productId], (err2) => {
        if (err2) return res.status(500).json({ success: false, message: "Error adding" });
        res.json({ success: true, message: "Added to wishlist", action: "added" });
      });
    }
  });
  });
});
app.get("/api/wishlist/:userId", (req, res) => {
  const { userId } = req.params;
  db.query(`CREATE TABLE IF NOT EXISTS wishlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_wishlist (user_id, product_id)
  )`, (createErr) => {
    const sql = `
    SELECT w.id as wishlist_id, w.product_id, w.created_at as wishlisted_at,
           p.product_name, p.base_price, p.discount_price, p.image, p.category, p.brand, p.stock_quantity
    FROM wishlists w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ?
    ORDER BY w.created_at DESC`;
  db.query(sql, [userId], (err, results) => {
      if (err) return res.status(500).json({ success: false, message: "Error fetching wishlist" });
      res.json({ success: true, wishlist: results || [] });
    });
  });
});
app.delete("/api/wishlist/:userId/:productId", (req, res) => {
  const { userId, productId } = req.params;
  db.query(`CREATE TABLE IF NOT EXISTS wishlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_wishlist (user_id, product_id)
  )`, (createErr) => {
    db.query("DELETE FROM wishlists WHERE user_id = ? AND product_id = ?", [userId, productId], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Delete failed" });
      res.json({ success: true, message: "Removed from wishlist" });
    });
  });
});
app.post("/api/share-email", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email is required" });
  try {
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "test@gmail.com",
        pass: process.env.EMAIL_PASS || "testpassword",
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER || "noreply@lumina.com",
      to: email,
      subject: "Check out Lumina - Premium Shopping Experience",
      html: `<div style="font-family:Arial;max-width:600px;margin:0 auto;padding:20px;"><h1 style="color:#7c3aed;text-align:center;">Welcome to Lumina</h1><p style="color:#555;font-size:16px;">Discover curated selections from the world's most innovative brands. Premium quality, sustainable materials and timeless design.</p><div style="text-align:center;margin:30px 0;"><a href="http://localhost:5173/home" style="background:#7c3aed;color:white;padding:12px 30px;border-radius:25px;text-decoration:none;font-weight:bold;">Shop Now</a></div></div>`,
    });
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.log("Email error:", error.message);
    res.json({ success: true, message: "Email shared! (Demo mode)" });
  }
});
app.get("/api/performance", (req, res) => {
  const data = { monthlyTarget: 0, completedPercentage: 0, totalRevenue: 0, monthlyOrders: 0 };
  db.query("SELECT COUNT(*) as total, SUM(CASE WHEN status='Completed' THEN 1 ELSE 0 END) as completed FROM orders", (err, result) => {
    if (!err && result[0]) {
      data.monthlyOrders = result[0].total;
      data.completedPercentage = result[0].total > 0 ? Math.round((result[0].completed / result[0].total) * 100) : 0;
      data.monthlyTarget = data.completedPercentage;
    }
    db.query("SELECT SUM(total_amount) as sum FROM orders", (err2, result2) => {
      if (!err2 && result2[0]) data.totalRevenue = result2[0].sum || 0;
      res.json(data);
    });
  });
});
app.get("/api/search", (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ success: true, products: [], categories: [] });
  const searchTerm = "%" + q + "%";
  db.query("SELECT * FROM products WHERE product_name LIKE ? OR category LIKE ? OR brand LIKE ? OR description LIKE ? LIMIT 20", [searchTerm, searchTerm, searchTerm, searchTerm], (err, products) => {
    if (err) return res.status(500).json({ success: false, message: "Search failed" });
    db.query("SELECT * FROM categories WHERE category_name LIKE ? LIMIT 10", [searchTerm], (err2, categories) => {
      if (err2) return res.json({ success: true, products: products || [], categories: [] });
      res.json({ success: true, products: products || [], categories: categories || [] });
    });
  });
});

app.get("/api/admin/search", (req, res) => {
  const q = req.query.q;
  if (!q) return res.json({ pages: [], users: [], orders: [], products: [] });
  
  const searchPattern = `%${q}%`;
  const lowerQ = q.toLowerCase();
  
  const pages = [
    { name: "Dashboard", type: "page", icon: "📊" },
    { name: "Order Management", type: "page", icon: "📦" },
    { name: "Product Management", type: "page", icon: "🛍️" },
    { name: "Categories", type: "page", icon: "📁" },
    { name: "Users", type: "page", icon: "👥" },
    { name: "Enquiries", type: "page", icon: "📧" },
    { name: "Support", type: "page", icon: "🎧" },
    { name: "Settings", type: "page", icon: "⚙️" }
  ].filter(p => p.name.toLowerCase().includes(lowerQ));

  const results = { pages, users: [], orders: [], products: [] };
  
  db.query("SELECT id, full_name as name, email FROM users WHERE full_name LIKE ? OR email LIKE ? LIMIT 3", [searchPattern, searchPattern], (err, users) => {
    if (!err && users) results.users = users;
    db.query("SELECT id, customer_name as name, email FROM orders WHERE customer_name LIKE ? OR email LIKE ? OR id LIKE ? LIMIT 3", [searchPattern, searchPattern, searchPattern], (err, orders) => {
      if (!err && orders) results.orders = orders;
      db.query("SELECT id, product_name as name, base_price, image FROM products WHERE product_name LIKE ? OR sku LIKE ? LIMIT 3", [searchPattern, searchPattern], (err, products) => {
        if (!err && products) results.products = products;
        res.json(results);
      });
    });
  });
});
app.get("/api/revenue-graph", (req, res) => {
  const sql = `SELECT MONTH(created_at) as month, SUM(total_amount) as revenue FROM orders WHERE YEAR(created_at) = YEAR(CURDATE()) GROUP BY MONTH(created_at) ORDER BY month`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Revenue graph failed" });
    const months = Array(12).fill(0);
    (results || []).forEach(r => { months[r.month - 1] = Number(r.revenue) || 0; });
    res.json({ success: true, data: months });
  });
});

const fs = require('fs');
const settingsPath = path.join(__dirname, 'settings.json');
app.get("/api/settings", (req, res) => {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      res.json({ success: true, settings: data });
    } else {
      res.json({ success: true, settings: {} });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load settings" });
  }
});
app.post("/api/settings", (req, res) => {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(req.body.settings || {}, null, 2));
    res.json({ success: true, message: "Settings saved" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to save settings" });
  }
});
app.post("/api/products/:id/rate", (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  if (!rating) return res.status(400).json({ success: false, message: "Rating is required" });
  
  db.query("SELECT rating FROM products WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ success: false });
    if (!results.length) return res.status(404).json({ success: false, message: "Product not found" });
    let currentRating = parseFloat(results[0].rating || "0");
    let newRating = currentRating === 0 ? parseFloat(rating) : ((currentRating + parseFloat(rating)) / 2).toFixed(2);
    
    db.query("UPDATE products SET rating = ? WHERE id = ?", [newRating, id], (err) => {
      if (err) return res.status(500).json({ success: false, message: "Failed to update rating" });
      res.json({ success: true, message: "Rating updated", newRating });
    });
  });
});
const ensureSettingsTables = (cb) => {
  db.query(`CREATE TABLE IF NOT EXISTS admin_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`, () => {
    db.query(`CREATE TABLE IF NOT EXISTS admin_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      device_info VARCHAR(255),
      browser VARCHAR(100),
      ip_address VARCHAR(50),
      is_current TINYINT(1) DEFAULT 0,
      logged_in_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, () => { if (cb) cb(); });
  });
};
app.get("/api/settings", (req, res) => {
  ensureSettingsTables(() => {
    db.query("SELECT setting_key, setting_value FROM admin_settings", (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: "Failed to load settings" });
      const settings = {};
      (rows || []).forEach(r => { settings[r.setting_key] = r.setting_value; });
      res.json({ success: true, settings });
    });
  });
});
app.post("/api/settings", (req, res) => {
  ensureSettingsTables(() => {
    const { settings } = req.body;
    const entries = Object.entries(settings || {});
    if (entries.length === 0) return res.json({ success: true, message: "Settings saved" });
    let done = 0;
    entries.forEach(([key, value]) => {
      db.query(
        "INSERT INTO admin_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)",
        [key, value], () => {
          done++;
          if (done === entries.length) res.json({ success: true, message: "Settings saved" });
        });
    });
  });
});
app.put("/api/settings/password", (req, res) => {
  const { currentPassword, newPassword } = req.body;
  ensureSettingsTables(() => {
    db.query("SELECT setting_value FROM admin_settings WHERE setting_key = 'password'", (err, rows) => {
      const stored = rows && rows.length > 0 ? rows[0].setting_value : "admin123";
      if (stored !== currentPassword) return res.status(400).json({ success: false, message: "Current password is incorrect" });
      db.query(
        "INSERT INTO admin_settings (setting_key, setting_value) VALUES ('password', ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)",
        [newPassword], (err2) => {
          if (err2) return res.status(500).json({ success: false, message: "Failed to update password" });
          res.json({ success: true, message: "Password updated successfully" });
        });
    });
  });
});
app.post("/api/settings/devices/signout", (req, res) => {
  const { device_info, browser } = req.body;
  ensureSettingsTables(() => {
    db.query("DELETE FROM admin_sessions WHERE device_info = ? AND browser = ? AND is_current = 1", [device_info, browser], (err) => {
      if (err) return res.status(500).json({ success: false, message: "Sign out failed" });
      res.json({ success: true, message: "Logged out successfully" });
    });
  });
});
app.get("/api/settings/devices", (req, res) => {
  ensureSettingsTables(() => {
    db.query("SELECT * FROM admin_sessions ORDER BY is_current DESC, logged_in_at DESC", (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: "Failed to load devices" });
      res.json({ success: true, devices: rows || [] });
    });
  });
});
app.post("/api/settings/devices", (req, res) => {
  const { device_info, browser, ip_address } = req.body;
  ensureSettingsTables(() => {
    db.query("UPDATE admin_sessions SET is_current = 0", () => {
      db.query("SELECT id FROM admin_sessions WHERE device_info = ? AND browser = ?", [device_info, browser], (err, existing) => {
        if (existing && existing.length > 0) {
          db.query("UPDATE admin_sessions SET is_current = 1, logged_in_at = NOW(), ip_address = ? WHERE id = ?", [ip_address, existing[0].id], () => {
            res.json({ success: true, message: "Device registered" });
          });
        } else {
          db.query("INSERT INTO admin_sessions (device_info, browser, ip_address, is_current) VALUES (?, ?, ?, 1)", [device_info, browser, ip_address], () => {
            res.json({ success: true, message: "Device registered" });
          });
        }
      });
    });
  });
});
app.delete("/api/settings/devices/others", (req, res) => {
  ensureSettingsTables(() => {
    db.query("DELETE FROM admin_sessions WHERE is_current = 0", (err) => {
      if (err) return res.status(500).json({ success: false, message: "Failed to sign out devices" });
      res.json({ success: true, message: "Signed out all other devices" });
    });
  });
});
app.get("/api/revenue-graph", (req, res) => {
  const sql = `
    SELECT MONTH(created_at) as month, SUM(total_amount) as revenue
    FROM orders
    WHERE YEAR(created_at) = YEAR(CURDATE())
    GROUP BY MONTH(created_at)
    ORDER BY month`;
  db.query(sql, (err, results) => {
    if (err) {
      console.log("Revenue graph error:", err);
      return res.status(500).json({ success: false, message: "Revenue graph failed" });
    }
    const months = Array(12).fill(0);
    (results || []).forEach(r => {
      months[r.month - 1] = Number(r.revenue) || 0;
    });
    res.status(200).json({ success: true, data: months });
  });
});
app.post("/api/newsletter/subscribe", (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Valid email required" });
  }
  db.query(
    `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    (createErr) => {
      if (createErr) console.error("Newsletter table error:", createErr);
      db.query("SELECT id FROM newsletter_subscribers WHERE email = ?", [email], (checkErr, existing) => {
        if (checkErr) return res.status(500).json({ success: false, message: "Error checking subscription" });
        if (existing && existing.length > 0) return res.status(400).json({ success: false, message: "Email already subscribed" });
        
        db.query("INSERT INTO newsletter_subscribers (email) VALUES (?)", [email], (insertErr) => {
          if (insertErr) return res.status(500).json({ success: false, message: "Error subscribing" });
          res.json({ success: true, message: "Subscription successful!" });
        });
      });
    }
  );
});
app.get("/api/notifications", (req, res) => {
  const ordersSql = `
    SELECT id, customer_name, total_amount, status, created_at, 'order' as type
    FROM orders
    WHERE status = 'Pending'
    ORDER BY created_at DESC
    LIMIT 5`;
  const enquiriesSql = `
    SELECT id, name, email, subject, created_at, 'enquiry' as type
    FROM enquiries
    ORDER BY created_at DESC
    LIMIT 5`;

  db.query(ordersSql, (ordErr, orders) => {
    if (ordErr) {
      orders = [];
    }
    db.query(enquiriesSql, (enqErr, enquiries) => {
      if (enqErr) {
        enquiries = [];
      }
      const notifications = [
        ...(orders || []).map(o => ({
          id: `order-${o.id}`,
          type: "order",
          title: `New Order #${o.id}`,
          message: `${o.customer_name} placed ₹${o.total_amount} order`,
          time: o.created_at,
          status: o.status
        })),
        ...(enquiries || []).map(e => ({
          id: `enq-${e.id}`,
          type: "enquiry",
          title: `Enquiry: ${e.subject || "New Message"}`,
          message: `From ${e.name} (${e.email})`,
          time: e.created_at,
          status: "New"
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 8);

      res.status(200).json({ success: true, notifications, count: notifications.length });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});