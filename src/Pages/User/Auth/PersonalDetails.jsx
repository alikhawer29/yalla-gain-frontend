import { FieldArray, Formik } from "formik";
import { UserAuthLayout } from "../../../Components/Layouts/UserLayout/AuthLayout";
import { Select } from "../../../Components/Select";
import CustomInput from "../../../Components/CustomInput";
import AddIcon from "../../../Assets/images/svg/addIcon.svg?react";
import DeleteIcon from "../../../Assets/images/svg/deleteIcon.svg?react";
import { usePageTitleUser } from "../../../Utils/helper";
import ImageUpload from "../../../Components/UploadAndDisplayImage/UploadAndDisplayImage";
import { personalDetailsValidationSchema } from "../../../Config/Validations";
import CustomButton from "../../../Components/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import CustomModal from "../../../Components/CustomModal";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { Container, Row, Col } from "react-bootstrap";

const PersonalDetails = () => {
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();
  usePageTitleUser("Personal Details");
  const handleSubmit = async (values, { resetForm }) => {
    // console.log("details", values);
    resetForm();
    setModal(true);
  };
  return (
    <section className={`user-login`}>
      <Container fluid>
        <Row>
          <Col xs={12} lg={12} xxl={10} className="mx-auto">
            <Row className="row justify-content-center authBox align-items-center">
              <div className="col-lg-8 col-md-10 col-xxl-6">
                <div className="authFormWrapper">
                  <div className="authForm">
                    <div className="d-flex flex-wrap">
                      <BackButton2 />
                      <h2 className="authTitle mb-0 mx-auto">
                        Personal Details
                      </h2>
                    </div>
                    <Formik
                      initialValues={{
                        about: "",
                        category: "",
                        educationDetails: [
                          {
                            institution_name: "",
                            degree_title: "",
                            edu_details_from: "",
                            edu_details_to: "",
                          },
                        ],
                        workExperience: [
                          {
                            organization_name: "",
                            designation: "",
                            wokr_exp_from: "",
                            wokr_exp_to: "",
                          },
                        ],
                        certificationDetails: [
                          {
                            institution_name: "",
                            certificate_title: "",
                            certificate_pic: [],
                          },
                        ],
                      }}
                      validationSchema={personalDetailsValidationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldTouched,
                        setFieldValue,
                      }) => (
                        <form className="mt-3" onSubmit={handleSubmit}>
                          <div className="inputWrapper position-relative">
                            <Select
                              label="Select Category"
                              labelclass="mainLabel"
                              required
                              id="category"
                              name="category"
                              wrapperClass="d-block mb-3"
                              mainLabel="Select Category"
                              value={values.category}
                              onChange={(value) =>
                                handleChange({
                                  target: { name: "category", value },
                                })
                              } // Adapting to Formik
                              onBlur={handleBlur}
                              error={touched.category && errors.category}
                            >
                              {[
                                {
                                  value: "abc",
                                  text: "abc",
                                },
                                {
                                  value: "abc",
                                  text: "abc",
                                },
                              ]}
                            </Select>
                          </div>
                          <div className="mb-3">
                            <CustomInput
                              label="About Yourself"
                              id="about"
                              type="textarea"
                              required
                              placeholder="Add About Yourself"
                              labelclass="mainLabel"
                              value={values.about}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={touched.about && errors.about}
                            />
                          </div>
                          <FieldArray name="educationDetails">
                            {({ push, remove }) => (
                              <>
                                {values.educationDetails.map((edu, index) => (
                                  <div key={index} className="mb-4">
                                    <h3 className="fw-bold">
                                      Educational Details {index + 1}
                                    </h3>
                                    {/* Delete button */}
                                    {values.educationDetails.length > 1 && (
                                      <div className="text-end">
                                        <button
                                          type="button"
                                          className="bg-transparent border-0"
                                          onClick={() => remove(index)}
                                        >
                                          <div className="d-flex align-items-center gap-1">
                                            <span>
                                              <DeleteIcon />
                                            </span>
                                            <span className="mt-1">Delete</span>
                                          </div>
                                        </button>
                                      </div>
                                    )}
                                    <div className="mb-3">
                                      <CustomInput
                                        label="Institution Name"
                                        id={`educationDetails.${index}.institution_name`}
                                        type="text"
                                        required
                                        placeholder="Enter Institution Name"
                                        labelclass="mainLabel"
                                        value={
                                          values.educationDetails[index]
                                            .institution_name
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                          touched.educationDetails &&
                                          touched.educationDetails[index]
                                            ?.institution_name &&
                                          errors.educationDetails &&
                                          errors.educationDetails[index]
                                            ?.institution_name
                                        }
                                      />
                                    </div>
                                    <div className="mb-3">
                                      <CustomInput
                                        label="Degree Title"
                                        id={`educationDetails.${index}.degree_title`}
                                        type="text"
                                        required
                                        placeholder="Enter Degree Title"
                                        labelclass="mainLabel"
                                        value={
                                          values.educationDetails[index]
                                            .degree_title
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                          touched.educationDetails &&
                                          touched.educationDetails[index]
                                            ?.degree_title &&
                                          errors.educationDetails &&
                                          errors.educationDetails[index]
                                            ?.degree_title
                                        }
                                      />
                                    </div>
                                    <div className="mb-3">
                                      <CustomInput
                                        label="From"
                                        id={`educationDetails.${index}.edu_details_from`}
                                        type="date"
                                        required
                                        placeholder="Enter Date"
                                        labelclass="mainLabel"
                                        value={
                                          values.educationDetails[index]
                                            .edu_details_from
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                          touched.educationDetails &&
                                          touched.educationDetails[index]
                                            ?.edu_details_from &&
                                          errors.educationDetails &&
                                          errors.educationDetails[index]
                                            ?.edu_details_from
                                        }
                                      />
                                    </div>
                                    <div className="mb-3">
                                      <CustomInput
                                        label="To"
                                        id={`educationDetails.${index}.edu_details_to`}
                                        type="date"
                                        required
                                        placeholder="Enter Date"
                                        labelclass="mainLabel"
                                        value={
                                          values.educationDetails[index]
                                            .edu_details_to
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                          touched.educationDetails &&
                                          touched.educationDetails[index]
                                            ?.edu_details_to &&
                                          errors.educationDetails &&
                                          errors.educationDetails[index]
                                            ?.edu_details_to
                                        }
                                      />
                                    </div>
                                  </div>
                                ))}
                                {/* Add More button */}
                                <button
                                  type="button"
                                  className="bg-transparent border-0"
                                  onClick={() =>
                                    push({
                                      institution_name: "",
                                      degree_title: "",
                                      edu_details_from: "",
                                      edu_details_to: "",
                                    })
                                  }
                                >
                                  <div className="d-flex align-items-center gap-1">
                                    <span>
                                      <AddIcon />
                                    </span>
                                    <span className="mt-1">Add More</span>
                                  </div>
                                </button>
                              </>
                            )}
                          </FieldArray>
                          <FieldArray name="workExperience">
                            {({ push, remove }) => (
                              <>
                                {values.workExperience.map((edu, index) => (
                                  <div key={index} className="mb-4 mt-4">
                                    <h3 className="fw-bold">
                                      Work Experience {index + 1}
                                    </h3>
                                    {/* Delete button */}
                                    {values.workExperience.length > 1 && (
                                      <div className="text-end">
                                        <button
                                          type="button"
                                          className="bg-transparent border-0"
                                          onClick={() => remove(index)}
                                        >
                                          <div className="d-flex align-items-center gap-1">
                                            <span>
                                              <DeleteIcon />
                                            </span>
                                            <span className="mt-1">Delete</span>
                                          </div>
                                        </button>
                                      </div>
                                    )}
                                    <div className="mb-3">
                                      <CustomInput
                                        label="Organization Name"
                                        id={`workExperience.${index}.organization_name`}
                                        type="text"
                                        required
                                        placeholder="Enter Organization Name"
                                        labelclass="mainLabel"
                                        value={
                                          values.workExperience[index]
                                            .organization_name
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                          touched.workExperience &&
                                          touched.workExperience[index]
                                            ?.organization_name &&
                                          errors.workExperience &&
                                          errors.workExperience[index]
                                            ?.organization_name
                                        }
                                      />
                                    </div>
                                    <div className="mb-3">
                                      <CustomInput
                                        label="Designation"
                                        id={`workExperience.${index}.designation`}
                                        type="text"
                                        required
                                        placeholder="Enter Designation"
                                        labelclass="mainLabel"
                                        value={
                                          values.workExperience[index]
                                            .designation
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                          touched.workExperience &&
                                          touched.workExperience[index]
                                            ?.designation &&
                                          errors.workExperience &&
                                          errors.workExperience[index]
                                            ?.designation
                                        }
                                      />
                                    </div>
                                    <div className="mb-3">
                                      <CustomInput
                                        label="From"
                                        id={`workExperience.${index}.wokr_exp_from`}
                                        type="date"
                                        required
                                        placeholder="Enter Date"
                                        labelclass="mainLabel"
                                        value={
                                          values.workExperience[index]
                                            .wokr_exp_from
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                          touched.workExperience &&
                                          touched.workExperience[index]
                                            ?.wokr_exp_from &&
                                          errors.workExperience &&
                                          errors.workExperience[index]
                                            ?.wokr_exp_from
                                        }
                                      />
                                    </div>
                                    <div className="mb-3">
                                      <CustomInput
                                        label="To"
                                        id={`workExperience.${index}.wokr_exp_to`}
                                        type="date"
                                        required
                                        placeholder="Enter Date"
                                        labelclass="mainLabel"
                                        value={
                                          values.workExperience[index]
                                            .wokr_exp_to
                                        }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={
                                          touched.workExperience &&
                                          touched.workExperience[index]
                                            ?.wokr_exp_to &&
                                          errors.workExperience &&
                                          errors.workExperience[index]
                                            ?.wokr_exp_to
                                        }
                                      />
                                    </div>
                                  </div>
                                ))}
                                {/* Add More button */}
                                <button
                                  type="button"
                                  className="bg-transparent border-0"
                                  onClick={() =>
                                    push({
                                      organization_name: "",
                                      designation: "",
                                      wokr_exp_from: "",
                                      wokr_exp_to: "",
                                    })
                                  }
                                >
                                  <div className="d-flex align-items-center gap-1">
                                    <span>
                                      <AddIcon />
                                    </span>
                                    <span className="mt-1">Add More</span>
                                  </div>
                                </button>
                              </>
                            )}
                          </FieldArray>
                          <FieldArray name="certificationDetails">
                            {({ push, remove }) => (
                              <>
                                {values.certificationDetails.map(
                                  (edu, index) => (
                                    <div key={index} className="mb-4 mt-4">
                                      <h3 className="fw-bold">
                                        Certification Detail {index + 1}
                                      </h3>
                                      {/* Delete button */}
                                      {values.certificationDetails.length >
                                        1 && (
                                        <div className="text-end">
                                          <button
                                            type="button"
                                            className="bg-transparent border-0"
                                            onClick={() => remove(index)}
                                          >
                                            <div className="d-flex align-items-center gap-1">
                                              <span>
                                                <DeleteIcon />
                                              </span>
                                              <span className="mt-1">
                                                Delete
                                              </span>
                                            </div>
                                          </button>
                                        </div>
                                      )}
                                      <div className="mb-3">
                                        <CustomInput
                                          label="Institution Name"
                                          id={`certificationDetails.${index}.institution_name`}
                                          type="text"
                                          required
                                          placeholder="Enter Institution Name"
                                          labelclass="mainLabel"
                                          value={
                                            values.certificationDetails[index]
                                              .institution_name
                                          }
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          error={
                                            touched.certificationDetails &&
                                            touched.certificationDetails[index]
                                              ?.institution_name &&
                                            errors.certificationDetails &&
                                            errors.certificationDetails[index]
                                              ?.institution_name
                                          }
                                        />
                                      </div>
                                      <div className="mb-3">
                                        <CustomInput
                                          label="Certificate Title"
                                          id={`certificationDetails.${index}.certificate_title`}
                                          type="text"
                                          required
                                          placeholder="Enter Certificate Title"
                                          labelclass="mainLabel"
                                          value={
                                            values.certificationDetails[index]
                                              .certificate_title
                                          }
                                          onChange={handleChange}
                                          onBlur={handleBlur}
                                          error={
                                            touched.certificationDetails &&
                                            touched.certificationDetails[index]
                                              ?.certificate_title &&
                                            errors.certificationDetails &&
                                            errors.certificationDetails[index]
                                              ?.certificate_title
                                          }
                                        />
                                      </div>
                                      <div className="image-upload-style-2 mt-3">
                                        <ImageUpload
                                          id={`certificationDetails.${index}.certificate_pic`}
                                          placeholder="Upload Certificate Picture"
                                          label={`Certificate Picture`}
                                          onChange={(files) =>
                                            setFieldValue(
                                              `certificationDetails.${index}.certificate_pic`,
                                              files
                                            )
                                          }
                                          numberOfFiles={1}
                                          errorFromParent={
                                            touched.certificationDetails &&
                                            touched.certificationDetails[index]
                                              ?.certificate_pic &&
                                            errors.certificationDetails &&
                                            errors.certificationDetails[index]
                                              ?.certificate_pic
                                          }
                                          className="image-upload-style-2"
                                          required
                                        />
                                      </div>
                                    </div>
                                  )
                                )}
                                {/* Add More button */}
                                <button
                                  type="button"
                                  className="bg-transparent border-0"
                                  onClick={() =>
                                    push({
                                      institution_name: "",
                                      degree_title: "",
                                      certificate_pic: [],
                                    })
                                  }
                                >
                                  <div className="d-flex align-items-center gap-1">
                                    <span>
                                      <AddIcon />
                                    </span>
                                    <span className="mt-1">Add More</span>
                                  </div>
                                </button>
                              </>
                            )}
                          </FieldArray>
                          <CustomButton
                            variant="primary"
                            className="w-100 mt-4"
                            text="Signup"
                            type="submit"
                          />
                          <p className="mt-4 fw-medium text-center text-capitalize grayLightColor">
                            Already have an account?
                            <Link
                              to={"/login"}
                              className="underlineOnHover text-dark ps-1"
                            >
                              Login
                            </Link>
                          </p>
                        </form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </Row>
          </Col>
        </Row>
      </Container>
      <CustomModal
        show={modal}
        action={() => {
          setModal(false);
          navigate("/screening");
        }}
        close={() => setModal(false)}
        success
        para="Profile has been created successfully. Please wait for the admin approval."
        btnText="Okay"
      />
    </section>
  );
};

export default PersonalDetails;
