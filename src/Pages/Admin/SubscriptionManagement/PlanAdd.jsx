import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import withModal from "../../../HOC/withModal";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { showToast } from "../../../Components/Toast";
import { subscriptionPlanSchema } from "../../../Config/Validations";
import { post } from "../../../Services/Api";
import { buildPlanPayload, getInitialPlanValues } from "./planFormHelpers";
import PlanForm from "./PlanForm";

const PlanAdd = ({ showModal }) => {
  const navigate = useNavigate();
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const handleSubmit = async (values) => {
    startSubmitting();
    const response = await post("/plan", buildPlanPayload(values));

    if (response.status) {
      showModal(
        "Successfully",
        "New Plan has been Created Successfully",
        () => navigate("/admin/subscriptions/plans"),
        true,
      );
    } else {
      showToast(response?.message ?? "Something went wrong", "error");
    }

    stopSubmitting();
  };

  return (
    <DashboardLayout pageTitle={t('sidebar.subscription_management')}>
      <div className="container-fluid">
        <div className="dashCard">
          <div className="row">
            <div className="col-12">
              <h2 className="mainTitle mb-4">
                <BackButton2 />
                Add New Plan
              </h2>
              <Formik
                initialValues={getInitialPlanValues("free", null)}
                validationSchema={subscriptionPlanSchema}
                onSubmit={handleSubmit}
              >
                {(formik) => (
                  <form className="row" onSubmit={formik.handleSubmit}>
                    <div className="col-12 col-xl-10 col-xxl-9">
                      <PlanForm
                        {...formik}
                        isSubmitting={isSubmitting}
                        submitText="Create Plan"
                        pendingText="Submitting..."
                      />
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withModal(PlanAdd);
