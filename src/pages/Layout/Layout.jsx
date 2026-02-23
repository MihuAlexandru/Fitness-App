import { Outlet, useLocation } from "react-router-dom";
import "./Layout.css";
import NavBar from "../../components/Navbar/Navbar";

export default function Layout() {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <div className={`layout ${isDashboard ? "layout--dashboard" : ""}`}>
      <NavBar />
      <div className="layout__content">
        <Outlet />
      </div>
    </div>
  );
}
