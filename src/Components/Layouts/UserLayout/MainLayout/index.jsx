import { Footer } from "../Footer";
import { Header } from "../Header";
import "./style.css";
import { Outlet } from "react-router-dom";

const MainLayout = (props) => {
  const { showFooter = true, showHeader = true, children  } = props;
  return (
    <>
      <div className="user-layout">
        {showHeader && <Header />}
        {/* <Outlet /> */}
        {children || <Outlet />}
        {showFooter && <Footer />}
      </div>
    </>
  );
};

export default MainLayout;
