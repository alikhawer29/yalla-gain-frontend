import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./style.css";
import BackButton2 from "../../../BackButton/BackButton2";

export const UserAuthLayout = (props) => {
  return (
    <>
      <section className={`user-login`}>
        <Container fluid>
          <Row>
            <Col xs={12} lg={12} xxl={10} className="mx-auto">
              <Row className="row justify-content-center authBox align-items-center">
                <div className="col-lg-8 col-md-10 col-xxl-6">
                  <div className="authFormWrapper">
                    <div className="authForm">
                      {props?.authBack && <BackButton2 />}
                      <div className="authFormHeader mb-sm-5 mb-3 text-center">
                        <h2 className="authTitle">{props?.authTitle}</h2>
                        {props?.authMain && (
                          <p className="authPara ">{props?.authPara}</p>
                        )}
                      </div>
                      {props?.children}
                      {props?.backOption && (
                        <div className="text-center mt-4">
                          <Link
                            to={`/login`}
                            className="underlineOnHover grayLightColor"
                          >
                            Back to <span className="text-dark">Login</span>
                          </Link>
                        </div>
                      )}
                      {props?.dontHaveAcc && (
                        <p className="mt-4 mb-0 fw-medium text-center text-capitalize grayLightColor">
                          Don't have an account ?{" "}
                          <Link
                            to={"/signup"}
                            className="underlineOnHover text-dark"
                          >
                            Sign Up
                          </Link>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};
