import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Component/Sidebar/Sidebar";
import styles from "../css/Profile.module.css";

export default function Profile() {
  const DEFAULT_AVATAR =
    "https://cdn-icons-png.flaticon.com/512/1077/1077114.png";

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  // ============= FETCH USER INFO =============
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        setFormData(res.data);

        // Lưu avatar vào localStorage (fallback nếu rỗng)
        const avt = res.data.avatar;
        localStorage.setItem(
          "avatar",
          avt && avt.trim() !== "" ? avt : DEFAULT_AVATAR
        );

        // Thông báo Navbar cập nhật avatar
        window.dispatchEvent(new Event("avatar-updated"));

      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  // ============= UPLOAD AVATAR =============
  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fd = new FormData();
      fd.append("image", file);

      const uploadRes = await axios.post("http://localhost:5000/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newURL = uploadRes.data.imageUrl;

      // Gắn vào form
      setFormData((prev) => ({
        ...prev,
        avatar: newURL || DEFAULT_AVATAR,
      }));

      // Cập nhật localStorage
      localStorage.setItem(
        "avatar",
        newURL && newURL.trim() !== "" ? newURL : DEFAULT_AVATAR
      );

      // Báo cho Navbar
      window.dispatchEvent(new Event("avatar-updated"));

      alert("Tải ảnh thành công! Nhấn Lưu để cập nhật hồ sơ.");

    } catch (err) {
      console.error(err);
      alert("Upload ảnh thất bại!");
    }
  };

  // ============= HANDLE INPUT CHANGE =============
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ============= SAVE PROFILE CHANGES =============
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put("http://localhost:5000/me", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setIsEditing(false);

      // cập nhật avatar vào localStorage
      const avt = res.data.avatar;
      localStorage.setItem(
        "avatar",
        avt && avt.trim() !== "" ? avt : DEFAULT_AVATAR
      );

      // Báo Navbar cập nhật
      window.dispatchEvent(new Event("avatar-updated"));

      alert("Cập nhật thành công!");

    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại!");
    }
  };

  if (!user) return <div>Đang tải thông tin...</div>;

  return (
    <>
      <Sidebar />
      <div className={styles.container}>
        <h1>Hồ sơ của tôi</h1>

        <div className={styles.header}>
          {/* ẢNH ĐẠI DIỆN */}
          <label htmlFor="avatarInput">
            <img
              src={
                formData.avatar && formData.avatar.trim() !== ""
                  ? formData.avatar
                  : DEFAULT_AVATAR
              }
              alt="avatar"
              className={styles.avatar}
              style={{ cursor: "pointer" }}
            />
          </label>

          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleUploadAvatar}
          />

          <h2>
            {isEditing ? (
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tên đầy đủ"
              />
            ) : (
              <strong>{user.name}</strong>
            )}
          </h2>

          {isEditing ? (
            <button onClick={handleSave} className={styles.buttonSave}>
              Lưu thay đổi
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className={styles.buttonEdit}
              >
                Chỉnh sửa hồ sơ
              </button>

              {user.roles.includes("Seller") && (
                <button
                  className={styles.shopBtn}
                  onClick={() => navigate("/store")}
                >
                  🏪 Trang Shop của tôi
                </button>
              )}
            </>
          )}
        </div>

        {/* FORM THÔNG TIN NGƯỜI DÙNG */}
        <div className={styles.profileCard}>
          <p><strong>ID:</strong> {user.id}</p>

          <p><strong>Username:</strong>
            {isEditing ? (
              <input name="username" value={formData.username} onChange={handleChange} />
            ) : user.username}
          </p>

          <p><strong>Email:</strong>
            {isEditing ? (
              <input name="email" value={formData.email} onChange={handleChange} />
            ) : user.email}
          </p>

          <p><strong>Phone:</strong>
            {isEditing ? (
              <input name="phone" value={formData.phone} onChange={handleChange} />
            ) : user.phone}
          </p>

          <p><strong>Ngày sinh:</strong>
            {isEditing ? (
              <input name="dob" value={formData.dob} onChange={handleChange} />
            ) : user.dob}
          </p>

          <p><strong>Giới tính:</strong>
            {isEditing ? (
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            ) : user.gender}
          </p>

          <p><strong>Mô tả:</strong>
            {isEditing ? (
              <input name="description" value={formData.description} onChange={handleChange} />
            ) : user.description}
          </p>

          <p><strong>Vai trò:</strong> {user.roles.join(", ")}</p>

          <p>
            <strong>Mạng xã hội:</strong>{" "}
            <a href={user.social?.facebook} target="_blank" rel="noreferrer">Facebook</a>,{" "}
            <a href={user.social?.instagram} target="_blank" rel="noreferrer">Instagram</a>
          </p>
        </div>
      </div>
    </>
  );
}
