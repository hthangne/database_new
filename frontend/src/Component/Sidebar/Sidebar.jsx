import React, { useState } from 'react';
import styles from './Sidebar.module.css';

// Dữ liệu danh mục sản phẩm
const productCategories = [
  'Điện thoại',
  'Laptop & Máy tính bảng',
  'Đồng hồ thông minh',
  'Phụ kiện',
  'Thiết bị gia đình',
];

function Sidebar() {
  // State để quản lý trạng thái mở/đóng của sidebar
  const [isOpen, setIsOpen] = useState(false);

  // Hàm xử lý khi click vào nút 3 gạch
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.sidebarContainer}>
      {/* 1. Nút 3 gạch (Hamburger Menu) */}
      <button 
        className={styles.toggleButton} 
        onClick={toggleSidebar}
        aria-expanded={isOpen} // Hỗ trợ truy cập (Accessibility)
        aria-label="Toggle Product Categories"
      >
        <span className={styles.hamburgerIcon}></span>
      </button>

      {/* 2. Menu Sidebar */}
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.menuHeader}>
          <h3>Danh mục sản phẩm</h3>
        </div>
        
        <ul className={styles.categoryList}>
          {productCategories.map((category, index) => (
            <li key={index} className={styles.categoryItem}>
              <a href={`/categories/${category.toLowerCase().replace(/\s/g, '-')}`}>
                {category}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;