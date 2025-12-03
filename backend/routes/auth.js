    // const express = require("express");
    // const router = express.Router();
    // const sql = require("mssql");
    // const jwt = require("jsonwebtoken");
    // const config = require("../db");


    // // ========================== REGISTER ==========================
    // router.post("/register", async (req, res) => {
    //     const { username, password, email, isCustomer = 1, isSeller = 0 } = req.body;

    //     if (!username || !password || !email) {
    //         return res.status(400).json({ error: "Vui lòng nhập đầy đủ username, password, email." });
    //     }

    //     try {
    //         const pool = await sql.connect(config);

    //         // Check username tồn tại
    //         const check = await pool.request()
    //             .input("username", sql.VarChar, username)
    //             .query("SELECT * FROM [User] WHERE Username = @username");

    //         if (check.recordset.length > 0) {
    //             return res.status(400).json({ error: "Username đã tồn tại!" });
    //         }

    //         // Tạo User
    //         const insertUser = await pool.request()
    //             .input("username", sql.NVarChar, username)
    //             .input("email", sql.NVarChar, email)
    //             .input("password", sql.NVarChar, password)
    //             .input("SellerFlag", sql.Bit, isSeller)
    //             .input("CustomerFlag", sql.Bit, isCustomer)
    //             .query(`
    //                 INSERT INTO [User] (Username, Email, Password, SellerFlag, CustomerFlag)
    //                 OUTPUT INSERTED.UserID
    //                 VALUES (@username, @email, @password, @SellerFlag, @CustomerFlag)
    //             `);

    //         const newUserID = insertUser.recordset[0].UserID;

    //         // Nếu user là customer → tự tạo bản ghi Customer (rất quan trọng)
    //         if (isCustomer === 1) {
    //             await pool.request()
    //                 .input("CustomerID", sql.Int, newUserID)
    //                 .query(`
    //                     INSERT INTO Customer (CustomerID, TotalOrders, MemberLevel, RewardPoint)
    //                     VALUES (@CustomerID, 0, 'Bronze', 0)
    //                 `);
    //         }

    //         // Nếu user là seller → tạo bảng Seller
    //         if (isSeller === 1) {
    //             await pool.request()
    //                 .input("SellerID", sql.Int, newUserID)
    //                 .query(`
    //                     INSERT INTO Seller (SellerID, SellerStatus)
    //                     VALUES (@SellerID, 'Active')
    //                 `);
    //         }

    //         res.json({ message: "Đăng ký thành công!", userID: newUserID });

    //     } catch (err) {
    //         console.error(err);
    //         res.status(500).json({ error: err.message });
    //     }
    // });


    // // =========================== LOGIN =============================
    // router.post("/login", async (req, res) => {
    //     const { username, password } = req.body;

    //     if (!username || !password) {
    //         return res.status(400).json({ error: "Vui lòng nhập username và password." });
    //     }

    //     try {
    //         const pool = await sql.connect(config);

    //         const result = await pool.request()
    //             .input("username", sql.VarChar, username.trim())
    //             .query(`
    //                 SELECT UserID, Username, Password, CustomerFlag, SellerFlag
    //                 FROM [User]
    //                 WHERE Username = @username
    //             `);

    //         if (result.recordset.length === 0) {
    //             return res.status(400).json({ error: "User không tồn tại!" });
    //         }

    //         const user = result.recordset[0];

    //         if (password.trim() !== user.Password.trim()) {
    //             return res.status(400).json({ error: "Sai mật khẩu!" });
    //         }

    //         const token = jwt.sign(
    //             { id: user.UserID, username: user.Username },
    //             "secretkey",
    //             { expiresIn: "1h" }
    //         );

    //         res.json({
    //             message: "Đăng nhập thành công!",
    //             token,
    //             user: {
    //                 id: user.UserID,
    //                 username: user.Username,
    //                 isCustomer: user.CustomerFlag,
    //                 isSeller: user.SellerFlag
                    
    //             }
    //         });

    //     } catch (err) {
    //         console.error(err);
    //         res.status(500).json({ error: err.message });
    //     }
    // });


    // module.exports = router;



    const express = require("express");
const router = express.Router();
const sql = require("mssql");
const jwt = require("jsonwebtoken");
const config = require("../db");


// ========================== REGISTER ==========================
router.post("/register", async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ error: "Vui lòng nhập đầy đủ username, password, email." });
    }

    try {
        const pool = await sql.connect(config);

        // Check username tồn tại
        const check = await pool.request()
            .input("username", sql.VarChar, username)
            .query("SELECT * FROM [User] WHERE Username = @username");

        if (check.recordset.length > 0) {
            return res.status(400).json({ error: "Username đã tồn tại!" });
        }

        // Luôn đặt role = 1 cho tất cả user
        const isCustomer = 1;
        const isSeller = 1;

        // Tạo User
        const insertUser = await pool.request()
            .input("username", sql.NVarChar, username)
            .input("email", sql.NVarChar, email)
            .input("password", sql.NVarChar, password)
            .input("SellerFlag", sql.Bit, isSeller)
            .input("CustomerFlag", sql.Bit, isCustomer)
            .query(`
                INSERT INTO [User] (Username, Email, Password, SellerFlag, CustomerFlag)
                OUTPUT INSERTED.UserID
                VALUES (@username, @email, @password, @SellerFlag, @CustomerFlag)
            `);

        const newUserID = insertUser.recordset[0].UserID;

        // Tạo Customer record
        await pool.request()
            .input("CustomerID", sql.Int, newUserID)
            .query(`
                INSERT INTO Customer (CustomerID, TotalOrders, MemberLevel, RewardPoint)
                VALUES (@CustomerID, 0, 'Bronze', 0)
            `);

        // Tạo Seller record
        await pool.request()
            .input("SellerID", sql.Int, newUserID)
            .query(`
                INSERT INTO Seller (SellerID, SellerStatus)
                VALUES (@SellerID, 'Active')
            `);

        res.json({ message: "Đăng ký thành công!", userID: newUserID });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


// =========================== LOGIN =============================
router.post("/login", async (req, res) => {
    // const { username, password } = req.body;

    // if (!username || !password) {
    //     return res.status(400).json({ error: "Vui lòng nhập username và password." });
    // }

    // try {
    //     const pool = await sql.connect(config);

    //     const result = await pool.request()
    //         .input("username", sql.VarChar, username.trim())
    //         .query(`
    //             SELECT UserID, Username, Password, CustomerFlag, SellerFlag
    //             FROM [User]
    //             WHERE Username = @username
    //         `);

    //     if (result.recordset.length === 0) {
    //         return res.status(400).json({ error: "User không tồn tại!" });
    //     }

    //     const user = result.recordset[0];

    //     if (password.trim() !== user.Password.trim()) {
    //         return res.status(400).json({ error: "Sai mật khẩu!" });
    //     }

    //     const userId = user.UserID;

    //     // 🔥 TỰ ĐỘNG TẠO CUSTOMER CHO USER CŨ (nếu chưa có)
    //     const checkCustomer = await pool.request()
    //         .input("id", sql.Int, userId)
    //         .query("SELECT * FROM Customer WHERE CustomerID = @id");

    //     if (checkCustomer.recordset.length === 0) {
    //         await pool.request()
    //             .input("id", sql.Int, userId)
    //             .query(`
    //                 INSERT INTO Customer(CustomerID, TotalOrders, MemberLevel, RewardPoint)
    //                 VALUES(@id, 0, 'Bronze', 0)
    //             `);
    //     }

    //     // 🔥 TỰ ĐỘNG TẠO SELLER CHO USER CŨ (nếu chưa có)
    //     const checkSeller = await pool.request()
    //         .input("id", sql.Int, userId)
    //         .query("SELECT * FROM Seller WHERE SellerID = @id");

    //     if (checkSeller.recordset.length === 0) {
    //         await pool.request()
    //             .input("id", sql.Int, userId)
    //             .query(`
    //                 INSERT INTO Seller(SellerID, SellerStatus)
    //                 VALUES(@id, 'Active')
    //             `);
    //     }

    //     // Luôn trả về role = 1
    //     const token = jwt.sign(
    //         { id: userId, username: user.Username },
    //         "secretkey",
    //         { expiresIn: "1h" }
    //     );

    //     res.json({
    //         message: "Đăng nhập thành công!",
    //         token,
    //         user: {
    //             id: userId,
    //             username: user.Username,
    //             isCustomer: 1,
    //             isSeller: 1
    //         }
    //     });

    // } catch (err) {
    //     console.error(err);
    //     res.status(500).json({ error: err.message });
    // }



    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Vui lòng nhập username và password." });
    }

    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input("username", sql.VarChar, username.trim())
            .query(`
                SELECT UserID, Username, Password, CustomerFlag, SellerFlag
                FROM [User]
                WHERE Username = @username
            `);

        if (result.recordset.length === 0) {
            return res.status(400).json({ error: "User không tồn tại!" });
        }

        const user = result.recordset[0];

        if (password.trim() !== user.Password.trim()) {
            return res.status(400).json({ error: "Sai mật khẩu!" });
        }

        const userId = user.UserID;

        // 🔥 AUTO UPDATE role cho user cũ
        await pool.request()
            .input("id", sql.Int, userId)
            .query(`
                UPDATE [User]
                SET SellerFlag = 1, CustomerFlag = 1
                WHERE UserID = @id
            `);

        // 🔥 Tự tạo Customer record nếu chưa có
        const checkCustomer = await pool.request()
            .input("id", sql.Int, userId)
            .query("SELECT * FROM Customer WHERE CustomerID = @id");

        if (checkCustomer.recordset.length === 0) {
            await pool.request()
                .input("id", sql.Int, userId)
                .query(`
                    INSERT INTO Customer(CustomerID, TotalOrders, MemberLevel, RewardPoint)
                    VALUES(@id, 0, 'Bronze', 0)
                `);
        }

        // 🔥 Tự tạo Seller record nếu chưa có
        const checkSeller = await pool.request()
            .input("id", sql.Int, userId)
            .query("SELECT * FROM Seller WHERE SellerID = @id");

        if (checkSeller.recordset.length === 0) {
            await pool.request()
                .input("id", sql.Int, userId)
                .query(`
                    INSERT INTO Seller(SellerID, SellerStatus)
                    VALUES(@id, 'Active')
                `);
        }

        const token = jwt.sign(
            { id: userId, username: user.Username },
            "secretkey",
            { expiresIn: "1h" }
        );

        // Trả về luôn trạng thái mới
        res.json({
            message: "Đăng nhập thành công!",
            token,
            user: {
                id: userId,
                username: user.Username,
                isCustomer: 1,
                isSeller: 1
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
