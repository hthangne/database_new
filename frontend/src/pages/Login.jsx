import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../css/Login.module.css";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        username: username.trim(),
        password: password.trim(),
      });

      const user = res.data.user;

      // Đánh dấu đã login
      setIsLoggedIn(true);

      // Lưu token
      localStorage.setItem("token", res.data.token);

      // Lưu thông tin user
      localStorage.setItem("userID", user.id);
      localStorage.setItem("username", user.username);

      // ----- TỪ BÂY GIỜ: Mọi user đều là customer + seller -----
      localStorage.setItem("isCustomer", "1");
      localStorage.setItem("isSeller", "1");
      localStorage.setItem("customerID", user.id);
      localStorage.setItem("sellerID", user.id);

      alert("Đăng nhập thành công!");
      navigate("/home");

    } catch (err) {
      console.log(err);
      setError("Sai username hoặc mật khẩu!");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2>Đăng nhập</h2>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.loginButton}>
            Đăng nhập
          </button>
        </form>

        <p className={styles.switchText}>
          Chưa có tài khoản?{" "}
          <span className={styles.link} onClick={() => navigate("/register")}>
            Đăng ký
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
