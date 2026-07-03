const express = require("express");
const multer = require("multer");
const pool = require("../db");
const router = express.Router();
const ensureCategoriesTable = async () => {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_name VARCHAR(150) NOT NULL,
      slug VARCHAR(180),
      parent_category VARCHAR(150),
      description TEXT,
      seo_title VARCHAR(255),
      seo_description TEXT,
      status VARCHAR(50) DEFAULT 'Active',
      featured TINYINT(1) DEFAULT 0,
      sitemap TINYINT(1) DEFAULT 1,
      global_search TINYINT(1) DEFAULT 1,
      breadcrumb VARCHAR(150),
      brand VARCHAR(150),
      image VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  try {
    const [cols] = await pool.execute(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='categories' AND COLUMN_NAME='brand'`
    );
    if (cols.length === 0) {
      await pool.execute(`ALTER TABLE categories ADD COLUMN brand VARCHAR(150)`);
    }
  } catch(e) { console.log('brand col check:', e.message); }
};
const path = require("path");
const UPLOADS_DIR = path.join(__dirname, "../../../backend/uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    await ensureCategoriesTable();

    const {
      category_name,
      slug,
      parent_category,
      description,
      seo_title,
      seo_description,
      status,
      featured,
      sitemap,
      global_search,
      breadcrumb,
    } = req.body;

    const image = req.file ? req.file.filename : "";

    await pool.query(
      `
      INSERT INTO categories (
        category_name,
        slug,
        parent_category,
        description,
        seo_title,
        seo_description,
        status,
        featured,
        sitemap,
        global_search,
        breadcrumb,
        image
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        category_name,
        slug,
        parent_category,
        description,
        seo_title,
        seo_description,
        status || "Active",
        featured || 0,
        sitemap || 1,
        global_search || 1,
        breadcrumb,
        image,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Category Added Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    await ensureCategoriesTable();

    const [rows] = await pool.query(
      "SELECT * FROM categories ORDER BY id DESC"
    );

    res.status(200).json({
      success: true,
      categories: rows,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error fetching categories",
    });
  }
});

router.get("/cards", async (req, res) => {
  try {
    const [totalRes] = await pool.query(
      "SELECT COUNT(*) as count FROM categories"
    );

    const [activeRes] = await pool.query(
      "SELECT COUNT(*) as count FROM categories WHERE status='Active'"
    );

    const [trendingRes] = await pool.query(
      "SELECT COUNT(*) as count FROM categories WHERE status='Trending'"
    );

    const [hiddenRes] = await pool.query(
      "SELECT COUNT(*) as count FROM categories WHERE status='Inactive' OR status='Hidden'"
    );

    res.json({
      totalCategories: totalRes[0].count || 0,
      activeCategories: activeRes[0].count || 0,
      trendingNow: trendingRes[0].count || 0,
      hiddenItems: hiddenRes[0].count || 0,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Cards Fetch Error",
    });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    await ensureCategoriesTable();
    const { id } = req.params;
    const {
      category_name,
      slug,
      parent_category,
      description,
      seo_title,
      seo_description,
      status,
      featured,
      sitemap,
      global_search,
      breadcrumb,
      brand,
    } = req.body;

    let query;
    let params;
    if (req.file) {
      const image = req.file.filename;
      query = `UPDATE categories SET category_name=?, slug=?, parent_category=?, description=?, seo_title=?, seo_description=?, status=?, featured=?, sitemap=?, global_search=?, breadcrumb=?, brand=?, image=? WHERE id=?`;
      params = [
        category_name,
        slug || "",
        parent_category || "",
        description || "",
        seo_title || "",
        seo_description || "",
        status || "Active",
        featured !== undefined ? Number(featured) : 0,
        sitemap !== undefined ? Number(sitemap) : 1,
        global_search !== undefined ? Number(global_search) : 1,
        breadcrumb || "",
        brand || "",
        image,
        id,
      ];
    } else {
      query = `UPDATE categories SET category_name=?, slug=?, parent_category=?, description=?, seo_title=?, seo_description=?, status=?, featured=?, sitemap=?, global_search=?, breadcrumb=?, brand=? WHERE id=?`;
      params = [
        category_name,
        slug || "",
        parent_category || "",
        description || "",
        seo_title || "",
        seo_description || "",
        status || "Active",
        featured !== undefined ? Number(featured) : 0,
        sitemap !== undefined ? Number(sitemap) : 1,
        global_search !== undefined ? Number(global_search) : 1,
        breadcrumb || "",
        brand || "",
        id,
      ];
    }

    await pool.query(query, params);
    res.json({ success: true, message: "Category updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Update Failed" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM categories WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Delete Failed",
    });
  }
});

module.exports = router;