// frontend/Cart.jsx
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../css/Cart.module.css"; // CSS tự tạo

export default function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const customerId = parseInt(localStorage.getItem("customerID")); // test tạm

  // Lấy giỏ hàng
  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/cart/${customerId}`);
      setCartItems(res.data.items);
    } catch (err) {
      console.error("Lỗi lấy giỏ:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Tính tổng tiền
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.CartQuantity * item.PriceAtAddTime,
    0
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  // Tăng/giảm số lượng
  const updateQuantity = async (productId, change) => {
    try {
      await axios.post("http://localhost:5000/cart/update", {
        customerId,
        productId,
        quantity: change,
      });
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại");
    }
  };

  // Xóa sản phẩm
  const removeItem = async (productId) => {
    try {
      await axios.post("http://localhost:5000/cart/remove", {
        customerId,
        productId,
      });
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Giỏ hàng</h2>
      {cartItems.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <>
          <table className={styles.cartTable}>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Hình ảnh</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.ProductID}>
                  <td>{item.ProductName}</td>
                  <td>
                    <img src={item.ProductImage || "/no-image.jpg"} alt={item.ProductName} className={styles.img} />
                  </td>
                  <td>{formatPrice(item.PriceAtAddTime)}</td>
                  <td>
                    <button onClick={() => updateQuantity(item.ProductID, -1)}>-</button>
                    <span className={styles.quantity}>{item.CartQuantity}</span>
                    <button onClick={() => updateQuantity(item.ProductID, 1)}>+</button>
                  </td>
                  <td>{formatPrice(item.CartQuantity * item.PriceAtAddTime)}</td>
                  <td>
                    <button className={styles.removeBtn} onClick={() => removeItem(item.ProductID)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Tổng tiền: {formatPrice(totalAmount)}</h3>
        </>
      )}
      <button className={styles.payBtn} onClick={() => navigate("/checkout")}>
  Thanh toán
</button>

    </div>
  );
}
