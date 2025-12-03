const express = require("express");
const router = express.Router();
const sql = require("mssql");
const config = require("../db");

// -------------------------
// GET ALL PRODUCTS OF SELLER
// -------------------------
router.get("/:sellerId", async (req, res) => {
  const sellerId = parseInt(req.params.sellerId);

  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("sellerId", sql.Int, sellerId)
      .query(`
        SELECT p.*, 
          (SELECT TOP 1 ImageURLProduct
           FROM Product_Image pi 
           JOIN Product_Image_URL url ON pi.ImageID = url.ImageID
           WHERE pi.ProductID = p.ProductID
           ORDER BY pi.ImageID) AS ImageURL
        FROM Product p
        JOIN Store s ON p.StoreID = s.StoreID
        WHERE s.SellerID = @sellerId
      `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------
// ADD PRODUCT
// -------------------------
router.post("/add", async (req, res) => {
  const { sellerId, name, price, stock, discount, status, imageURL } = req.body;

  try {
    const pool = await sql.connect(config);

    // Lấy StoreID từ sellerId
    const storeResult = await pool.request()
      .input("sellerId", sql.Int, sellerId)
      .query("SELECT StoreID FROM Store WHERE SellerID = @sellerId");

    if (storeResult.recordset.length === 0) {
      return res.status(400).json({ error: "Seller chưa có store!" });
    }

    const storeId = storeResult.recordset[0].StoreID;

    // Tạo product
    const productResult = await pool.request()
      .input("name", sql.NVarChar, name)
      .input("price", sql.Decimal(18, 2), price)
      .input("review", sql.Float, 0)
      .input("stock", sql.Int, stock)
      .input("discount", sql.Float, discount)
      .input("status", sql.NVarChar, status)
      .input("storeId", sql.Int, storeId)
      .query(`
        INSERT INTO Product(ProductName, ProductPrice, AverageReview, StockQuantity, DiscountRate, ProductStatus, StoreID)
        OUTPUT inserted.ProductID
        VALUES (@name, @price, @review, @stock, @discount, @status, @storeId)
      `);

    const newProductId = productResult.recordset[0].ProductID;

    // Lưu Image vào bảng Image + ImageURL
    const img = await pool.request()
      .input("productId", sql.Int, newProductId)
      .query(`
        INSERT INTO Product_Image(ProductID)
        OUTPUT inserted.ImageID
        VALUES(@productId)
      `);

    const imageId = img.recordset[0].ImageID;

    await pool.request()
      .input("imageId", sql.Int, imageId)
      .input("url", sql.NVarChar, imageURL)
      .query(`
        INSERT INTO Product_Image_URL(ImageID, ImageURLProduct)
        VALUES(@imageId, @url)
      `);

    res.json({ message: "Thêm sản phẩm thành công!" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------
// DELETE PRODUCT
// -------------------------
router.delete("/delete/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);

  try {
    const pool = await sql.connect(config);

    // Xóa image trước
    await pool.request()
      .input("productId", sql.Int, productId)
      .query(`DELETE FROM Product_Image_URL WHERE ImageID IN 
              (SELECT ImageID FROM Product_Image WHERE ProductID=@productId)`);

    await pool.request()
      .input("productId", sql.Int, productId)
      .query("DELETE FROM Product_Image WHERE ProductID=@productId");

    // Xóa product
    await pool.request()
      .input("productId", sql.Int, productId)
      .query("DELETE FROM Product WHERE ProductID=@productId");

    res.json({ message: "Xóa sản phẩm thành công!" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
