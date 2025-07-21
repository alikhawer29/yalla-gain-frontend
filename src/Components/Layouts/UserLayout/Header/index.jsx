import {
  faAngleLeft,
  faAngleRight,
  faBars,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Container,
  Dropdown,
  Offcanvas,
  Placeholder,
} from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { images } from "../../../../Assets";
import { useAuth } from "../../../../Hooks/useAuth";
import { useLogout } from "../../../../Services/Auth";
import { fullName, generateLinks } from "../../../../Utils/helper";
import CustomModal from "../../../CustomModal";
import HeaderNotification from "../../../HeaderNotification";
import Toast, { showToast } from "../../../Toast";
import "./style.css";
import { notificationsData } from "../../../../Config/data";

export const Header = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [dropDown, setDropDown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // const [notiData, setNotiData] = useState(notifications);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const { role, token, user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loginRequireModal, setLoginRequireModal] = useState(false);
  const [profilePic, setProfilePic] = useState();

  useEffect(() => {
    if (user) {
      setProfilePic(user.photo_path || images.userImage);
    }
  }, [user]);

  const handleLogout = useLogout();
  const logout = async () => {
    showToast("Logout Successfully", "success");
    await handleLogout(role);
    isProviderPath &&
      setTimeout(() => {
        navigate(`/provider`);
      }, 1000);

    !isProviderPath &&
      setTimeout(() => {
        navigate(`/`);
      }, 1000);
  };

  const hideDropdown = () => setDropDown(false);
  const navbarRef = useRef(null);

  const checkScrollButtons = () => {
    if (navbarRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = navbarRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft + clientWidth < scrollWidth);
    }
  };

  const scrollLeft = () => {
    if (navbarRef.current) {
      navbarRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (navbarRef.current) {
      navbarRef.current.scrollBy({ left: 500, behavior: "smooth" });
    }
  };
  useEffect(() => {
    checkScrollButtons();
  }, [checkScrollButtons]);

  useEffect(() => {
    window.addEventListener("resize", checkScrollButtons);
    return () => {
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, [window.innerWidth]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
    };

    handleResize(); // Check on initial load
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const pageAcces = ["", "about-us", "contact-us"];

  const [userRole, setUserRole] = useState({});
  useEffect(() => {
    setUserRole(role);
  }, []);

  const [notificationData, setNotificationData] = useState([]);
  const getNotification = async () => {
    // let url = `/${role}-api/notifications`;
    // const response = await getAll(url);
    const response = notificationsData;
    if (response) {
      setNotificationData(response?.detail?.notifications?.data);
    }
  };

  let currentLinks = generateLinks(role);
  const location = useLocation();

  return (
    <>
      <header
        id="header"
        className={`w-100 z-inxed-2 w-100 user-header ${
          location.pathname == "/" && "home_header"
        }`}
      >
        <Navbar bg="light" variant="light" className={``}>
          <Container fluid className="">
            <Navbar.Brand as={Link} to={"/"} className="me-3">
              <img src={images.Logo} alt="" />
            </Navbar.Brand>
            <Offcanvas
              className="main-nav-wrap flex-grow-1 me-0 me-lg-3"
              show={show}
              onHide={handleClose}
              responsive="lg"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title></Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body
                id="basic-navbar-nav"
                className="justify-content-between"
              >
                {token ? (
                  <div
                    className={`d-flex scroll-nav-wrapper flex-grow-1 justify-content-start ${
                      token
                        ? "justify-content-lg-center"
                        : "justify-content-lg-end"
                    }`}
                  >
                    {showLeftButton && (
                      <button
                        className="scroll-button d-lg-inline-block d-none left"
                        onClick={scrollLeft}
                      >
                        <FontAwesomeIcon icon={faAngleLeft} />
                      </button>
                    )}
                    <Nav
                      className="mx-0 scrollable-nav"
                      ref={navbarRef}
                      onScroll={checkScrollButtons}
                      onMouseLeave={hideDropdown}
                    >
                      {currentLinks.map((element, index) => (
                        <Nav.Item as="li" key={index}>
                          <NavLink
                            className="nav-link"
                            to={element.path}
                            onClick={handleClose}
                          >
                            {element.label}
                          </NavLink>
                        </Nav.Item>
                      ))}
                    </Nav>
                    {showRightButton && (
                      <button
                        className="scroll-button d-lg-inline-block d-none right"
                        onClick={scrollRight}
                      >
                        <FontAwesomeIcon icon={faAngleRight} />
                      </button>
                    )}
                  </div>
                ) : (
                  // Guest Navigation
                  <div
                    className={`d-flex scroll-nav-wrapper flex-grow-1 justify-content-start justify-content-lg-end`}
                  >
                    {showLeftButton && (
                      <button
                        className="scroll-button d-lg-inline-block d-none left"
                        onClick={scrollLeft}
                      >
                        <FontAwesomeIcon icon={faAngleLeft} />
                      </button>
                    )}
                    <Nav
                      className="mx-0 scrollable-nav"
                      ref={navbarRef}
                      onScroll={checkScrollButtons}
                      onMouseLeave={hideDropdown}
                    >
                      {currentLinks.map((element, index) => {
                        const isAccessible =
                          userRole ||
                          pageAcces.includes(
                            element.path.replace("/", "").toLowerCase()
                          );

                        return (
                          <Nav.Item as="li" key={index}>
                            <NavLink
                              className={({ isActive }) =>
                                `nav-link ${
                                  isAccessible && isActive ? "active" : ""
                                }`
                              }
                              to={isAccessible ? element.path : "#"}
                            >
                              {element.label}
                            </NavLink>
                          </Nav.Item>
                        );
                      })}
                    </Nav>
                    {showRightButton && (
                      <button
                        className="scroll-button d-lg-inline-block d-none right"
                        onClick={scrollRight}
                      >
                        <FontAwesomeIcon icon={faAngleRight} />
                      </button>
                    )}
                  </div>
                )}

                {token ? (
                  <Nav
                    as="ul"
                    className="gap-3 gap-xxl-4 navbar-login align-items-sm-center flex-row d-sm-none "
                  >
                    <>
                      <Nav.Item as="li">
                        <Link to="/chat">
                          <images.ChatIcon />
                        </Link>
                      </Nav.Item>
                      <Nav.Item as="li">
                        <HeaderNotification
                          viewAllLink="/notifications"
                          notificationData={notificationData}
                          getNotification={getNotification}
                        />
                      </Nav.Item>
                      <Nav.Item as="li">
                        <Dropdown className="dropdown-user">
                          <Dropdown.Toggle
                            className="after-none"
                            variant=""
                            id="dropdown-basic"
                          >
                            {user && (
                              <Dropdown.Item
                                as="div"
                                className="text-center login-user"
                              >
                                <div className="d-flex align-items-center gap-2">
                                  <span className="avatar avatar-online">
                                    <img
                                      src={
                                        profilePic ??
                                        images.userImage ??
                                        images.Placeholder
                                      }
                                      alt="avatar"
                                    />
                                  </span>
                                  <span className="user-name fw-semibold">
                                    {fullName(user)}
                                  </span>
                                  <FontAwesomeIcon
                                    icon={faChevronDown}
                                    color="#333"
                                  />
                                </div>
                              </Dropdown.Item>
                            )}
                          </Dropdown.Toggle>
                          <Dropdown.Menu align="end">
                            <Dropdown.Item as={Link} to="/profile">
                              My Profile
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/payment-logs-user">
                              Payment Logs
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/rating-&-reviews">
                              Ratings & Reviews
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="">
                              Bank Details
                            </Dropdown.Item>
                            <Dropdown.Item as={Link} to="/blocked-users">
                              Blocked User
                            </Dropdown.Item>
                            <Dropdown.Item
                              className="logout"
                              onClick={() => setShowModal(true)}
                            >
                              Logout
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Nav.Item>
                    </>
                  </Nav>
                ) : (
                  <Nav
                    as="ul"
                    className={`navbar-right flex-grow-1 flex-lg-grow-0 ${
                      token ? "justify-content-center" : "justify-content-end"
                    }  gap-2 d-sm-none`}
                  >
                    <Nav.Item as="li">
                      <Link to={"/login"} className="btn btn-secondary">
                        Login
                      </Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Link className="btn btn-primary" to={"/signup"}>
                        Sign up
                      </Link>
                    </Nav.Item>
                  </Nav>
                )}
              </Offcanvas.Body>
            </Offcanvas>
            <Navbar.Collapse
              id=""
              className="flex-grow-0 h-100 justify-content-end"
            >
              {token ? (
                <Nav
                  as="ul"
                  className="gap-3 gap-xxl-4 navbar-login align-items-center d-sm-flex d-none"
                >
                  <>
                    <Nav.Item as="li">
                      <Link to="/chat">
                        <images.ChatIcon />
                      </Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <HeaderNotification
                        viewAllLink="/notifications"
                        notificationData={notificationData}
                        getNotification={getNotification}
                      />
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Dropdown className="dropdown-user">
                        <Dropdown.Toggle
                          className="after-none"
                          variant=""
                          id="dropdown-basic"
                        >
                          {user && (
                            <Dropdown.Item
                              as="div"
                              className="text-center login-user"
                            >
                              <div className="d-flex align-items-center gap-2">
                                <span className="avatar avatar-online">
                                  <img
                                    src={profilePic ?? images.userImage}
                                    alt="avatar"
                                  />
                                </span>
                                <span className="user-name fw-semibold">
                                  {fullName(user)}
                                </span>
                                <FontAwesomeIcon
                                  icon={faChevronDown}
                                  color="#333"
                                />
                              </div>
                            </Dropdown.Item>
                          )}
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end">
                          <Dropdown.Item as={Link} to="/profile">
                            <span>
                              <images.MyProfile />
                            </span>
                            <span>My Profile</span>
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to="/payment-logs-user">
                            <span>
                              <images.PaymentLog />
                            </span>
                            <span>Payment Logs</span>
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to="/rating-reviews">
                            <span>
                              <images.RatingReview />
                            </span>
                            <span>Ratings & Reviews</span>
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to="/bank-details">
                            <span>
                              <images.BankDetails />
                            </span>
                            <span> Bank Details</span>
                          </Dropdown.Item>
                          <Dropdown.Item as={Link} to="/blocked-users">
                            <span>
                              <images.BlockedUsers />
                            </span>
                            <span>Blocked Users</span>
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="logout"
                            onClick={() => setShowModal(true)}
                          >
                            <span>
                              <images.Logout />
                            </span>
                            <span>Logout</span>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Nav.Item>
                  </>
                </Nav>
              ) : (
                <Nav
                  as="ul"
                  className="navbar-right flex-grow-1 flex-lg-grow-0 justify-content-end gap-2 align-items-center d-sm-flex d-none"
                >
                  <Nav.Item as="li">
                    <Link to={"/login"} className="btn btn-secondary">
                      Login
                    </Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Link to={"/signup"} className="btn btn-primary">
                      Sign up
                    </Link>
                  </Nav.Item>
                </Nav>
              )}

              <Button
                variant="primary"
                className="menu-toggle mobile-nav d-lg-none ms-3"
                onClick={handleShow}
              >
                <FontAwesomeIcon icon={faBars} />
              </Button>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

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
      <CustomModal
        show={loginRequireModal}
        close={() => {
          setLoginRequireModal(false);
        }}
        action={() => {
          setLoginRequireModal(false);
          navigate(`login`);
        }}
        heading="Login Required"
        para=""
        alert
      />
    </>
  );
};
