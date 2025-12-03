import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [searchText, setSearchText] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    // Lấy avatar từ localStorage
    const savedAvatar = localStorage.getItem("avatar");

    if (savedAvatar && savedAvatar !== "undefined") {
      setAvatar(savedAvatar);
    } else {
      setAvatar("https://cdn-icons-png.flaticon.com/512/1077/1077114.png");
    }

    // Lắng nghe thay đổi từ Profile
    window.addEventListener("avatar-updated", () => {
      const newAvt = localStorage.getItem("avatar");
      setAvatar(newAvt);
    });
  }, []);

  const handleSearch = () => {
    alert("Tìm kiếm: " + searchText);
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link to="/home">Suppee</Link>
      </div>

      {/* Search bar */}
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button onClick={handleSearch}>🔍</button>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {/* Cart icon */}
        <div className={styles.cart}>
          <Link to="/cart">
            <span className={styles.cartIcon}>🛒</span>
          </Link>
        </div>

        {/* Avatar */}
        <div className={styles.profile}>
          <Link to="/profile">
            <img
              src={avatar}
              alt="profile"
              className={styles.avatar}
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}

