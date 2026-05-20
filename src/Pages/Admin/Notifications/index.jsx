import { useTranslation } from "react-i18next";
import "./style.css";
import ConsolidatedNotifications from "../../../Components/ConsolidatedNotifications";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";

const Notifications = () => {
  const apiEndpoint = `/notification/all/list`;
  return (
    <DashboardLayout pageTitle={t('pages.notifications')}>
      <div className="dashCard container-fluid">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="mainTitle">{t('pages.notifications')}</h2>
          </div>
        </div>
        <ConsolidatedNotifications apiEndpoint={apiEndpoint} />
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
