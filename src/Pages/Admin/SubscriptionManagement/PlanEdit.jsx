import { useEffect, useState } from "react";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import withModal from "../../../HOC/withModal";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { subscriptionPlanSchema } from "../../../Config/Validations";
import { getDetails, post } from "../../../Services/Api";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import {
  buildPlanPayload,
  getInitialPlanValues,
  mapPlanToForm,
} from "./planFormHelpers";
import PlanForm from "./PlanForm";

const PlanEdit = ({ showModal }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const [form, setForm] = useState(() => getInitialPlanValues("gold", "monthly"));

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDetails(`/plan/${id}`);
        if (res?.status) {
          setForm(mapPlanToForm(res.data || {}));
        }
      } catch (e) {
        // ignore
      }
    };
    load();
  }, [id]);

  return (
    <DashboardLayout pageTitle="Subscription Management">
      <div className="container-fluid">
        <div className="dashCard">
          <div className="row">
            <div className="col-12">
              <h2 className="mainTitle mb-4">
                <BackButton2 />
                Edit Plan
              </h2>
              <Formik
                initialValues={form}
                validationSchema={subscriptionPlanSchema}
                enableReinitialize
                onSubmit={async (values) => {
                  startSubmitting();
                  await post(`/plan/${id}/update`, buildPlanPayload(values));
                  stopSubmitting();
                  showModal(
                    "Successfully",
                    "Plan has been updated Successfully",
                    () => navigate(`/admin/subscriptions/plans/${id}`),
                    true,
                  );
                }}
              >
                {(formik) => (
                  <form className="row" onSubmit={formik.handleSubmit}>
                    <div className="col-12 col-xl-10 col-xxl-9">
                      <PlanForm
                        {...formik}
                        isSubmitting={isSubmitting}
                        submitText="Update Plan"
                        pendingText="Updating..."
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

export default withModal(PlanEdit);
