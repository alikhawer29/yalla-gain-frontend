import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import withModal from "../../../HOC/withModal";
import CustomButton from "../../../Components/CustomButton";
import { Select } from "../../../Components/Select";
import { getDetails, post } from "../../../Services/Api";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { statusOptions } from "../../../Config/TableStatus";
import PlanViewDetails from "./PlanViewDetails";
import "./style.css";

const PlanView = ({ showModal }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);

  const fetchPlan = useCallback(async () => {
    try {
      const res = await getDetails(`/plan/${id}`);
      if (res?.status) {
        setPlan(res.data);
      }
    } catch (e) {
      // silently ignore
    }
  }, [id]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const handleStatusChange = (newStatusValue) => {
    showModal(
      `Mark as ${newStatusValue === "1" ? "Active" : "Inactive"}`,
      `Are you sure you want to change this plan's status to ${
        newStatusValue === "1" ? "Active" : "Inactive"
      }?`,
      () => onConfirmStatusChange(newStatusValue),
    );
  };

  const onConfirmStatusChange = async (newStatusValue) => {
    await post(`/plan/${id}/status`, { status: newStatusValue });
    await fetchPlan();
    showModal(
      "Successful",
      `Plan status has been changed to ${
        newStatusValue === "1" ? "Active" : "Inactive"
      } successfully.`,
      null,
      true,
    );
  };

  const isActive = plan?.status === 1 || plan?.status === "1";

  return (
    <DashboardLayout pageTitle="Subscription Management">
      <div className="container-fluid">
        <div className="dashCard">
          <div className="row">
            <div className="col-12">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <h2 className="mainTitle mb-0">
                  <BackButton2 />
                  View Plan
                </h2>
                <div className="d-flex align-items-center gap-2">
                  <Select
                    className={`tabel-select status${isActive ? "Active" : "Inactive"}`}
                    id={`status${id}`}
                    name="status"
                    label=""
                    value={isActive ? "1" : "0"}
                    onChange={handleStatusChange}
                    labelclass="me-2 mb-0"
                    disabled={!plan}
                  >
                    {statusOptions}
                  </Select>
                </div>
              </div>

              <div className="row plan-view">
                <div className="col-12 col-xl-10 col-xxl-9">
                  <PlanViewDetails plan={plan} />
                  <div className="mt-4">
                    <CustomButton
                      onClick={() =>
                        navigate(`/admin/subscriptions/plans/${id}/edit`)
                      }
                      variant="primary"
                      text="Update Plan"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withModal(PlanView);
