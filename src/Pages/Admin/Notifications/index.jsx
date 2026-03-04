import "./style.css";
import ConsolidatedNotifications from "../../../Components/ConsolidatedNotifications";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";

const Notifications = () => {
  const apiEndpoint = `/notification/all/list`;
  return (
    <DashboardLayout pageTitle="Notifications">
      <div className="dashCard container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="mainTitle">Notifications</h2>
          </div>
        </div>
        <ConsolidatedNotifications apiEndpoint={apiEndpoint} />
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
