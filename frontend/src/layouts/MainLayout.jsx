import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ["/signup", "/signin", "/forgot-password", "/reset-password"].includes(
    location.pathname
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-20">{children || <Outlet />}</main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default MainLayout;
