import { Form, Formik } from "formik";
import { Col, Container, Row } from "react-bootstrap";
import { userContactValidationSchema } from "../../../Config/Validations";
// import { Form } from 'react-router-dom';
import CustomButton from "../../../Components/CustomButton";
import CustomInput from "../../../Components/CustomInput";
import PageTitle from "../../../Components/PageTitle";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { usePageTitle, usePageTitleUser } from "../../../Utils/helper";
import withModal from "../../../HOC/withModal";
import "./style.css";

const ContactUs = ({ showModal }) => {
  usePageTitleUser("Contact Us");
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus(); // use your custom hook
  const handleSubmit = async (values, { resetForm }) => {
    startSubmitting();
    // console.log("submit Forms Value", values);
    showModal("", "Your message has been submitted successfully.", null, true);
    stopSubmitting();
    resetForm();
  };

  return (
    <>
      <section className="py-5 contact-page">
        <h2 className="fw-semibold text-center mb-3 page-title">Contact Us</h2>
        <Container fluid>
          <Row>
            <Col xs={12} xl={9} lg={10} className="mx-auto">
              <div className="form-card px-md-0 px-3">
                <Row>
                  <Col xs={12} md={10} xl={8} xxl={6} className="mx-auto">
                    <p className="text-center" style={{ color: "#666764" }}>
                      Please let us know how we can improve your experience
                    </p>
                    <Formik
                      initialValues={{
                        full_name: "",
                        email_address: "",
                        subject: "",
                        message: "",
                      }}
                      validationSchema={userContactValidationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                      }) => (
                        <Form>
                          <Row>
                            <Col xs={12} className="mb-2 mb-lg-2 mb-xxl-2">
                              <CustomInput
                                label="Full Name"
                                id="full_name"
                                type="text"
                                required
                                placeholder="Enter Full Name"
                                labelclass="mainLabel"
                                // inputclass="mainInput mainInputLogIn"
                                value={values.full_name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.full_name && errors.full_name}
                              />
                            </Col>
                            <Col xs={12} className="mb-2 mb-lg-2 mb-xxl-2">
                              <CustomInput
                                label="Email Address"
                                id="email_address"
                                type="email"
                                required
                                placeholder="Enter Email Address"
                                labelclass="mainLabel"
                                // inputclass="mainInput mainInputLogIn"
                                value={values.email_address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  touched.email_address && errors.email_address
                                }
                              />
                            </Col>
                            <Col xs={12} className="mb-2 mb-lg-2 mb-xxl-2">
                              <CustomInput
                                label="Subject"
                                id="subject"
                                type="text"
                                required
                                placeholder="Enter Subject"
                                labelclass="mainLabel"
                                // inputclass="mainInput mainInputLogIn"
                                value={values.subject}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.subject && errors.subject}
                              />
                            </Col>
                            <Col xs={12} className="mb-2 mb-lg-2 mb-xxl-2">
                              <CustomInput
                                label="Message"
                                id="message"
                                type="textarea"
                                rows="7"
                                required
                                placeholder="Enter Message..."
                                labelclass="mainLabel"
                                // inputclass="mainInput mainInputLogIn rounded-4"
                                value={values.message}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.message && errors.message}
                              />
                            </Col>
                            <Col xs={12} className="mt-2 mt-lg-2">
                              <CustomButton
                                variant="primary"
                                className="w-100"
                                text="Submit"
                                pendingText="Loading..."
                                // isPending={isSubmitting}
                                type="submit"
                              />
                            </Col>
                          </Row>
                        </Form>
                      )}
                    </Formik>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default withModal(ContactUs);
