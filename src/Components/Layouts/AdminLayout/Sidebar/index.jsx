import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../Hooks/useAuth";
import { generateLinks } from "../../../../Utils/helper";
import "./style.css";
import { images } from "../../../../Assets";

export const Sidebar = (props) => {
  const [user, setUser] = useState({});
  const urlPath = window.location.pathname;
  const { role } = useAuth();
  const [headerLogo, setHeaderLogo] = useState(images.HeaderLogo);
  useEffect(() => {
    setUser(role);
  }, []);

  useEffect(() => {
    if (props.sideclassName === "collapsed") setHeaderLogo(images.HeaderLogoMobile);
    else setHeaderLogo(images.HeaderLogo);
  }, [props.sideclassName]);
  
  let Links = generateLinks(role);

  return (
    <>
      <div className={`sidebar ${props.sideclassName}`} id="sidebar">
        {/* <div className="logoWrapper p-3 px-2 order-2 order-lg-1">
          <Link to={"/admin/dashboard"} className="siteLogo">
            <img src={headerLogo} alt="" />
          </Link>
        </div> */}
        <ul className="list-unstyled mt-4">
          {Links.map((element, index) => (
            <li className="sidebar-li" key={index}>
              <Link className={`sideLink ${urlPath.includes(element.link.substring()) ? "active" : ""}`} to={element.link}>
                <span className="sideIcon">
                  <element.image />
                </span>
                <span className="sideLinkText">{element.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
