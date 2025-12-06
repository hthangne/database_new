// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import styles from "./Navbar.module.css";

// export default function Navbar() {
//   const [searchText, setSearchText] = useState("");
//   const [avatar, setAvatar] = useState("");

//   useEffect(() => {
//     // Lấy avatar từ localStorage
//     const savedAvatar = localStorage.getItem("avatar");

//     if (savedAvatar && savedAvatar !== "undefined") {
//       setAvatar(savedAvatar);
//     } else {
//       setAvatar("https://cdn-icons-png.flaticon.com/512/1077/1077114.png");
//     }

//     // Lắng nghe thay đổi từ Profile
//     window.addEventListener("avatar-updated", () => {
//       const newAvt = localStorage.getItem("avatar");
//       setAvatar(newAvt);
//     });
//   }, []);

//   const handleSearch = () => {
//     alert("Tìm kiếm: " + searchText);
//   };

//   return (
//     <nav className={styles.navbar}>
//       {/* Logo */}
//       <div className={styles.logo}>
//         <Link to="/home">Suppee</Link>
//       </div>

//       {/* Search bar */}
//       <div className={styles.searchBox}>
//         <input
//           type="text"
//           placeholder="Tìm sản phẩm..."
//           value={searchText}
//           onChange={(e) => setSearchText(e.target.value)}
//         />
//         <button onClick={handleSearch}>🔍</button>
//       </div>

//       {/* Actions */}
//       <div className={styles.actions}>
//         {/* Cart icon */}
//         <div className={styles.cart}>
//           <Link to="/cart">
//             <span className={styles.cartIcon}>🛒</span>
//           </Link>
//         </div>

//         {/* Avatar */}
//         <div className={styles.profile}>
//           <Link to="/profile">
//             <img
//               src={avatar}
//               alt="profile"
//               className={styles.avatar}
//             />
//           </Link>
//         <div className={styles.cart}>
//   <Link to="/wishlist">💖</Link>
// </div>
//         </div>
//       </div>
//     </nav>
//   );
// }



import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const DEFAULT_AVATAR =
    "https://cdn-icons-png.flaticon.com/512/1077/1077114.png";

  // Lấy avatar ngay từ đầu, tránh render src=""
  const initialAvatar = (() => {
    const saved = localStorage.getItem("avatar");
    if (saved && saved !== "undefined" && saved.trim() !== "") return saved;
    return DEFAULT_AVATAR;
  })();

  const [searchText, setSearchText] = useState("");
  const [avatar, setAvatar] = useState(initialAvatar);

  useEffect(() => {
    // Khi Profile update avatar → cập nhật Navbar
    const handleAvatarUpdate = () => {
      const newAvt = localStorage.getItem("avatar");
      if (newAvt && newAvt !== "undefined" && newAvt.trim() !== "") {
        setAvatar(newAvt);
      } else {
        setAvatar(DEFAULT_AVATAR);
      }
    };

    window.addEventListener("avatar-updated", handleAvatarUpdate);

    return () => {
      window.removeEventListener("avatar-updated", handleAvatarUpdate);
    };
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
        {/* Cart */}
        <div className={styles.cart}>
          <Link to="/cart">
            <span className={styles.cartIcon}>🛒</span>
          </Link>
        </div>

        {/* Wishlist */}
        <div className={styles.cart}>
          <Link to="/wishlist">💖</Link>
        </div>

        {/* Avatar */}
        <div className={styles.profile}>
          <Link to="/profile">
            <img
              src={avatar || DEFAULT_AVATAR}
              alt="profile"
              className={styles.avatar}
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
