import "./style.css";
import ConsolidatedNotifications from "../../../Components/ConsolidatedNotifications";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomPagination from "../../../Components/CustomPagination";

const Notifications = () => {
  const apiEndpoint = `/admin-api/notifications`;
  return (
  
  <DashboardLayout pageTitle="Notifications">
   
  <div className="dashCard container-fluid">
     <div className="row mb-4">
      <div className="col-12">
        <h2 className="mainTitle">Notifications</h2>
      </div>
    </div>
    <ConsolidatedNotifications apiEndpoint={apiEndpoint} />  
    <CustomPagination 
    pagination={`pagination`} 
    setFilters={`setFilters`} 
    />
  </div>
</DashboardLayout>
  )
};

export default Notifications;
