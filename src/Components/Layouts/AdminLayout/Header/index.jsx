import { faBars, faDollarSign, faEllipsisV, faMoneyCheck, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Dropdown, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ChatIconAdmin from "../../../../Assets/images/svg/chatIconAdmin.svg?react";
import { notificationsData } from "../../../../Config/data";
import { useAuth } from "../../../../Hooks/useAuth";
import { useLogout } from "../../../../Services/Auth";
import CustomModal from "../../../CustomModal";
import HeaderNotification from "../../../HeaderNotification";
import Toast, { showToast } from "../../../Toast";
import "./style.css";
import { images } from "../../../../Assets";

export const Header = (props) => {
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const handleLogout = useLogout();
  const [showModal, setShowModal] = useState(false);
  const [notificationData, setNotificationData] = useState([]);

  const getNotification = async () => {
    // let url = `/${role}-api/notifications`;
    // const response = await getAll(url);
    const response = notificationsData;
    if (response) {
      setNotificationData(response?.detail?.notifications?.data);
    }
  };

  const logout = async () => {
    showToast("Logout Successfully", "success");
    await handleLogout(role);
    setTimeout(() => {
      navigate(`/${role}`);
    }, 1000);
  };

  return (
    <header className={`${props?.className ?? ""}`}>
      <Navbar className="customHeader" expand="md">
        <Navbar.Toggle className="order-4 order-lg-2 notButton "><FontAwesomeIcon className="bell-icon " icon={faEllipsisV} /></Navbar.Toggle>
        <div className="logoWrapper px-2 order-2 order-lg-1">
          <Link to={"/admin/dashboard"} className="siteLogo">
            <img src={images.adminAuthLogo} alt="" />
          </Link>
        </div>
        <Navbar.Collapse id="basic-navbar-nav" className="customCollapse order-3">
          <Nav className="ms-auto">
            <Link className="customerSupportIcon me-2" to={"/admin/chat"}>
              <ChatIconAdmin />
            </Link>
            <HeaderNotification notificationData={notificationData} getNotification={getNotification} />
            <Dropdown className="userDropdown">
              <Dropdown.Toggle variant="transparent" className="notButton toggleButton border-0 px-0">
                <div className="userImage d-flex align-items-center">
                  <img src={user?.["photo-path"]} alt="" className="img-fluid" />
                  <h6 className="ms-2 mb-0 whiteColor">{user?.["full_name"]}</h6>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="userMenu whiteColor" align="end">
                <Link className="userMenuItem" to={`/${role}/profile`}>
                  <FontAwesomeIcon className="me-2 yellow-text" icon={faUser} /> Profile
                </Link>
                <Link onClick={() => setShowModal(true)} className="userMenuItem">
                  <FontAwesomeIcon className="me-1 yellow-text" icon={faSignOut} /> Logout
                </Link>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
        <button className="notButton ms-md-2 order-lg-4 order-md-4 order-1">
          <FontAwesomeIcon className="bell-icon whiteColor d-lg-none d-block" onClick={props.sidebarToggle} icon={faBars} />
        </button>
      </Navbar>
      <Toast />
      <CustomModal
        show={showModal}
        close={() => {
          setShowModal(false);
        }}
        action={() => {
          logout();
          setShowModal(false);
        }}
        heading="Logout?"
        para="Are you sure you want to logout?"
      />
    </header>
  );
};
