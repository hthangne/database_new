  import { useEffect, useState } from "react";
  import axios from "axios";
  import styles from "./ProductList.module.css"; // CSS tự tạo bên dưới

  export default function ProductList() {
    const [products, setProducts] = useState([]);

    // Lấy sản phẩm từ backend
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const res = await axios.get("http://localhost:5000/products");
          setProducts(res.data);
        } catch (err) {
          console.error("Lỗi lấy sản phẩm:", err);
        }
      };
      fetchProducts();
    }, []);

    // Format giá tiền
    const formatPrice = (price) =>
      new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

    // Thêm vào giỏ
    const handleAddToCart = async (productId) => {
      try {
        const customerId = parseInt(localStorage.getItem("customerID")); // test tạm
        await axios.post("http://localhost:5000/cart/add", {
          customerId,
          productId,
          quantity: 1,
        });
        alert("Đã thêm sản phẩm vào giỏ!");
      } catch (err) {
        console.error(err);
        alert("Thêm vào giỏ thất bại!");
      }
    };

    // Thêm vào yêu thích (tạm)
    const handleAddToFavorite = (productName) => {
      alert(`Đã thêm ${productName} vào yêu thích`);
    };

    return (
      <div className={styles.container}>
        {products.length === 0 ? (
          <p>Không có sản phẩm nào.</p>
        ) : (
          products.map((p) => {
            const discountedPrice = p.ProductPrice * (1 - p.DiscountRate / 100);
            return (
              <div className={styles.card} key={p.ProductID}>
                <div className={styles.imageContainer}>
                  <img src={p.ProductImage || "/no-image.jpg"} alt={p.ProductName} />
                  {p.DiscountRate > 0 && (
                    <div className={styles.discount}>-{Math.round(p.DiscountRate * 100)}%</div>
                  )}
                </div>

                <h3>{p.ProductName}</h3>

                <p className={styles.price}>
                  {formatPrice(discountedPrice)}
                  {p.DiscountRate > 0 && (
                    <span className={styles.originalPrice}>{formatPrice(p.ProductPrice)}</span>
                  )}
                </p>

                <p>Đánh giá: {p.AverageReview}</p>
                <p>Kho: {p.StockQuantity}</p>

                <div className={styles.buttons}>
                  <button
                    className={styles.addToCart}
                    onClick={() => handleAddToCart(p.ProductID)}
                    disabled={p.StockQuantity === 0}
                  >
                    🛒 Thêm vào giỏ
                  </button>
                  <button className={styles.favorite} onClick={() => handleAddToFavorite(p.ProductName)}>
                    ♥ Yêu thích
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  }
