// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import styles from "../css/Login.module.css";

// function Register() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");  // Email
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (password !== confirmPassword) {
//       setError("Mật khẩu nhập lại không khớp!");
//       return;
//     }

//     try {
//       await axios.post("http://localhost:5000/auth/register", {
//         username,
//         email,
//         password,
//       });

//       setSuccess("Đăng ký thành công! Đang chuyển sang trang đăng nhập...");

//       setTimeout(() => {
//         navigate("/login");
//       }, 1500);
//     } catch (err) {
//       if (err.response && err.response.data.error) {
//         setError(err.response.data.error);
//       } else {
//         setError("Không thể kết nối đến server!");
//       }
//     }
//   };

//   return (
//     <div className={styles.loginContainer}>
//       <div className={styles.loginBox}>
//         <h2>Đăng ký tài khoản</h2>

//         {error && <div className={styles.errorMessage}>{error}</div>}
//         {success && <div className={styles.successMessage}>{success}</div>}

//         <form onSubmit={handleRegister}>
//           <div className={styles.formGroup}>
//             <label>Tên đăng nhập:</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               placeholder="Nhập username"
//               required
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label>Email:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Nhập email"
//               required
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label>Mật khẩu:</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Nhập mật khẩu"
//               required
//             />
//           </div>

//           <div className={styles.formGroup}>
//             <label>Nhập lại mật khẩu:</label>
//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="Nhập lại mật khẩu"
//               required
//             />
//           </div>

//           <button className={styles.loginButton} type="submit">
//             Đăng ký
//           </button>
//         </form>

//         {/* 👇 Dòng chuyển về Login */}
//         <p className={styles.switchText}>
//           Đã có tài khoản?{" "}
//           <span
//             className={styles.link}
//             onClick={() => navigate("/login")}
//           >
//             Đăng nhập
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Register;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../css/Login.module.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/auth/register", {
        username,
        email,
        password,
      });

      setSuccess("Đăng ký thành công! Đang chuyển sang trang đăng nhập...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Không thể kết nối đến server!");
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2>Đăng ký tài khoản</h2>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}

        <form onSubmit={handleRegister}>
          <div className={styles.formGroup}>
            <label>Tên đăng nhập:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập username"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Mật khẩu:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Nhập lại mật khẩu:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>

          <button className={styles.loginButton} type="submit">
            Đăng ký
          </button>
        </form>

        <p className={styles.switchText}>
          Đã có tài khoản?{" "}
          <span className={styles.link} onClick={() => navigate("/login")}>
            Đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
