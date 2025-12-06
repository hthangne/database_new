const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Tạo thư mục uploads nếu chưa có
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Cấu hình lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ROUTE upload ảnh
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Không có file!" });
  }

  const relativePath = `uploads/${req.file.filename}`;

  res.json({
    message: "Upload thành công!",
    imageUrl: `http://localhost:5000/${relativePath}`, // 🔥 frontend dùng field này
    relativePath: relativePath
  });
});

module.exports = router;
