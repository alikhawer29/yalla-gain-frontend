import { useState } from "react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import BackButton from "../../../Components/BackButton";
import "./style.css";
import { post } from "../../../Services/Api";
import ChangePasswordForm from "../../../Components/ChangePasswordForm";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import withModal from "../../../HOC/withModal";
import BackButton2 from "../../../Components/BackButton/BackButton2";

const ChangePassword = ({ showModal }) => {
  const navigate = useNavigate();
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const [errorsData, setErrorsData] = useState({});

  const handleSubmit = async (values) => {
    startSubmitting();
    showModal("", `password Has Been updated Successfully!`, () => navigate(-1), true);
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
    <>
      <DashboardLayout pageTitle="Change Password">
        <div className="dashCard my-4">
          <div className="row mb-3">
            <div className="col-12">
              <div className="d-flex align-items-center gap-2">
              <BackButton2 />
              <h2 className="mainTitle mb-0">Change Password</h2>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-9 col-lg-7 col-xl-5 ">
              <ChangePasswordForm onSubmit={handleSubmit} isSubmitting={isSubmitting} errors={errorsData} />
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default withModal(ChangePassword);
