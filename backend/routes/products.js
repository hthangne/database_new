const express = require("express");
const router = express.Router();
const sql = require("mssql");
const config = require("../db");

// GET tất cả sản phẩm
router.get("/", async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .query(`SELECT ProductID, ProductName, ProductPrice, AverageReview, StockQuantity, DiscountRate, ProductStatus, StoreID FROM PRODUCT`);
    
    res.json(result.recordset);
  } catch (err) {
    console.error("Lỗi SQL:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
