// const express = require("express");
// const router = express.Router();
// const sql = require("mssql");
// const config = require("../db");

// router.post("/", async (req, res) => {
//   const { cart } = req.body; 
//   // cart = [{ productId: 1, quantity: 2 }, ...]

//   try {
//     const pool = await sql.connect(config);

//     // Duyệt từng sản phẩm trong giỏ để trừ số lượng
//     for (let item of cart) {
//       await pool.request()
//         .input("productId", sql.Int, item.productId)
//         .input("quantity", sql.Int, item.quantity)
//         .query(`
//           UPDATE Product
//           SET Quantity = Quantity - @quantity
//           WHERE ProductID = @productId AND Quantity >= @quantity
//         `);
//     }

//     res.json({ message: "Thanh toán thành công!" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const sql = require("mssql");
const config = require("../db");

router.post("/", async (req, res) => {
  const { customerId, items } = req.body; 
  // items = [{ productId, quantity }]

  try {
    const pool = await sql.connect(config);

    // 1) Kiểm tra tồn kho
    for (let item of items) {
      const check = await pool.request()
        .input("pid", sql.Int, item.productId)
        .query(`
          SELECT ProductName, StockQuantity 
          FROM Product
          WHERE ProductID = @pid
        `);

      if (check.recordset.length === 0) {
        return res.status(400).json({ error: "Sản phẩm không tồn tại!" });
      }

      const stock = check.recordset[0].StockQuantity;
      const name = check.recordset[0].ProductName;

      if (stock < item.quantity) {
        return res.status(400).json({
          error: `Sản phẩm "${name}" chỉ còn ${stock} cái, không thể mua ${item.quantity} cái!`
        });
      }
    }

    // 2) Trừ kho sau khi hợp lệ
    for (let item of items) {
      await pool.request()
        .input("pid", sql.Int, item.productId)
        .input("qty", sql.Int, item.quantity)
        .query(`
          UPDATE Product
          SET StockQuantity = StockQuantity - @qty
          WHERE ProductID = @pid
        `);
    }

    res.json({ message: "Thanh toán thành công!" });

  } catch (err) {
    console.error("Checkout Error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
