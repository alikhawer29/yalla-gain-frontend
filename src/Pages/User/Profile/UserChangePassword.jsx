import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import ChangePasswordForm from "../../../Components/ChangePasswordForm";
import withModal from "../../../HOC/withModal";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import "./style.css";

const UserChangePassword = ({ showModal }) => {
  const navigate = useNavigate();
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const [errorsData, setErrorsData] = useState({});

  const handleSubmit = async (values) => {
    startSubmitting();
    showModal(
      null,
      `password Has Been updated Successfully!`,
      () => navigate(-1),
      true
    );
    // let response = await post("/admin-api/account/change-password", values);
    // if (response.status) {
    //   showModal(
    //     `Password changed successfully`,
    //     null,
    //     true,
    //     () => navigate(`/admin/profile`)
    //   );
    // } else {
    //   setErrorsData({ errors: "current_password" });
    // }
    stopSubmitting();
  };
  return (
    <Container fluid>
      <div className="py-sm-5 py-3">
        <div className="site_card">
          <Row>
            <Col
              sm={12}
              className="gap-3 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 mb-lg-4"
            >
              <BackButton2 />
              <h2 className="page-title fw-bold mx-auto">Change Password</h2>
            </Col>
          </Row>
          <Row>
            <Col xs={12} lg={10}>
              <div>
                <Row>
                  <Col xs={12} lg={7} xxl={5}>
                    <ChangePasswordForm
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                      errors={errorsData}
                      btnText="Update"
                      btnVariant="btn btn-primary"
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

export default withModal(UserChangePassword);
