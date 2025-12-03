const express = require("express");
const router = express.Router();
const sql = require("mssql");
const config = require("../db");
const jwt = require("jsonwebtoken");

// Middleware xác thực JWT
const authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token không hợp lệ!" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token không hợp lệ!" });
  }
};

// Hàm map dữ liệu User → React format (dob + gender + social)
const mapUser = (row) => {
  let social = {};
  try {
    social = row.SocialMedia ? JSON.parse(row.SocialMedia) : {};
  } catch (e) {
    social = {};
  }

  // Format ngày sinh kiểu Việt Nam
  let dobVN = "";
  if (row.Bdate) {
    const date = new Date(row.Bdate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    dobVN = `${day}/${month}/${year}`;
  }

  return {
    id: row.UserID,
    username: row.Username,
    email: row.Email,
    name: row.Name || "",
    phone: row.PhoneNumber,
    dob: dobVN,
    gender: row.Gender || "Khác",
    avatar: row.ProfilePicture,
    description: row.Bio,
    social,
    roles: [
      row.CustomerFlag ? "Customer" : null,
      row.SellerFlag ? "Seller" : null
    ].filter(Boolean),
    accounts: [] // sau này có bảng bank thì thêm
  };
};

// GET /me
router.get("/", authenticate, async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input("id", sql.Int, req.userId)
      .query(`
        SELECT 
          UserID, Username, Email, Name, PhoneNumber, Bdate, Gender,
          ProfilePicture, Bio, SocialMedia, SellerFlag, CustomerFlag
        FROM [User]
        WHERE UserID = @id
      `);

    if (result.recordset.length === 0)
      return res.status(404).json({ error: "User không tồn tại" });

    res.json(mapUser(result.recordset[0]));
  } catch (err) {
    console.error("Lỗi SQL:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /me (Cập nhật và trả lại dữ liệu user mới)
router.put("/", authenticate, async (req, res) => {
  try {
    const {
      username,
      email,
      name,
      phone,
      dob,
      gender,
      avatar,
      description,
      social
    } = req.body;

    const pool = await sql.connect(config);

    // Cập nhật thông tin
    await pool.request()
      .input("id", sql.Int, req.userId)
      .input("Username", sql.NVarChar, username)
      .input("Email", sql.NVarChar, email)
      .input("Name", sql.NVarChar, name || "")
      .input("PhoneNumber", sql.NVarChar, phone)
      .input("Bdate", sql.Date, dob ? new Date(dob.split("/").reverse().join("-")) : null)
      .input("Gender", sql.NVarChar, gender)
      .input("ProfilePicture", sql.NVarChar, avatar)
      .input("Bio", sql.NVarChar, description)
      .input("SocialMedia", sql.NVarChar, JSON.stringify(social || {}))
      .query(`
        UPDATE [User] SET
          Username=@Username,
          Email=@Email,
          Name=@Name,
          PhoneNumber=@PhoneNumber,
          Bdate=@Bdate,
          Gender=@Gender,
          ProfilePicture=@ProfilePicture,
          Bio=@Bio,
          SocialMedia=@SocialMedia
        WHERE UserID=@id
      `);

    // Lấy lại dữ liệu sau khi cập nhật
    const updated = await pool.request()
      .input("id", sql.Int, req.userId)
      .query(`
        SELECT 
          UserID, Username, Email, Name, PhoneNumber, Bdate, Gender,
          ProfilePicture, Bio, SocialMedia, SellerFlag, CustomerFlag
        FROM [User]
        WHERE UserID = @id
      `);

    res.json(mapUser(updated.recordset[0]));
  } catch (err) {
    console.error("Lỗi UPDATE:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
