import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import withFilters from "../../../HOC/withFilters";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { clickableTableRowNavProps, serialNum } from "../../../Utils/helper";
import { getAll } from "../../../Services/Api";
import { queryLogsHeaders } from "../../../Config/TableHeaders";

const QueryManagement = ({ filters, setFilters, pagination, updatePagination }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const fetchQueries = async () => {
    try {
      startSubmitting(true);
      const response = await getAll(`/feedbacks`, filters);
      if (response?.status) {
        const data = response?.data || [];
        setRows(data);

        const meta = response?.meta || {};
        const total = meta?.total ?? data?.length ?? 0;
        const per_page = meta?.per_page ?? Number(filters?.per_page || 10);
        const current_page = meta?.current_page ?? Number(filters?.page || 1);
        const to = meta?.to ?? Math.min(total, current_page * per_page);
        updatePagination({
          showData: to,
          currentPage: current_page,
          totalRecords: total,
          totalPages: Math.max(1, Math.ceil(total / per_page)),
        });
      }
    } catch (error) {
      console.error("Error fetching queries:", error);
    } finally {
      stopSubmitting(false);
    }
  };

  useEffect(() => {
    fetchQueries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <DashboardLayout pageTitle={t('sidebar.query_management')}>
      <div className="container-fluid">
        <div className="dashCard">
          <div className="row">
            <div className="col-12">
              <div className="row mb-2">
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <h2 className="mainTitle mb-0">{t('sidebar.query_management')}</h2>
                </div>
              </div>
              <CustomTable
                filters={filters}
                setFilters={setFilters}
                loading={isSubmitting}
                headers={queryLogsHeaders}
                pagination={pagination}
                dateFilters={[{ title: "Date", from: "from", to: "to", fromTitle: "From", toTitle: "To" }]}
              >
                <tbody>
                  {rows.map((item, index) => (
                    <tr
                      key={item.id}
                      {...clickableTableRowNavProps(
                        navigate,
                        `/admin/query-management/${item.id}`,
                      )}
                    >
                      <td>{serialNum((filters.page - 1) * filters.per_page + index + 1)}</td>
                      <td>{item?.name}</td>
                      <td>{item?.email}</td>
                      <td>{item?.subject}</td>
                      <td>{item?.message}</td>
                      <td>{item?.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </CustomTable>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

const additionalFilters = { from: "", to: "" };
export default withFilters(QueryManagement, additionalFilters);

