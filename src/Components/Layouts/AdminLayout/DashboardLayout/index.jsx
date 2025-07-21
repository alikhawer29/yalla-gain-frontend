import { React, useState, useEffect } from "react";
import { Header } from "../Header";
import { Sidebar } from "../Sidebar";
import "./style.css";
import { usePageTitle } from "../../../../Utils/helper";
export const DashboardLayout = (props) => {
  usePageTitle(props?.pageTitle ?? "");
  const [sideBarClass, setsideBarClass] = useState("");
  const [bodyClass, setbodyClass] = useState("");
  const [headerClass, setHeaderClass] = useState(false);
  useEffect(() => {
    if (window.innerWidth <= 991) {
      setsideBarClass("collapsed");
      setbodyClass("expanded");
      setHeaderClass(true);
    } else {
      setsideBarClass("");
      setbodyClass("");
      setHeaderClass(false);
    }
    function handleResize() {
      if (window.innerWidth <= 991) {
        setsideBarClass("collapsed");
        setHeaderClass(true);
        setbodyClass("expanded");
      } else {
        setsideBarClass("");
        setbodyClass("");
        setHeaderClass(false);
      }
    }
    window.addEventListener("resize", handleResize);
  }, []);
  function sidebarToggle() {
    if (sideBarClass === "") {
      setsideBarClass("collapsed");
      setbodyClass("expanded");
      setHeaderClass(true);
    } else {
      setsideBarClass("");
      setbodyClass("");
      setHeaderClass(false);
    }
  }
  return (
    <>
      <Sidebar sideclassName={sideBarClass} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 p-0">
            <div className={`dashboardBody admin-layout ${bodyClass}`}>
              <Header className={`${headerClass?'header-collapsed':''}`} sidebarToggle={sidebarToggle} />
              <div className="dashboardBody-inner">
                {props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
