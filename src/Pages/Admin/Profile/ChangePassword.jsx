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
import { showToast } from "../../../Components/Toast";

const ChangePassword = ({ showModal }) => {
    const navigate = useNavigate();
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
    const [errorsData, setErrorsData] = useState({});

    const handleSubmit = async (values) => {
        startSubmitting();
        let response = await post("/change-password", values);
        if (response.status) {
            showModal(
                null,
                `Password has been changed successfully!`,
                () => navigate(-1),
                true
            );
        } else {
            showToast(response?.message ?? "Something went wrong", "error");
        }
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
