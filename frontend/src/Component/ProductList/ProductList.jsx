import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./ProductList.module.css";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const customerId = parseInt(localStorage.getItem("customerID"));

  // Load products
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("http://localhost:5000/products");
        const fav = await axios.get(`http://localhost:5000/wishlist/${customerId}`);

        // ⭐ Thêm trường isFavorite vào từng sản phẩm
        const favIds = new Set(fav.data.map((i) => i.ProductID));
        const merged = res.data.map((p) => ({
          ...p,
          isFavorite: favIds.has(p.ProductID),
        }));

        setProducts(merged);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  // Format tiền
  const formatPrice = (p) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p);

  // Thêm giỏ hàng
  const handleAddToCart = async (productId) => {
    try {
      await axios.post("http://localhost:5000/cart/add", {
        customerId,
        productId,
        quantity: 1,
      });
      alert("Đã thêm vào giỏ!");
    } catch (err) {
      alert("Lỗi thêm giỏ");
    }
  };

  // Toggle yêu thích
  const handleToggleFavorite = async (product) => {
    try {
      if (product.isFavorite) {
        await axios.post("http://localhost:5000/wishlist/remove", {
          customerId,
          productId: product.ProductID,
        });
      } else {
        await axios.post("http://localhost:5000/wishlist/add", {
          customerId,
          productId: product.ProductID,
        });
      }

      // Cập nhật UI ngay lập tức
      setProducts((prev) =>
        prev.map((p) =>
          p.ProductID === product.ProductID
            ? { ...p, isFavorite: !p.isFavorite }
            : p
        )
      );
    } catch (err) {
      alert("Lỗi cập nhật yêu thích");
    }
  };

  return (
    <div className={styles.grid}>
      {products.map((p) => {
        const finalPrice = p.ProductPrice * (1 - p.DiscountRate);

        return (
          <div className={styles.card} key={p.ProductID}>
            {/* Image */}
            <div className={styles.imgWrapper}>
                <img
                      src={
                        p.ImageURL?.startsWith("img/")
                          ? `/${p.ImageURL}`                           
                          : `http://localhost:5000/${p.ImageURL}`      
                      }
                      alt={p.ProductName}
                      className={styles.img}
                      onError={(e) => (e.target.src = "/no-image.jpg")} />
              {p.DiscountRate > 0 && (
                <span className={styles.discountBadge}>
                  -{Math.round(p.DiscountRate * 100)}%
                </span>
              )}

              {/* ❤️ Favorite Button */}
              <button
                className={`${styles.heartBtn} ${
                  p.isFavorite ? styles.activeHeart : ""
                }`}
                onClick={() => handleToggleFavorite(p)}
              >
                ❤
              </button>
            </div>

            {/* Info */}
            <div className={styles.info}>
              <h3>{p.ProductName}</h3>

              <div className={styles.priceRow}>
                <span className={styles.finalPrice}>{formatPrice(finalPrice)}</span>

                {p.DiscountRate > 0 && (
                  <span className={styles.originalPrice}>
                    {formatPrice(p.ProductPrice)}
                  </span>
                )}
              </div>

              <p className={styles.stock}>Kho: {p.StockQuantity}</p>
            </div>

            {/* Buttons */}
            <button
              className={styles.cartBtn}
              onClick={() => handleAddToCart(p.ProductID)}
              disabled={p.StockQuantity === 0}
            >
              🛒 Thêm vào giỏ
            </button>
          </div>
        );
      })}
    </div>
  );
}
