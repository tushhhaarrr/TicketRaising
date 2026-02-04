import React from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

/* 
  Layout HOC component define kar rahe hain.
  Reason: Yeh component poore application ka structure maintain karega (Navbar + Content).
*/
const Layout = ({ children }) => {
    /* 
       React Router ka useLocation hook.
       Reason: Current URL path pata karne ke liye.
    */
    const location = useLocation();

    /* 
       Conditionally Navbar render karne ke liye variables.
       Hum Navbar tabhi dikhate hain jab user logged in ho (non-login pages).
       Logic: Agar path '/login' ya root '/' hai, to Navbar mat dikhao.
    */
    const isAuthPage = location.pathname === '/login' || location.pathname === '/';

    return (
        <>
            {/* 
         Short-circuit logic: Agar auth page nahi hai (!isAuthPage), tabhi Navbar render karo.
      */}
            {!isAuthPage && <Navbar />}

            {/* 
         Main content area.
         Dynamic class assignment:
         - Agar auth page nahi hai: 'page-wrapper container' class lagao (margin aur top padding ke liye).
         - Agar auth page hai: Empty string (full control content ke paas).
      */}
            <main className={!isAuthPage ? "page-wrapper container" : ""}>
                {children}
            </main>
        </>
    );
};

export default Layout;
