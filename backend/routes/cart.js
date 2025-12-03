const express = require("express");
const router = express.Router();
const sql = require("mssql");
const config = require("../db");

/* ===========================================================
   1) ADD TO CART
   =========================================================== */
router.post("/add", async (req, res) => {
  const { customerId, productId, quantity } = req.body;

  try {
    const pool = await sql.connect(config);

    /* ❗ Ensure user exists in CUSTOMER table
       Nếu user đăng ký mới => chưa nằm trong CUSTOMER => lỗi
    */
    await pool.request()
      .input("customerId", sql.Int, customerId)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM Customer WHERE CustomerID = @customerId)
        INSERT INTO Customer(CustomerID, TotalOrders, MemberLevel, RewardPoint)
        VALUES(@customerId, 0, 'Bronze', 0);
      `);

    /* ---- Get or Create Cart ---- */
    let cartResult = await pool.request()
      .input("CustomerID", sql.Int, customerId)
      .query("SELECT CartID FROM Cart WHERE CustomerID_Cart = @CustomerID");

    let cartId;
    if (cartResult.recordset.length === 0) {
      const insertCart = await pool.request()
        .input("CustomerID", sql.Int, customerId)
        .input("CreatedDate", sql.Date, new Date())
        .input("UpdateDate", sql.Date, new Date())
        .query(`
          INSERT INTO Cart (CustomerID_Cart, CreatedDate, UpdateDate)
          OUTPUT INSERTED.CartID
          VALUES(@CustomerID, @CreatedDate, @UpdateDate)
        `);

      cartId = insertCart.recordset[0].CartID;
    } else {
      cartId = cartResult.recordset[0].CartID;
    }

    /* ---- Get price ---- */
    const productResult = await pool.request()
      .input("productId", sql.Int, productId)
      .query(`SELECT ProductPrice, DiscountRate FROM Product WHERE ProductID=@productId`);

    if (productResult.recordset.length === 0)
      return res.status(404).json({ error: "Product not found" });

    const { ProductPrice, DiscountRate } = productResult.recordset[0];

    // ⭐ FIX discount tính sai
    const finalPrice = ProductPrice * (1 - DiscountRate);

    /* ---- Check existing item ---- */
    const itemCheck = await pool.request()
      .input("cartId", sql.Int, cartId)
      .input("productId", sql.Int, productId)
      .query(`
        SELECT * FROM Cart_Item 
        WHERE CartID_Item=@cartId AND ProductID_Item=@productId
      `);

    if (itemCheck.recordset.length === 0) {
      // Insert new item
      await pool.request()
        .input("cartId", sql.Int, cartId)
        .input("productId", sql.Int, productId)
        .input("qty", sql.Int, quantity)
        .input("price", sql.Decimal(18, 2), finalPrice)
        .input("date", sql.Date, new Date())
        .query(`
          INSERT INTO Cart_Item(CartID_Item, ProductID_Item, CartQuantity, PriceAtAddTime, AddedAt)
          VALUES(@cartId, @productId, @qty, @price, @date)
        `);
    } else {
      // Update quantity
      await pool.request()
        .input("cartId", sql.Int, cartId)
        .input("productId", sql.Int, productId)
        .input("qty", sql.Int, quantity)
        .query(`
          UPDATE Cart_Item
          SET CartQuantity = CartQuantity + @qty
          WHERE CartID_Item=@cartId AND ProductID_Item=@productId
        `);
    }

    /* ---- ALWAYS UPDATE CART TOTALS ---- */
    await pool.request()
      .input("cartId", sql.Int, cartId)
      .query(`
        UPDATE Cart
        SET 
            TotalQuantity = ISNULL((SELECT SUM(CartQuantity) FROM Cart_Item WHERE CartID_Item=@cartId), 0),
            TotalAmountCart = ISNULL((SELECT SUM(CartQuantity * PriceAtAddTime) FROM Cart_Item WHERE CartID_Item=@cartId), 0),
            UpdateDate = GETDATE()
        WHERE CartID=@cartId
      `);

    res.json({ message: "Thêm vào giỏ thành công!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ===========================================================
   2) UPDATE QUANTITY
   =========================================================== */
router.post("/update", async (req, res) => {
  const { customerId, productId, quantity } = req.body;

  try {
    const pool = await sql.connect(config);

    const cartResult = await pool.request()
      .input("CustomerID", sql.Int, customerId)
      .query("SELECT CartID FROM Cart WHERE CustomerID_Cart=@CustomerID");

    if (cartResult.recordset.length === 0)
      return res.status(404).json({ error: "Cart not found" });

    const cartId = cartResult.recordset[0].CartID;

    /* ---- Update item quantity ---- */
    await pool.request()
      .input("cartId", sql.Int, cartId)
      .input("productId", sql.Int, productId)
      .input("qty", sql.Int, quantity)
      .query(`
        UPDATE Cart_Item 
        SET CartQuantity = CartQuantity + @qty
        WHERE CartID_Item=@cartId AND ProductID_Item=@productId
      `);

    // delete if <= 0
    await pool.request()
      .input("cartId", sql.Int, cartId)
      .query(`
        DELETE FROM Cart_Item 
        WHERE CartID_Item=@cartId AND CartQuantity <= 0
      `);

    /* ---- ALWAYS UPDATE CART TOTALS ---- */
    await pool.request()
      .input("cartId", sql.Int, cartId)
      .query(`
        UPDATE Cart
        SET 
            TotalQuantity = ISNULL((SELECT SUM(CartQuantity) FROM Cart_Item WHERE CartID_Item=@cartId), 0),
            TotalAmountCart = ISNULL((SELECT SUM(CartQuantity * PriceAtAddTime) FROM Cart_Item WHERE CartID_Item=@cartId), 0),
            UpdateDate = GETDATE()
        WHERE CartID=@cartId
      `);

    res.json({ message: "Cập nhật thành công!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ===========================================================
   3) REMOVE ITEM
   =========================================================== */
router.post("/remove", async (req, res) => {
  const { customerId, productId } = req.body;

  try {
    const pool = await sql.connect(config);

    const cartResult = await pool.request()
      .input("CustomerID", sql.Int, customerId)
      .query("SELECT CartID FROM Cart WHERE CustomerID_Cart=@CustomerID");

    if (cartResult.recordset.length === 0)
      return res.status(404).json({ error: "Cart not found" });

    const cartId = cartResult.recordset[0].CartID;

    // Remove item
    await pool.request()
      .input("cartId", sql.Int, cartId)
      .input("productId", sql.Int, productId)
      .query(`
        DELETE FROM Cart_Item 
        WHERE CartID_Item=@cartId AND ProductID_Item=@productId
      `);

    /* ---- UPDATE TOTALS ---- */
    await pool.request()
      .input("cartId", sql.Int, cartId)
      .query(`
        UPDATE Cart
        SET 
            TotalQuantity = ISNULL((SELECT SUM(CartQuantity) FROM Cart_Item WHERE CartID_Item=@cartId), 0),
            TotalAmountCart = ISNULL((SELECT SUM(CartQuantity * PriceAtAddTime) FROM Cart_Item WHERE CartID_Item=@cartId), 0),
            UpdateDate = GETDATE()
        WHERE CartID=@cartId
      `);

    res.json({ message: "Xóa sản phẩm thành công!" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===========================================================
   4) GET CART ITEMS
   =========================================================== */
router.get("/:customerId", async (req, res) => {
  const customerId = parseInt(req.params.customerId);

  try {
    const pool = await sql.connect(config);

    const cartResult = await pool.request()
      .input("customerId", sql.Int, customerId)
      .query("SELECT CartID FROM Cart WHERE CustomerID_Cart=@customerId");

    if (cartResult.recordset.length === 0) return res.json({ items: [] });

    const cartId = cartResult.recordset[0].CartID;

    const items = await pool.request()
      .input("cartId", sql.Int, cartId)
      .query(`
        SELECT 
          ci.CartQuantity,
          ci.PriceAtAddTime,
          p.ProductName,
          p.ProductID,
          (
            SELECT TOP 1 ImageURLProduct
            FROM Product_Image pi
            JOIN Product_Image_URL url ON pi.ImageID = url.ImageID
            WHERE pi.ProductID = p.ProductID
            ORDER BY pi.ImageID
          ) AS MainImage
        FROM Cart_Item ci
        JOIN Product p ON ci.ProductID_Item = p.ProductID
        WHERE ci.CartID_Item=@cartId
      `);

    res.json({ items: items.recordset });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// THANH TOÁN GIỎ HÀNG
router.post("/checkout", async (req, res) => {
    const { customerId, paymentMethod } = req.body;

    try {
        const pool = await sql.connect(config);

        // Lấy CartID
        const cartResult = await pool.request()
            .input("CustomerID", sql.Int, customerId)
            .query("SELECT CartID FROM Cart WHERE CustomerID_Cart=@CustomerID");

        if (cartResult.recordset.length === 0)
            return res.status(400).json({ error: "Giỏ hàng trống!" });

        const cartId = cartResult.recordset[0].CartID;

        // Lấy Cart_Item
        const items = await pool.request()
            .input("CartID", sql.Int, cartId)
            .query(`SELECT * FROM Cart_Item WHERE CartID_Item=@CartID`);

        if (items.recordset.length === 0)
            return res.status(400).json({ error: "Không có sản phẩm trong giỏ!" });

        const cartItems = items.recordset;

        // Tính tổng tiền
        let total = 0;
        cartItems.forEach(i => {
            total += i.CartQuantity * parseFloat(i.PriceAtAddTime);
        });

        const shippingFee = 30000;
        const finalTotal = total + shippingFee;

        // Tạo Order
        const orderResult = await pool.request()
            .input("Amount", sql.Decimal(18, 2), finalTotal)
            .input("Method", sql.NVarChar, paymentMethod)
            .input("Status", sql.NVarChar, "Completed")
            .input("Date", sql.Date, new Date())
            .input("CustomerID", sql.Int, customerId)
            .query(`
                INSERT INTO [Order] (TotalAmountOrder, PaymentMethod, OrderStatus, OrderDate, CustomerID_Order)
                OUTPUT inserted.OrderID
                VALUES (@Amount, @Method, @Status, @Date, @CustomerID)
            `);

        const orderId = orderResult.recordset[0].OrderID;

        // Thêm Order_Detail
        for (const item of cartItems) {
            await pool.request()
                .input("OrderID", sql.Int, orderId)
                .input("ProductID", sql.Int, item.ProductID_Item)
                .input("Quantity", sql.Int, item.CartQuantity)
                .input("Price", sql.Decimal(18,2), item.PriceAtAddTime)
                .query(`
                    INSERT INTO Order_Detail (OrderID_Detail, ProductID_Detail, OrderQuantity, UnitPrice)
                    VALUES (@OrderID, @ProductID, @Quantity, @Price)
                `);
        }

        // Xóa giỏ hàng
        await pool.request()
            .input("CartID", sql.Int, cartId)
            .query("DELETE FROM Cart_Item WHERE CartID_Item=@CartID");

        await pool.request()
            .input("CartID", sql.Int, cartId)
            .query("DELETE FROM Cart WHERE CartID=@CartID");

        res.json({ message: "Thanh toán thành công!" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


router.post("/clear", async (req, res) => {
  const { customerId } = req.body;
  try {
    const pool = await sql.connect(config);

    const cartResult = await pool.request()
      .input("CustomerID", sql.Int, customerId)
      .query("SELECT CartID FROM Cart WHERE CustomerID_Cart = @CustomerID");

    if (cartResult.recordset.length === 0)
      return res.json({ message: "Giỏ hàng đã rỗng" });

    const cartId = cartResult.recordset[0].CartID;

    await pool.request()
      .input("CartID", sql.Int, cartId)
      .query("DELETE FROM Cart_Item WHERE CartID_Item = @CartID");

    await pool.request()
      .input("CartID", sql.Int, cartId)
      .query("UPDATE Cart SET TotalQuantity = 0, TotalAmountCart = 0 WHERE CartID = @CartID");

    res.json({ message: "Đã xóa giỏ hàng" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
