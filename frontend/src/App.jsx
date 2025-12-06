// // import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// // import { useState } from 'react';

// // import Login from './pages/Login';
// // import Register from './pages/Register';
// // import Home from './pages/Home';
// // import Profile from './pages/Profile';
// // import Cart from './pages/Cart';
// // import Checkout from './pages/Checkout';
// // import Store from './pages/Store';   // 👉 THÊM DÒNG NÀY
// // import Navbar from './Component/Navbar/Navbar';
// // import Sidebar from './Component/Sidebar/Sidebar';
// // import Wishlist from './pages/Wishlist';



// // function App() {
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);

// //   const Layout = ({ children }) => (
// //     <div style={{ display: "flex" }}>
// //       <Sidebar />
// //       <div style={{ flex: 1 }}>
// //         <Navbar />
// //         {children}
// //       </div>
// //     </div>
// //   );

// //   const PrivateRoute = ({ children }) => {
// //     return isLoggedIn ? children : <Navigate to="/login" />;
// //   };

// //   const AuthRoute = ({ children }) => {
// //     return !isLoggedIn ? children : <Navigate to="/home" />;
// //   };

// //   return (
// //     <BrowserRouter>
// //       <Routes>
        
// //         <Route path="/" element={<Navigate to="/login" />} />

// //         <Route
// //           path="/login"
// //           element={
// //             <AuthRoute>
// //               <Login setIsLoggedIn={setIsLoggedIn} />
// //             </AuthRoute>
// //           }
// //         />

// //         <Route
// //           path="/register"
// //           element={
// //             <AuthRoute>
// //               <Register />
// //             </AuthRoute>
// //           }
// //         />

// //         {/* PRIVATE ROUTES */}
// //         <Route
// //           path="/home"
// //           element={
// //             <PrivateRoute>
// //               <Layout>
// //                 <Home />
// //               </Layout>
// //             </PrivateRoute>
// //           }
// //         />

// //         <Route
// //           path="/profile"
// //           element={
// //             <PrivateRoute>
// //               <Layout>
// //                 <Profile />
// //               </Layout>
// //             </PrivateRoute>
// //           }
// //         />

// //         <Route
// //           path="/cart"
// //           element={
// //             <PrivateRoute>
// //               <Layout>
// //                 <Cart />
// //               </Layout>
// //             </PrivateRoute>
// //           }
// //         />

// //         <Route
// //           path="/checkout"
// //           element={
// //             <PrivateRoute>
// //               <Layout>
// //                 <Checkout />
// //               </Layout>
// //             </PrivateRoute>
// //           }
// //         />

// //         {/* 👉 ROUTE CHO STORE (QUẢN LÝ SẢN PHẨM) */}
// //         <Route
// //           path="/store"
// //           element={
// //             <PrivateRoute>
// //               <Layout>
// //                 <Store />
// //               </Layout>
// //             </PrivateRoute>
// //           }
// //         />

// //         <Route path="*" element={<Navigate to="/login" />} />

// //         <Route
// //           path="/wishlist"
// //           element={
// //             <PrivateRoute>
// //               <Layout>
// //                 <Wishlist />
// //               </Layout>
// //             </PrivateRoute>
// //           }
// //         />

// //       </Routes>
// //     </BrowserRouter>
// //   );
// // }

// // export default App;


// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { useState } from 'react';

// import Login from './pages/Login';
// import Register from './pages/Register';
// import Home from './pages/Home';
// import Profile from './pages/Profile';
// import Cart from './pages/Cart';
// import Checkout from './pages/Checkout';
// import Store from './pages/Store';

// import Navbar from './Component/Navbar/Navbar';
// import Sidebar from './Component/Sidebar/Sidebar';

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const Layout = ({ children }) => (
//     <div style={{ display: "flex" }}>
//       <Sidebar />
//       <div style={{ flex: 1 }}>
//         <Navbar />
//         {children}
//       </div>
//     </div>
//   );

//   const PrivateRoute = ({ children }) => {
//     return isLoggedIn ? children : <Navigate to="/login" />;
//   };

//   const AuthRoute = ({ children }) => {
//     return !isLoggedIn ? children : <Navigate to="/home" />;
//   };

//   return (
//     <BrowserRouter>
//       <Routes>

//         <Route path="/" element={<Navigate to="/login" />} />

//         {/* Login */}
//         <Route
//           path="/login"
//           element={
//             <AuthRoute>
//               <Login setIsLoggedIn={setIsLoggedIn} />
//             </AuthRoute>
//           }
//         />

//         {/* Register */}
//         <Route
//           path="/register"
//           element={
//             <AuthRoute>
//               <Register />
//             </AuthRoute>
//           }
//         />

//         {/* Private routes */}
//         <Route
//           path="/home"
//           element={
//             <PrivateRoute>
//               <Layout><Home /></Layout>
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/profile"
//           element={
//             <PrivateRoute>
//               <Layout><Profile /></Layout>
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/cart"
//           element={
//             <PrivateRoute>
//               <Layout><Cart /></Layout>
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/checkout"
//           element={
//             <PrivateRoute>
//               <Layout><Checkout /></Layout>
//             </PrivateRoute>
//           }
//         />

//         <Route
//           path="/store"
//           element={
//             <PrivateRoute>
//               <Layout><Store /></Layout>
//             </PrivateRoute>
//           }
//         />

//         {/* ❤️ WISHLIST ROUTE - đặt TRÊN "*" */}
//         <Route
//           path="/wishlist"
//           element={
//             <PrivateRoute>
//               <Layout><Wishlist /></Layout>
//             </PrivateRoute>
//           }
//         />

//         {/* MUST BE LAST */}
//         <Route path="*" element={<Navigate to="/login" />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;



import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Store from "./pages/Store";
   // ❤️ THÊM IMPORT
import Wishlist from "./pages/wishlist";
import Navbar from "./Component/Navbar/Navbar";
import Sidebar from "./Component/Sidebar/Sidebar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const Layout = ({ children }) => (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Navbar />
        {children}
      </div>
    </div>
  );

  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  const AuthRoute = ({ children }) => {
    return !isLoggedIn ? children : <Navigate to="/home" />;
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect khi vào "/" */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login setIsLoggedIn={setIsLoggedIn} />
            </AuthRoute>
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />

        {/* =========================== */}
        {/*        PRIVATE PAGES        */}
        {/* =========================== */}

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Layout>
                <Home />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Layout>
                <Cart />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <Layout>
                <Checkout />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/store"
          element={
            <PrivateRoute>
              <Layout>
                <Store />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* ❤️ WISHLIST PAGE */}
        <Route
          path="/wishlist"
          element={
            <PrivateRoute>
              <Layout>
                <Wishlist />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* MUST BE LAST */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
