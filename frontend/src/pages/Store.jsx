import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../css/Store.module.css";

export default function Store() {
  const sellerId = parseInt(localStorage.getItem("sellerID"));

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    discount: 0,
    status: "Available",
    imageURL: ""
  });

  // ==========================
  // LOAD PRODUCT LIST
  // ==========================
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/store/${sellerId}`);
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
    }
  };

  useEffect(() => {
    if (sellerId) fetchProducts();
  }, [sellerId]);

  // ==========================
  // ADD PRODUCT
  // ==========================
  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/store/add", {
        sellerId,
        ...form,
      });

      alert("Đã thêm sản phẩm!");
      fetchProducts();

      setForm({
        name: "",
        price: "",
        stock: "",
        discount: 0,
        status: "Available",
        imageURL: ""
      });
    } catch (err) {
      console.error(err);
      alert("Thêm sản phẩm thất bại!");
    }
  };

  // ==========================
  // DELETE PRODUCT
  // ==========================
  const deleteProduct = async (productId) => {
    if (!window.confirm("Bạn chắc muốn xóa sản phẩm này?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/store/delete/${productId}`
      );

      alert("Xóa thành công!");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại!");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Quản lý cửa hàng</h2>

      {/* Upload form */}
      <div className={styles.uploadBox}>
        <h3>Thêm sản phẩm mới</h3>
        <form onSubmit={handleUpload} className={styles.form}>
          
          <input
            type="text"
            placeholder="Tên sản phẩm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Giá"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Số lượng"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Giảm giá (0 - 1)"
            value={form.discount}
            onChange={(e) =>
              setForm({ ...form, discount: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Image URL"
            value={form.imageURL}
            onChange={(e) => setForm({ ...form, imageURL: e.target.value })}
            required
          />

          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="Available">Available</option>
            <option value="OutOfStock">Out of Stock</option>
          </select>

          <button type="submit" className={styles.addBtn}>
            Thêm sản phẩm
          </button>
        </form>
      </div>

      {/* Product list */}
      <h3>Sản phẩm của cửa hàng</h3>

      <div className={styles.grid}>
        {products.length === 0 && <p>Chưa có sản phẩm nào.</p>}

        {products.map((p) => (
          <div className={styles.card} key={p.ProductID}>
            <img
              src={p.ImageURL || "/no-image.jpg"}
              alt="img"
              className={styles.img}
            />

            <h4>{p.ProductName}</h4>

            <p className={styles.price}>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(p.ProductPrice)}
            </p>

            <p>Kho: {p.StockQuantity}</p>
            <p>Giảm giá: {p.DiscountRate * 100}%</p>

            <button
              className={styles.deleteBtn}
              onClick={() => deleteProduct(p.ProductID)}
            >
              Xóa
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
