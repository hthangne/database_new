const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Tạo folder uploads nếu chưa có
const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Cấu hình nơi lưu file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // thư mục lưu ảnh
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname)); // tên file mới
  }
});

const upload = multer({ storage });

// ROUTE upload ảnh
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Không có file!" });
  }

  // Đường dẫn truy cập ảnh từ frontend
  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  res.json({
    message: "Upload thành công!",
    imageUrl
  });
});

module.exports = router;
