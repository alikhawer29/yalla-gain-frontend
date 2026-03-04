import { faBars, faDollarSign, faEllipsisV, faMoneyCheck, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Dropdown, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ChatIconAdmin from "../../../../Assets/images/svg/chatIconAdmin.svg?react";
import { getAll } from "../../../../Services/Api";
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
    const [unreadChatsCount, setUnreadChatsCount] = useState(0);

    const getNotification = async () => {
        try {
            // API: GET /admin/notification/all/list?per_page=5
            const response = await getAll(`/notification/all/list`, { per_page: 5, page: 1 });
            setNotificationData(response?.data ?? []);
        } catch (e) {
            // swallow silently for header experience
            setNotificationData([]);
        }
    };

    const getUnreadChatsCount = async () => {
        try {
            const res = await getAll(`/chat/getUnread-chats`);
            setUnreadChatsCount(res?.data?.count ?? 0);
        } catch {
            setUnreadChatsCount(0);
        }
    };

    useEffect(() => {
        getUnreadChatsCount();
    }, []);

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
                        <Link className="customerSupportIcon me-2 position-relative" to={"/admin/chat"}>
                            <ChatIconAdmin />
                            {unreadChatsCount > 0 && (
                                <span className="badge" style={{ position: "absolute", top: -6, right: -6 }}>
                                    {unreadChatsCount > 9 ? "9+" : unreadChatsCount}
                                </span>
                            )}
                        </Link>
                        <HeaderNotification notificationData={notificationData} getNotification={getNotification} />
                        <Dropdown className="userDropdown">
                            <Dropdown.Toggle variant="transparent" className="notButton toggleButton border-0 px-0">
                                <div className="userImage d-flex align-items-center">
                                    <img src={user?.photo} alt="" className="img-fluid" />
                                    <h6 className="ms-2 mb-0 whiteColor">{user?.first_name} {user?.last_name}</h6>
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
