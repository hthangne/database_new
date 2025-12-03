


    // const express = require("express");
    // const router = express.Router();
    // const sql = require("mssql");
    // const bcrypt = require("bcrypt");
    // const jwt = require("jsonwebtoken");
    // const config = require("../db");

    // // REGISTER
    // router.post("/register", async (req, res) => {
    //     const { username, password, email } = req.body;

    //     // 🌟 Cải thiện: Kiểm tra đầu vào
    //     if (!username || !password || !email) {
    //         return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ tên người dùng và mật khẩu." });
    //     }
        
    //     try {
    //         const pool = await sql.connect(config);

    //         // kiểm tra có tồn tại
    //         const check = await pool.request()
    //             .input("username", sql.VarChar, username)
    //             .query("SELECT * FROM [User] WHERE username = @username");

    //         if (check.recordset.length > 0) {
    //             return res.status(400).json({ error: "Username đã tồn tại!" });
    //         }

    //         // const hashed = await bcrypt.hash(password, 10);
    //         const hashed = password; // lưu y chang mật khẩu người dùng nhập

    //         await pool.request()
    //             .input("username", sql.NVarChar, username)
    //             .input("email", sql.NVarChar, email)
    //             .input("password", sql.NVarChar, password)
                
    //             .query("INSERT INTO [User] (username, email, password) VALUES (@username, @email, @password)");

    //         res.json({ message: "Đăng ký thành công!" });

    //     } catch (err) {
    //         res.status(500).json({ error: err.message });
    //     }
    // });

    // // LOGIN
    // router.post("/login", async (req, res) => {
    //     const { username, password } = req.body;
    //     // 🌟 Cải thiện: Kiểm tra đầu vào
    //     if (!username || !password) {
    //         return res.status(400).json({ error: "Vui lòng cung cấp đầy đủ tên người dùng và mật khẩu." });
    //     }

    //     try {
    //         const pool = await sql.connect(config);

    //         const result = await pool.request()
    //             .input("username", sql.VarChar, username.trim())
    //             .query("SELECT UserID, username, password, CustomerFlag FROM [User] WHERE username = @username"); // 💡 Tốt nhất nên chỉ chọn các trường cần thiết

    //         if (result.recordset.length === 0) {
    //             return res.status(400).json({ error: "User không tồn tại!" });
    //         }

    //         const user = result.recordset[0];

    //         // 🌟 Cải thiện: Đảm bảo user.password có giá trị trước khi so sánh
    //         if (!user.password) {
    //              // Lỗi này cho thấy dữ liệu CSDL bị hỏng (mật khẩu là null/undefined)
    //              console.error(`User ${username} does not have a stored password.`);
    //              return res.status(500).json({ error: "Lỗi hệ thống: Mật khẩu không hợp lệ." });
    //         }

    //         if (password.trim() !== user.password.trim()) {
    //             return res.status(400).json({ error: "Sai mật khẩu!" });
    //         }


    //         const token = jwt.sign(
    //             { id: user.UserID, username: user.username },
    //             "secretkey", // ⚠️ LƯU Ý: Khóa bí mật (secretkey) này nên được đặt trong biến môi trường!
    //             { expiresIn: "1h" }
    //         );

    //         res.json({ message: "Đăng nhập thành công!", 
    //                     token,
    //                     user: {
    //                         id: user.UserID,
    //                         username: user.username,
    //                         isCustomer: user.CustomerFlag
    //                     } });

    //     } catch (err) {
    //         // Trong trường hợp bcrypt.compare() vẫn lỗi (data/hash là kiểu không hợp lệ), nó sẽ rơi vào đây.
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
        const { username, password, email, isCustomer = 1, isSeller = 0 } = req.body;

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

            // Nếu user là customer → tự tạo bản ghi Customer (rất quan trọng)
            if (isCustomer === 1) {
                await pool.request()
                    .input("CustomerID", sql.Int, newUserID)
                    .query(`
                        INSERT INTO Customer (CustomerID, TotalOrders, MemberLevel, RewardPoint)
                        VALUES (@CustomerID, 0, 'Bronze', 0)
                    `);
            }

            // Nếu user là seller → tạo bảng Seller
            if (isSeller === 1) {
                await pool.request()
                    .input("SellerID", sql.Int, newUserID)
                    .query(`
                        INSERT INTO Seller (SellerID, SellerStatus)
                        VALUES (@SellerID, 'Active')
                    `);
            }

            res.json({ message: "Đăng ký thành công!", userID: newUserID });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });


    // =========================== LOGIN =============================
    router.post("/login", async (req, res) => {
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

            const token = jwt.sign(
                { id: user.UserID, username: user.Username },
                "secretkey",
                { expiresIn: "1h" }
            );

            res.json({
                message: "Đăng nhập thành công!",
                token,
                user: {
                    id: user.UserID,
                    username: user.Username,
                    isCustomer: user.CustomerFlag,
                    isSeller: user.SellerFlag
                    
                }
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });


    module.exports = router;
