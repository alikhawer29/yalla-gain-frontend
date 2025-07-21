import { Formik } from "formik";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useNavigate } from "react-router";
import { images } from "../../../Assets";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import CustomButton from "../../../Components/CustomButton";
import CustomInput from "../../../Components/CustomInput";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import { adminProfileValidation } from "../../../Config/Validations";
import withModal from "../../../HOC/withModal";
import { useAuth } from "../../../Hooks/useAuth";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { validateImage } from "../../../Utils/helper";
import "./style.css";

const EditProfile = ({ showModal }) => {
  const navigate = useNavigate();
  const [imageObject, setImageObject] = useState({});
  const [profileData, setProfileData] = useState({});
  const [profilePic, setProfilePic] = useState();
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const { user } = useAuth();

  useEffect(() => {
    setProfileData(user);
    setProfilePic(user?.["photo-path"]);
  }, []);

  const handleImageChange = (e, setFieldValue, setFieldError) => {
    const file = e.target.files[0];
    if (validateImage(file)) {
      setFieldError("image", validateImage(file));
    } else {
      setFieldError("image", "");
      setProfilePic(URL.createObjectURL(file));
      setImageObject(file);
    }
  };

  const handleSubmit = async (values) => {
    startSubmitting();
    values.image = imageObject;
    showModal(
      "",
      `Profile has been updated successfully`,
      // null,
      () => navigate(`/admin/profile`),
      true
    );
    // let response = await post("/admin-api/account", values);
    // if (response.status) {
    //   showModal(
    //     `Profile updated successfully`,
    //     null,
    //     true,
    //     () => navigate(`/admin/profile`)
    //   );
    //   dispatch(setData(response.detail));
    // } else {
    //   console.log("error");
    // }
    stopSubmitting();
  };

  return (
    <>
      <DashboardLayout pageTitle="Edit Profile">
        <div className="dashCard my-4">
          <div className="row mt-3">
            <div className="col-12">
              <div className="d-flex align-items-center gap-2">
                <BackButton2 />
                <h2 className="mainTitle mb-0">Edit Profile</h2>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            {profileData ? (
              <div className="col-lg-8">
                {Object.keys(profileData).length > 0 && (
                  <Formik
                    initialValues={{
                      first_name: profileData.first_name || "",
                      last_name: profileData.last_name || "",
                      phone: profileData.phone || "",
                      email: profileData.email || "",
                    }}
                    validationSchema={adminProfileValidation}
                    onSubmit={handleSubmit}
                  >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setFieldError, setFieldTouched }) => {
                      return (
                        <form onSubmit={handleSubmit}>
                          <div className="row mb-3">
                            <div className="col-lg-4 mb-3 mt-4">
                              <div className="edit_profile_img">
                                <img src={profilePic ?? images.userImage} alt="User" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="d-none"
                                  id="profileImage"
                                  onChange={(event) => handleImageChange(event, setFieldValue, setFieldError)}
                                />
                                <label htmlFor="profileImage" className="upload-btn">
                                  <images.CameraIconOutline />
                                </label>
                                {errors.image && <div className="errorText red-text">{errors.image}</div>}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-8">
                              <div className="row mb-3">
                                <div className="col-12 my-1">
                                  <CustomInput
                                    label="First Name"
                                    labelclass="mainLabel"
                                    type="text"
                                    required
                                    placeholder="Enter First Name"
                                    inputclass="mb-3"
                                    id="first_name"
                                    value={values.first_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.first_name && errors.first_name ? errors.first_name : null}
                                  />
                                </div>
                                <div className="col-12 my-1">
                                  <CustomInput
                                    label="Last Name"
                                    labelclass="mainLabel"
                                    type="text"
                                    required
                                    placeholder="Enter Last Name"
                                    inputclass="mb-3"
                                    id="last_name"
                                    value={values.last_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.last_name && errors.last_name}
                                  />
                                </div>
                                <div className="col-12 my-1">
                                  <label htmlFor="phoneInput" className="mainLabel">
                                    Contact number<span className="text-danger">*</span>
                                  </label>
                                  <PhoneInput
                                    defaultCountry="US"
                                    placeholder="Enter phone number"
                                    value={values.phone}
                                    onChange={(phone) => setFieldValue("phone", phone)}
                                    onBlur={() => setFieldTouched("phone", true)}
                                    className="form-control mb-3"
                                  />
                                  {touched.phone && errors.phone ? <div className="text-danger">{errors.phone}</div> : null}
                                </div>
                                <div className="col-12 my-1">
                                  <label className="mainLabel mb-0">Email Address</label>
                                  <p className="grayColor">{values?.email}</p>
                                </div>
                              </div>

                              <div className="row mt-4">
                                <div className="col-md-4">
                                  <CustomButton
                                    variant="btn btn-primary"
                                    className="min-width-190"
                                    text="Update"
                                    pendingText="Submitting..."
                                    isPending={isSubmitting}
                                    type="submit"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      );
                    }}
                  </Formik>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default withModal(EditProfile);
