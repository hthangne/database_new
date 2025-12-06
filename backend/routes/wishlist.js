// backend/routes/wishlist.js
const express = require("express");
const router = express.Router();
const sql = require("mssql");
const config = require("../db");

// ===============================
// 1️⃣ LẤY DANH SÁCH YÊU THÍCH CỦA USER
// GET /wishlist/:customerId
// ===============================
router.get("/:customerId", async (req, res) => {
  const customerId = parseInt(req.params.customerId);

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("cid", sql.Int, customerId)
      .query(`
        SELECT 
          p.ProductID,
          p.ProductName,
          p.ProductPrice,
          p.DiscountRate,
          p.AverageReview,
          p.StockQuantity,
          (SELECT TOP 1 ImageURLProduct 
           FROM Product_Image pi
           JOIN Product_Image_URL url ON pi.ImageID = url.ImageID
           WHERE pi.ProductID = p.ProductID) AS ProductImage
        FROM Customer_Favorite cf
        JOIN Product p ON cf.ProductID_Favorite = p.ProductID
        WHERE cf.CustomerID_Favorite = @cid
        ORDER BY cf.FavoriteDate DESC;
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Lỗi lấy wishlist:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ===============================
// 2️⃣ THÊM SẢN PHẨM VÀO YÊU THÍCH
// POST /wishlist/add
// ===============================
router.post("/add", async (req, res) => {
  const { customerId, productId } = req.body;

  try {
    const pool = await sql.connect(config);

    await pool.request()
      .input("cid", sql.Int, customerId)
      .input("pid", sql.Int, productId)
      .query(`
        IF NOT EXISTS (
          SELECT * FROM Customer_Favorite 
          WHERE CustomerID_Favorite = @cid AND ProductID_Favorite = @pid
        )
        INSERT INTO Customer_Favorite (CustomerID_Favorite, ProductID_Favorite, FavoriteDate)
        VALUES (@cid, @pid, GETDATE());
      `);

    res.json({ message: "Added to favorites" });
  } catch (err) {
    console.error("Lỗi thêm wishlist:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ===============================
// 3️⃣ XOÁ SẢN PHẨM KHỎI YÊU THÍCH
// DELETE /wishlist/remove?customerId=1&productId=3
// ===============================
router.delete("/remove", async (req, res) => {
  const customerId = parseInt(req.query.customerId);
  const productId = parseInt(req.query.productId);

  try {
    const pool = await sql.connect(config);

    await pool.request()
      .input("cid", sql.Int, customerId)
      .input("pid", sql.Int, productId)
      .query(`
        DELETE FROM Customer_Favorite
        WHERE CustomerID_Favorite = @cid AND ProductID_Favorite = @pid;
      `);

    res.json({ message: "Removed from favorites" });
  } catch (err) {
    console.error("Lỗi xóa wishlist:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
