
// import { useEffect, useState } from "react";
// import axios from "axios";
// import styles from "../css/Store.module.css";

// export default function Store() {
//   const sellerId = parseInt(localStorage.getItem("sellerID"));

//   const [products, setProducts] = useState([]);
//   const [form, setForm] = useState({
//     name: "",
//     price: "",
//     stock: "",
//     discount: 0,
//     status: "Available",
//     imageURL: ""
//   });

//   const [preview, setPreview] = useState(null);

//   // Load products
//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/store/${sellerId}`);
//       setProducts(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (sellerId) fetchProducts();
//   }, []);

//   const handleImageSelect = async (e) => {
//   const file = e.target.files[0];
//   if (!file) return;

//   // preview
//   setPreview(URL.createObjectURL(file));

//   const formData = new FormData();
//   formData.append("image", file);

//   try {
//     const res = await axios.post("http://localhost:5000/upload", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     // 🔥 BACKEND TRẢ VỀ: imageUrl
//     const url = res.data.imageUrl;

//     setForm((prev) => ({
//       ...prev,
//       imageURL: url, // dùng đường dẫn tuyệt đối như avatar
//     }));

//   } catch (err) {
//     console.error(err);
//     alert("Upload ảnh thất bại!");
//   }
// };


//   // Add product
//   const handleUpload = async (e) => {
   
//     e.preventDefault();

//   if (!form.imageURL) return alert("Chọn ảnh!");

//   try {
//     // Nếu có productId → UPDATE
//     if (form.productId) {
//       await axios.put("http://localhost:5000/store/update", {
//   productId: form.productId,
//   name: form.name,
//   price: form.price,
//   stock: form.stock,
//   discount: form.discount,
//   status: form.status,
//   imageURL: form.imageURL
// });


//       alert("Cập nhật thành công!");
//     } 
//     else {
//       // Nếu không có productId → ADD
//       await axios.post("http://localhost:5000/store/add", {
//         sellerId,
//         name: form.name,
//         price: form.price,
//         stock: form.stock,
//         discount: form.discount,
//         status: form.status,
//         imageURL: form.imageURL,
//       });

//       alert("Thêm thành công!");
//     }

//     fetchProducts();

//     setForm({
//       name: "",
//       price: "",
//       stock: "",
//       discount: 0,
//       status: "Available",
//       imageURL: "",
//       productId: null
//     });

//     setPreview(null);

//   } catch (err) {
//     console.error(err);
//     alert("Lỗi khi lưu sản phẩm!");
//   }
//   };

//   // Delete product
//   const deleteProduct = async (productId) => {
//     if (!window.confirm("Xóa sản phẩm?")) return;

//     try {
//       await axios.delete(`http://localhost:5000/store/delete/${productId}`);
//       fetchProducts();
//     } catch {
//       alert("Xóa lỗi");
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h2>Quản lý cửa hàng</h2>

//       <div className={styles.uploadBox}>
//         <h3>Thêm sản phẩm</h3>

//         <form onSubmit={handleUpload} className={styles.form}>
//           <input
//             type="text"
//             placeholder="Tên sản phẩm"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             required
//           />

//           <input
//             type="number"
//             placeholder="Giá"
//             value={form.price}
//             onChange={(e) => setForm({ ...form, price: e.target.value })}
//             required
//           />

//           <input
//             type="number"
//             placeholder="Kho"
//             value={form.stock}
//             onChange={(e) => setForm({ ...form, stock: e.target.value })}
//             required
//           />

//           <input
//             type="number"
//             placeholder="Giảm giá (0 - 1)"
//             value={form.discount}
//             onChange={(e) => setForm({ ...form, discount: e.target.value })}
//           />

//           <label className={styles.uploadLabel}>
//             Chọn ảnh
//             <input type="file" accept="image/*" onChange={handleImageSelect} />
//           </label>

//           {preview && <img src={preview} className={styles.preview} />}

//           <select
//             value={form.status}
//             onChange={(e) => setForm({ ...form, status: e.target.value })}
//           >
//             <option value="Available">Available</option>
//             <option value="OutOfStock">Out of Stock</option>
//           </select>

//           <button type="submit" className={styles.addBtn}>
//             Thêm sản phẩm
//           </button>
//         </form>
//       </div>

//       <h3>Sản phẩm hiện có</h3>

//       <div className={styles.grid}>
//         {products.map((p) => (
//           <div className={styles.card} key={p.ProductID}>
//             {/* <img src={p.ImageURL || "/no-image.jpg"} className={styles.img} /> */}
//             <img
//   className={styles.img}
//   src={
//     p.ImageURL?.startsWith("img/")
//       ? `/${p.ImageURL}`   // ảnh cũ trong thư mục public/img
//       : `http://localhost:5000/${p.ImageURL}` // ảnh mới upload trong backend
//   }
//   alt={p.ProductName}
// />


//             <h4>{p.ProductName}</h4>

//             {/* ==== Tính giá sau giảm ===== */}
// {(() => {
//   const finalPrice = p.ProductPrice * (1 - p.DiscountRate);
//   const format = (v) =>
//     new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(v);

//   return (
//     <div className={styles.priceBox}>
//       <span className={styles.finalPrice}>{format(finalPrice)}</span>

//       {p.DiscountRate > 0 && (
//         <span className={styles.originalPrice}>{format(p.ProductPrice)}</span>
//       )}
//     </div>
//   );
// })()}
//             <p>Kho: {p.StockQuantity}</p>
//             <p>Giảm giá: {p.DiscountRate * 100}%</p>

//             <button
//               className={styles.deleteBtn}
//               onClick={() => deleteProduct(p.ProductID)}
//             >
//               Xóa
//             </button>
//             <button
//   className={styles.editBtn}
//   onClick={() => setForm({
//     name: p.ProductName,
//     price: p.ProductPrice,
//     stock: p.StockQuantity,
//     discount: p.DiscountRate,
//     status: p.ProductStatus,
//     imageURL: p.ImageURL,
//     productId: p.ProductID
//   })}
// >
//   Sửa
// </button>

//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../css/Store.module.css";

export default function Store() {
  const sellerId = parseInt(localStorage.getItem("sellerID"));

  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    discount: 0,
    status: "Available",
    imageURL: "",
    productId: null,
  });

  const [preview, setPreview] = useState(null);

  // Load products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/store/${sellerId}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (sellerId) fetchProducts();
  }, []);

  // Upload image
  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = res.data.imageUrl;

      setForm((prev) => ({
        ...prev,
        imageURL: url,
      }));
    } catch (err) {
      console.error(err);
      alert("Upload ảnh thất bại!");
    }
  };

  // Add or Update product
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!form.imageURL) return alert("Chọn ảnh!");

    try {
      if (isEditing) {
        // UPDATE
        await axios.put("http://localhost:5000/store/update", {
          productId: form.productId,
          name: form.name,
          price: form.price,
          stock: form.stock,
          discount: form.discount,
          status: form.status,
          imageURL: form.imageURL,
        });

        alert("Cập nhật thành công!");
      } else {
        // ADD
        await axios.post("http://localhost:5000/store/add", {
          sellerId,
          name: form.name,
          price: form.price,
          stock: form.stock,
          discount: form.discount,
          status: form.status,
          imageURL: form.imageURL,
        });

        alert("Thêm thành công!");
      }

      fetchProducts();
      resetForm();

    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu sản phẩm!");
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      stock: "",
      discount: 0,
      status: "Available",
      imageURL: "",
      productId: null,
    });
    setPreview(null);
    setIsEditing(false);
  };

  // Delete product
  const deleteProduct = async (productId) => {
    if (!window.confirm("Xóa sản phẩm?")) return;

    try {
      await axios.delete(`http://localhost:5000/store/delete/${productId}`);
      fetchProducts();
    } catch {
      alert("Xóa lỗi");
    }
  };

  // Edit product
  const handleEdit = (p) => {
    setIsEditing(true);

    let fullImg =
      p.ImageURL?.startsWith("img/")
        ? `/${p.ImageURL}`
        : `http://localhost:5000/${p.ImageURL}`;

    setPreview(fullImg);

    setForm({
      name: p.ProductName,
      price: p.ProductPrice,
      stock: p.StockQuantity,
      discount: p.DiscountRate,
      status: p.ProductStatus,
      imageURL: p.ImageURL,
      productId: p.ProductID,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.container}>
      <h2>Quản lý cửa hàng</h2>

      <div className={styles.uploadBox}>
        <h3>{isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}</h3>

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
            placeholder="Kho"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Giảm giá (0 - 1)"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
          />

          <label className={styles.uploadLabel}>
            Chọn ảnh
            <input type="file" accept="image/*" onChange={handleImageSelect} />
          </label>

          {preview && <img src={preview} className={styles.preview} />}

          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="Available">Available</option>
            <option value="OutOfStock">Out of Stock</option>
          </select>

          <button type="submit" className={styles.addBtn}>
            {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
          </button>

        </form>
      </div>

      <h3>Sản phẩm hiện có</h3>

      <div className={styles.grid}>
        {products.map((p) => {

          let img =
            p.ImageURL?.startsWith("img/")
              ? `/${p.ImageURL}`
              : `http://localhost:5000/${p.ImageURL}`;

          const finalPrice = p.ProductPrice * (1 - p.DiscountRate);

          const format = (v) =>
            new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(v);

          return (
            <div className={styles.card} key={p.ProductID}>
              <img className={styles.img} src={img} alt={p.ProductName} />

              <h4>{p.ProductName}</h4>

              <div className={styles.priceBox}>
                <span className={styles.finalPrice}>{format(finalPrice)}</span>

                {p.DiscountRate > 0 && (
                  <span className={styles.originalPrice}>
                    {format(p.ProductPrice)}
                  </span>
                )}
              </div>

              <p>Kho: {p.StockQuantity}</p>
              <p>Giảm giá: {p.DiscountRate * 100}%</p>

              <button
                className={styles.deleteBtn}
                onClick={() => deleteProduct(p.ProductID)}
              >
                Xóa
              </button>

              <button
                className={styles.editBtn}
                onClick={() => handleEdit(p)}
              >
                Sửa
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
