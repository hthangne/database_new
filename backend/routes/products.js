const express = require("express");
const router = express.Router();
const sql = require("mssql");
const config = require("../db");

// GET tất cả sản phẩm
// GET tất cả sản phẩm
router.get("/", async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().query(`
      SELECT
        p.ProductID,
        p.ProductName,
        p.ProductPrice,
        p.AverageReview,
        p.StockQuantity,
        p.DiscountRate,
        p.ProductStatus,
        p.StoreID,

        -- Lấy ảnh giống Store.jsx
        (
          SELECT TOP 1 ImageURLProduct
          FROM Product_Image pi
          JOIN Product_Image_URL url ON pi.ImageID = url.ImageID
          WHERE pi.ProductID = p.ProductID
          ORDER BY pi.ImageID
        ) AS ImageURL

      FROM Product p
      WHERE p.ProductStatus <> 'Deleted'    -- ❗ LOẠI SẢN PHẨM BỊ XÓA
    `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Lỗi SQL:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;


