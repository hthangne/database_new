const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const meRoutes = require("./routes/me");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const storeRoutes = require("./routes/store");
const uploadRoutes = require("./routes/upload");
const checkoutRoutes = require("./routes/checkout");
const db = require("./db")

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route kiểm tra backend
app.get("/", (req, res) => {
    res.send("Backend đang chạy OK!");
});

// Auth routes
app.use("/auth", authRoutes);
app.use("/me", meRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/store", storeRoutes);
app.use("/upload", uploadRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/checkout", checkoutRoutes);


app.listen(5000, () => {
    console.log("Server chạy tại http://localhost:5000");
});





// const express = require('express');
// const sql = require('mssql');
// const cors = require('cors');
// const { options } = require('./db');
// // const { password, server, database, options } = require('./db');

// const app = express();
// app.use(cors());
// const config={
//     user: "tks",
//     password: "1234",
//     server: "LAPTOP-4RQOJLUA\\SQLEXPRESS",
//     database: "EcommerceDB",
//     options:{
//         encrypt: false,
//     trustServerCertificate: true
//     }
// }

// app.get('/Shipping', async(req, res) => {
//     try
//     {
//         const pool = await sql.connect(config);
//         const data = pool.request().query('select * from Shipping');
//         data.then(res1 => {
//             return res.json(res1);
//     })
//     }
//     catch(err)
//     {
//         console.log(err);
//     }
    
// })


// app.listen(5000, () => {
//     console.log("Server đang chạy tại http://localhost:5000");
// });