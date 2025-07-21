import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { images } from "../../../Assets";
import CustomButton from "../../../Components/CustomButton";
import { useAuth } from "../../../Hooks/useAuth";
import { getCountryFlag, usePageTitleUser } from "../../../Utils/helper";
import "./style.css";

const UserProfile = () => {
  usePageTitleUser("My Profile");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState();
  const [coverPic, setCoverPic] = useState();

  useEffect(() => {
    setProfilePic(user.photo_path || images.userImage);
    setCoverPic(user.cover_photo || images.ProfileCover);
  }, []);

  return (
    <Container fluid>
      <div className="py-sm-5 py-3 px-sm-0 px-1">
        <div className="site_card">
          <Row>
            <Col sm={12} className="text-center mb-3 mb-lg-4">
              <h2 className="page-title fw-bold">My Profile</h2>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <div className="">
                <Col xs={12} className="">
                  <div className="cover_img">
                    <img src={coverPic ?? images.ProfileCover} alt="User" />
                  </div>
                </Col>
                <Row>
                  <Col xs={12} className="mb-4">
                    <div className="ptofile_img ms-lg-5 ms-4">
                      <img src={profilePic ?? images.userImage} alt="User" />
                    </div>
                  </Col>

                  <Col xs={12} xxl={9}>
                    <Row>
                      <Col xs={12} lg={3} className="mb-3 mb-lg-4 mb-xxl-5">
                        <h5 className="mb-0 fw-medium text-capitalize mb-2">
                          First Name
                        </h5>
                        <p
                          className="text-capitalize fw-semibold"
                          style={{ color: "#727A84" }}
                        >
                          {user?.first_name}
                        </p>
                      </Col>
                      <Col xs={12} lg={3} className="mb-3 mb-lg-4 mb-xxl-5">
                        <h5 className="mb-0 fw-medium text-capitalize mb-2">
                          Last Name
                        </h5>
                        <p
                          className="text-capitalize fw-semibold"
                          style={{ color: "#727A84" }}
                        >
                          {user?.last_name}
                        </p>
                      </Col>
                      <Col xs={12} lg={3} className="mb-3 mb-lg-4 mb-xxl-5">
                        <h5 className="mb-0 fw-medium text-capitalize mb-2">
                          Contact Number
                        </h5>
                        <p
                          className="text-capitalize fw-semibold"
                          style={{ color: "#727A84" }}
                        >
                          <span className="me-1">
                            {getCountryFlag(user.phone)}
                          </span>
                          {user?.phone}
                        </p>
                      </Col>
                      <Col xs={12} lg={3} className="mb-3 mb-lg-4 mb-xxl-5">
                        <h5 className="mb-0 fw-medium text-capitalize mb-2">
                          Email Address
                        </h5>
                        <p className="fw-semibold" style={{ color: "#727A84" }}>
                          {user?.email}
                        </p>
                      </Col>
                      <Col xs={12} lg={3} className="mb-3 mb-lg-4 mb-xxl-5">
                        <h5 className="mb-0 fw-medium text-capitalize mb-2">
                          Language
                        </h5>
                        <p className="fw-semibold" style={{ color: "#727A84" }}>
                          {user?.language}
                        </p>
                      </Col>
                      <Col xs={12} lg={3} className="mb-3 mb-lg-4 mb-xxl-5">
                        <h5 className="mb-0 fw-medium text-capitalize mb-2">
                          Nationality
                        </h5>
                        <p className="fw-semibold" style={{ color: "#727A84" }}>
                          {user?.nationality}
                        </p>
                      </Col>
                      <Col xs={12} lg={3} className="mb-3 mb-lg-4 mb-xxl-5">
                        <h5 className="mb-0 fw-medium text-capitalize mb-2">
                          Gender
                        </h5>
                        <p className="fw-semibold" style={{ color: "#727A84" }}>
                          {user?.gender}
                        </p>
                      </Col>
                      <Col xs={12} lg={3} className="mb-3 mb-lg-4 mb-xxl-5">
                        <h5 className="mb-0 fw-medium text-capitalize mb-2">
                          Free Cancellation For month before 24 hours
                        </h5>
                        <p className="fw-semibold" style={{ color: "#727A84" }}>
                          {user?.cancellation}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} xxl={3}>
                    <Row>
                      <Col xs={12} className="mb-xxl-0 mb-3">
                        <div className="profile_wallet_card">
                          <h4>Wallet</h4>
                          <p>Amount : {user?.amount || "$20"} </p>
                          <Link
                            to={"/withdraw-amount"}
                            className="btn btn-primary text-nowrap"
                          >
                            Withdraw Amount
                          </Link>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="mb-4">
                  <Col xs={12} xxl={9}>
                    <h3 className="fw-bold">Personal Detail</h3>
                    <h5 className="LightblackColor">About</h5>
                    <p style={{ color: "#727A84" }}>{user?.about}</p>
                  </Col>
                </Row>
                <Row className="mb-5">
                  <Col xs={12} xxl={9}>
                    <h3 className="fw-bold">Educational Detail</h3>
                    <Row>
                      <Col xs={12} lg={6}>
                        <div className="educational_card">
                          <div className="d-flex">
                            <div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="48"
                                height="48"
                                viewBox="0 0 48 48"
                                fill="none"
                              >
                                <path
                                  d="M24.1318 5.42102C30.8038 5.42123 36.1377 10.6193 36.1377 16.9406C36.1375 23.2617 30.8037 28.4589 24.1318 28.4591C17.4597 28.4591 12.1252 23.2618 12.125 16.9406C12.125 10.6191 17.4596 5.42102 24.1318 5.42102Z"
                                  stroke="black"
                                  strokeWidth="2.29688"
                                />
                                <path
                                  d="M31.751 41.1251C31.751 41.751 31.5379 41.9877 31.4424 42.0538C31.3771 42.099 31.1916 42.1863 30.8164 42.0509L30.6436 41.9786L25.4199 39.5031L25.3867 39.4874L25.2324 39.4269C24.8686 39.2962 24.4781 39.2462 24.1289 39.2462C23.73 39.2463 23.2775 39.3112 22.8721 39.4874L22.8389 39.5031L17.626 41.9728C17.1347 42.1995 16.8994 42.0949 16.8193 42.0392C16.7204 41.9702 16.5088 41.7321 16.5078 41.1105L16.5449 31.9581C18.8358 33.0623 21.4076 33.6798 24.1289 33.6798C26.8514 33.6798 29.4417 33.0613 31.751 31.9572V41.1251Z"
                                  stroke="black"
                                  strokeWidth="2.29688"
                                />
                              </svg>
                            </div>
                            <div>
                              <h5>Institute Name:</h5>
                              <p>Stanford School of Psychology</p>
                            </div>
                          </div>
                          <div className="ps-5">
                            <h5>Degree Title:</h5>
                            <p>
                              Master of Science in Clinical Psychology 2020 -
                              2023
                            </p>
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} lg={6}>
                        <div
                          className="educational_card"
                          style={{ backgroundColor: "#E1CEE4" }}
                        >
                          <div className="d-flex">
                            <div>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="48"
                                height="48"
                                viewBox="0 0 48 48"
                                fill="none"
                              >
                                <path
                                  d="M24.1318 5.42102C30.8038 5.42123 36.1377 10.6193 36.1377 16.9406C36.1375 23.2617 30.8037 28.4589 24.1318 28.4591C17.4597 28.4591 12.1252 23.2618 12.125 16.9406C12.125 10.6191 17.4596 5.42102 24.1318 5.42102Z"
                                  stroke="black"
                                  strokeWidth="2.29688"
                                />
                                <path
                                  d="M31.751 41.1251C31.751 41.751 31.5379 41.9877 31.4424 42.0538C31.3771 42.099 31.1916 42.1863 30.8164 42.0509L30.6436 41.9786L25.4199 39.5031L25.3867 39.4874L25.2324 39.4269C24.8686 39.2962 24.4781 39.2462 24.1289 39.2462C23.73 39.2463 23.2775 39.3112 22.8721 39.4874L22.8389 39.5031L17.626 41.9728C17.1347 42.1995 16.8994 42.0949 16.8193 42.0392C16.7204 41.9702 16.5088 41.7321 16.5078 41.1105L16.5449 31.9581C18.8358 33.0623 21.4076 33.6798 24.1289 33.6798C26.8514 33.6798 29.4417 33.0613 31.751 31.9572V41.1251Z"
                                  stroke="black"
                                  strokeWidth="2.29688"
                                />
                              </svg>
                            </div>
                            <div>
                              <h5>Institute Name:</h5>
                              <p>Stanford School of Psychology</p>
                            </div>
                          </div>
                          <div className="ps-5">
                            <h5>Degree Title:</h5>
                            <p>
                              Master of Science in Clinical Psychology 2020 -
                              2023
                            </p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="mb-5">
                  <h3 className="fw-bold">Work Experience</h3>
                  <Col xs={12} lg={6}>
                    <Row>
                      <Col xs={12} md={6}>
                        <h5>Organization Name:</h5>
                        <p>{user?.organization_name}</p>
                      </Col>
                      <Col xs={12} md={6}>
                        <h5>Designation:</h5>
                        <p>{user?.designation}</p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="mb-5">
                  <h3 className="fw-bold">Certification Detail</h3>
                  <Col xs={12} lg={6}>
                    <Row>
                      <Col xs={12} md={6}>
                        <h5>Institute Name:</h5>
                        <p>{user?.certificate_name}</p>
                      </Col>
                      <Col xs={12} md={6}>
                        <h5>Certificate Title:</h5>
                        <p>{user?.certificate_title}</p>
                      </Col>
                      <Col xs={12} sm={6}>
                        <img
                          src={user?.certificate_image}
                          alt="certificate-img"
                          className="img-fluid w-100"
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} className="d-flex gap-3 flex-wrap">
                    <CustomButton
                      variant="primary"
                      className="min-width-180"
                      text="Edit Profile"
                      onClick={() => {
                        navigate("/edit-profile");
                      }}
                    />
                    <CustomButton
                      variant="secondary"
                      className="min-width-180 px-3"
                      text="Change Password"
                      onClick={() => {
                        navigate("/change-password");
                      }}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Container>
  );
};

export default UserProfile;
