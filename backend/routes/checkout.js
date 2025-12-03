const express = require("express");
const router = express.Router();
const sql = require("mssql");
const config = require("../db");

router.post("/", async (req, res) => {
  const { cart } = req.body; 
  // cart = [{ productId: 1, quantity: 2 }, ...]

  try {
    const pool = await sql.connect(config);

    // Duyệt từng sản phẩm trong giỏ để trừ số lượng
    for (let item of cart) {
      await pool.request()
        .input("productId", sql.Int, item.productId)
        .input("quantity", sql.Int, item.quantity)
        .query(`
          UPDATE Product
          SET Quantity = Quantity - @quantity
          WHERE ProductID = @productId AND Quantity >= @quantity
        `);
    }

    res.json({ message: "Thanh toán thành công!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
