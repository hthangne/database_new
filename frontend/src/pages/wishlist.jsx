// import { useEffect, useState } from "react";
// import axios from "axios";
// import styles from "../css/Wishlist.module.css";

// export default function Wishlist() {
//     const customerId = localStorage.getItem("customerID");
//     const [items, setItems] = useState([]);

//     useEffect(() => {
//         axios.get(`http://localhost:5000/wishlist/${customerId}`)
//             .then(res => setItems(res.data))
//             .catch(err => console.error(err));
//     }, []);

//     const removeFavorite = async (pid) => {
//         try {
//         await axios.delete(`http://localhost:5000/wishlist/remove`, {
//             params: {
//                 customerId,
//                 productId: pid
//             }
//         });

//         setItems(items.filter(i => i.ProductID !== pid));
//     } catch (err) {
//         console.error(err);
//         alert("Xóa thất bại!");
//     }
//     };

//     return (
//         <div className={styles.container}>
//             <h2>💖 Sản phẩm yêu thích</h2>

//             {items.length === 0 ? (
//                 <p>Bạn chưa thích sản phẩm nào.</p>
//             ) : (
//                 <div className={styles.grid}>
//                     {items.map(item => (
//                         <div className={styles.card} key={item.ProductID}>
//                             <img src={item.ImageURL} alt="" />
//                             <h3>{item.ProductName}</h3>
//                             <p>{item.ProductPrice.toLocaleString()}đ</p>

//                             <button 
//                                 className={styles.removeBtn}
//                                 onClick={() => removeFavorite(item.ProductID)}
//                             >
//                                 ❌ Xóa
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }


import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../css/Wishlist.module.css";

export default function Wishlist() {
    const customerId = localStorage.getItem("customerID");
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/wishlist/${customerId}`)
            .then(res => setItems(res.data))
            .catch(err => console.error(err));
    }, []);

    // XOÁ YÊU THÍCH
    const removeFavorite = async (pid) => {
        try {
            await axios.delete(`http://localhost:5000/wishlist/remove`, {
                params: {
                    customerId,
                    productId: pid
                }
            });

            setItems(prev => prev.filter(i => i.ProductID !== pid));
        } catch (err) {
            console.error(err);
            alert("Xóa thất bại!");
        }
    };

    return (
        <div className={styles.container}>
            <h2>💖 Sản phẩm yêu thích</h2>

            {items.length === 0 ? (
                <p>Bạn chưa thích sản phẩm nào.</p>
            ) : (
                <div className={styles.grid}>
                    {items.map(item => (
                        <div className={styles.card} key={item.ProductID}>
                            <img 
                                src={item.ProductImage || "/no-image.jpg"} 
                                alt={item.ProductName}
                            />

                            <h3>{item.ProductName}</h3>
                            <p>{item.ProductPrice.toLocaleString()}đ</p>

                            <button 
                                className={styles.removeBtn}
                                onClick={() => removeFavorite(item.ProductID)}
                            >
                                ❌ Xóa
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
