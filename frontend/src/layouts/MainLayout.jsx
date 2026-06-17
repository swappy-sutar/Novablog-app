// import { Outlet } from "react-router-dom";
// import Navbar from "../components/layout/Navbar";
// import Footer from "../components/layout/Footer";

// const MainLayout = ({ children }) => {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <main className="flex-grow pt-20 pb-16">{children || <Outlet />}</main>
//       <Footer />
//     </div>
//   );
// };

// export default MainLayout;

import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar is position:fixed (set inside Navbar.jsx itself), so it's
          removed from normal flow and just overlays the top of the page.
          Its real rendered height is 80px (the inner h-20 div). */}
      <Navbar />

      {/* pt-20 (80px) reserves space so page content starts BELOW the fixed
          navbar instead of underneath it. This must always match the
          navbar's real height — if you ever change Navbar's h-20, update
          this pt-20 to match.
          flex-1 makes main stretch to fill all remaining vertical space,
          so the page (and Footer) always reach the bottom of the viewport
          even when the page content is short. */}
      <main className="flex-1 pt-20">{children || <Outlet />}</main>

      <Footer />
    </div>
  );
};

export default MainLayout;