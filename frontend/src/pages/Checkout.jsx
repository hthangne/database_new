// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import styles from "../css/Checkout.module.css";

// export default function Checkout() {
//   const [cartItems, setCartItems] = useState([]);
//   const [paymentMethod, setPaymentMethod] = useState("Thẻ ngân hàng");
//   const navigate = useNavigate();
//   const customerId = parseInt(localStorage.getItem("customerID"));

//   const fetchCart = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/cart/${customerId}`);
//       setCartItems(res.data.items);
//     } catch (err) {
//       console.error("Lỗi lấy giỏ:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   const formatPrice = (price) =>
//     new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);

//   const shipFee = 30000;

//   const cartTotal = cartItems.reduce(
//     (sum, i) => sum + i.CartQuantity * i.PriceAtAddTime,
//     0
//   );

//   const finalTotal = cartTotal + shipFee;

//   // Xử lý thanh toán
//   const handlePayment = async () => {
//     try {
//       await axios.post("http://localhost:5000/cart/clear", { customerId });

//       alert("Thanh toán thành công!");
//       navigate("/home");
//     } catch (err) {
//       alert("Thanh toán thất bại!");
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h2>Thanh toán</h2>

//       {/* Bảng sản phẩm */}
//       <table className={styles.table}>
//         <thead>
//           <tr>
//             <th>Sản phẩm</th>
//             <th>Giá</th>
//             <th>Số lượng</th>
//             <th>Tổng</th>
//           </tr>
//         </thead>

//         <tbody>
//           {cartItems.map((item) => (
//             <tr key={item.ProductID}>
//               <td>{item.ProductName}</td>
//               <td>{formatPrice(item.PriceAtAddTime)}</td>
//               <td>{item.CartQuantity}</td>
//               <td>{formatPrice(item.PriceAtAddTime * item.CartQuantity)}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <p className={styles.ship}>Phí ship: {formatPrice(shipFee)}</p>

//       <h3>Tổng thanh toán: {formatPrice(finalTotal)}</h3>

//       <label>
//         Phương thức thanh toán:
//         <select
//           value={paymentMethod}
//           onChange={(e) => setPaymentMethod(e.target.value)}
//         >
//           <option>Thẻ ngân hàng</option>
//           <option>Tiền mặt</option>
//           <option>Ví điện tử</option>
//         </select>
//       </label>

//       <button className={styles.payBtn} onClick={handlePayment}>
//         Thanh toán ngay
//       </button>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../css/Checkout.module.css";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Thẻ ngân hàng");
  const navigate = useNavigate();
  const customerId = parseInt(localStorage.getItem("customerID"));

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

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const shipFee = 30000;

  const cartTotal = cartItems.reduce(
    (sum, i) => sum + i.CartQuantity * i.PriceAtAddTime,
    0
  );

  const finalTotal = cartTotal + shipFee;

  // ==============================
  // XỬ LÝ THANH TOÁN
  // ==============================
  const handlePayment = async () => {
    try {
      await axios.post("http://localhost:5000/cart/checkout", {
        customerId,
        items: cartItems.map((item) => ({
          productId: item.ProductID,
          quantity: item.CartQuantity,
        })),
      });

      alert("Thanh toán thành công!");

      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Thanh toán thất bại!");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Thanh toán</h2>

      {/* Bảng sản phẩm */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Tổng</th>
          </tr>
        </thead>

        <tbody>
          {cartItems.map((item) => (
            <tr key={item.ProductID}>
              <td>{item.ProductName}</td>
              <td>{formatPrice(item.PriceAtAddTime)}</td>
              <td>{item.CartQuantity}</td>
              <td>{formatPrice(item.PriceAtAddTime * item.CartQuantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className={styles.ship}>Phí ship: {formatPrice(shipFee)}</p>

      <h3>Tổng thanh toán: {formatPrice(finalTotal)}</h3>

      <label>
        Phương thức thanh toán:
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option>Thẻ ngân hàng</option>
          <option>Tiền mặt</option>
          <option>Ví điện tử</option>
        </select>
      </label>

      <button className={styles.payBtn} onClick={handlePayment}>
        Thanh toán ngay
      </button>
    </div>
  );
}
