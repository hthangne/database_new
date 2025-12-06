const express = require("express");
const router = express.Router();
const sql = require("mssql");
const config = require("../db");

// ======================================
// GET PRODUCTS OF SELLER (LOAD STORE)
// ======================================
router.get("/:sellerId", async (req, res) => {
  const sellerId = parseInt(req.params.sellerId);

  try {
    const pool = await sql.connect(config);

    const result = await pool.request()
      .input("sellerId", sql.Int, sellerId)
      .query(`
        SELECT 
            p.*,
            (
                SELECT TOP 1 url.ImageURLProduct
                FROM Product_Image pi
                JOIN Product_Image_URL url ON pi.ImageID = url.ImageID
                WHERE pi.ProductID = p.ProductID
                ORDER BY url.ImageID
            ) AS ImageURL
        FROM Product p
        JOIN Store s ON p.StoreID = s.StoreID
        WHERE s.SellerID = @sellerId
        AND p.ProductStatus <> 'Deleted'
      `);

    res.json(result.recordset);

  } catch (err) {
    console.error("STORE GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ======================================
// ADD PRODUCT
// ======================================
router.post("/add", async (req, res) => {
  const { sellerId, name, price, stock, discount, status, imageURL } = req.body;

  try {
    if (!imageURL || imageURL.trim() === "") {
      return res.status(400).json({ error: "Chưa upload hình!" });
    }

    const pool = await sql.connect(config);

    // Lấy StoreID của seller
    const storeResult = await pool.request()
      .input("sellerId", sql.Int, sellerId)
      .query("SELECT StoreID FROM Store WHERE SellerID = @sellerId");

    if (storeResult.recordset.length === 0)
      return res.status(400).json({ error: "Seller không có Store!" });

    const storeId = storeResult.recordset[0].StoreID;

    // Tạo sản phẩm
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
        OUTPUT INSERTED.ProductID
        VALUES (@name, @price, @review, @stock, @discount, @status, @storeId)
      `);

    const productId = productResult.recordset[0].ProductID;

    // Tạo Product_Image
    const imgRes = await pool.request()
      .input("productId", sql.Int, productId)
      .query(`
        INSERT INTO Product_Image(ProductID)
        OUTPUT INSERTED.ImageID
        VALUES (@productId)
      `);

    const imageId = imgRes.recordset[0].ImageID;

    // Chuẩn hóa URL
    const pureURL = imageURL.replace(/^http:\/\/localhost:5000\//, "");

    // Lưu vào Product_Image_URL
    await pool.request()
      .input("imageId", sql.Int, imageId)
      .input("url", sql.NVarChar, pureURL)
      .query(`
        INSERT INTO Product_Image_URL(ImageID, ImageURLProduct)
        VALUES(@imageId, @url)
      `);

    res.json({ message: "Thêm sản phẩm thành công!" });

  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ======================================
// DELETE PRODUCT — FIX FULL
// ======================================
// SOFT DELETE PRODUCT
router.delete("/delete/:productId", async (req, res) => {
  const productId = parseInt(req.params.productId);

  try {
    const pool = await sql.connect(config);

    // Chỉ đánh dấu sản phẩm là Deleted
    await pool.request()
      .input("productId", sql.Int, productId)
      .query(`
        UPDATE Product
        SET ProductStatus = 'Deleted'
        WHERE ProductID = @productId
      `);

    res.json({ message: "Đã ẩn sản phẩm (soft delete)!" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


router.put("/update", async (req, res) => {
  const { productId, name, price, stock, discount, status, imageURL } = req.body;

  try {
    if (!productId) {
      return res.status(400).json({ error: "Thiếu productId để cập nhật!" });
    }

    const pool = await sql.connect(config);

    // Update product info
    await pool.request()
      .input("productId", sql.Int, productId)
      .input("name", sql.NVarChar, name)
      .input("price", sql.Decimal(18, 2), price)
      .input("stock", sql.Int, stock)
      .input("discount", sql.Float, discount)
      .input("status", sql.NVarChar, status)
      .query(`
        UPDATE Product
        SET 
          ProductName = @name,
          ProductPrice = @price,
          StockQuantity = @stock,
          DiscountRate = @discount,
          ProductStatus = @status
        WHERE ProductID = @productId
      `);

    // Cập nhật ảnh nếu có
    if (imageURL) {
      const pureURL = imageURL.replace(/^http:\/\/localhost:5000\//, "");

      await pool.request()
        .input("productId", sql.Int, productId)
        .input("url", sql.NVarChar, pureURL)
        .query(`
          UPDATE Product_Image_URL
          SET ImageURLProduct = @url
          WHERE ImageID = (SELECT TOP 1 ImageID FROM Product_Image WHERE ProductID=@productId)
        `);
    }

    res.json({ message: "Cập nhật thành công!" });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
