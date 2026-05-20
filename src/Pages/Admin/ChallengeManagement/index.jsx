import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import withFilters from "../../../HOC/withFilters";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { clickableTableRowNavProps, serialNum } from "../../../Utils/helper";
import withModal from "../../../HOC/withModal";
import { challengeHeaders } from "../../../Config/TableHeaders";
import { Select } from "../../../Components/Select";
import { statusOptions } from "../../../Config/TableStatus";
import { getAll, post } from "../../../Services/Api";

const ChallengeManagement = ({
  showModal,
  filters,
  setFilters,
  pagination,
  updatePagination,
}) => {
  const { t } = useTranslation();
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();

  const fetchRows = async () => {
    // startSubmitting(true);

    // const data = STATIC_CHALLENGES.filter((r) => !filters.search || r.title.toLowerCase().includes((filters.search || '').toLowerCase()));
    // setRows(data);
    // const total = data.length;
    // updatePagination({ showData: Math.min(total, filters.per_page), currentPage: filters.page, totalRecords: total, totalPages: Math.max(1, Math.ceil(total / (filters.per_page || 10))) });
    // stopSubmitting(false);
    try {
      startSubmitting(true);
      const response = await getAll(`/challenges`, filters);
      if (response?.status) {
        const data = response?.data || [];
        const meta = response?.meta || {};
        setRows(data);

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
    } catch (e) {
      console.log(e, "Error in fetching challenges");
    } finally {
      stopSubmitting(false);
    }
  };

  useEffect(() => {
    fetchRows(); /* eslint-disable-next-line */
  }, [filters]);

  // const handleStatusChange = (e, id) => {
  //     const next = e;
  //     showModal(
  //         null,
  //         `Are you sure you want to change this challenge status to ${next == "1" ? "Active" : "Inactive"}?`,
  //         () => {
  //             setRows((prev) => prev.map((c) => (c.id === id ? { ...c, status: Number(next) } : c)));
  //             showModal(null, `Challenge status has been changed to ${next == "1" ? "Active" : "Inactive"} successfully.`, null, true);
  //         }
  //     );
  // };

  const handleStatusChange = (e, id) => {
    const newStatusValue = e;
    showModal(
      null,
      `Are you sure you want to ${newStatusValue == "1" ? "Active" : "Inactive"} Challenge?`,
      () => onConfirmStatusChange(id, newStatusValue),
    );
  };

  const onConfirmStatusChange = async (id, newStatusValue) => {
    await post(`/challenge/${id}/status`);
    fetchRows();
    showModal(
      null,
      `Challenge has been ${newStatusValue == "1" ? "Activeted" : "Deactivated"} successfully.`,
      null,
      true,
    );
  };

  const labelType = (type) => type?.charAt(0)?.toUpperCase() + type?.slice(1);

  return (
    <DashboardLayout pageTitle={t('sidebar.challenge_management')}>
      <div className="container-fluid">
        <div className="dashCard">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="mainTitle mb-0">{t('sidebar.challenge_management')}</h2>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/admin/challenges/add`)}
            >
              Add New Challenge
            </button>
          </div>
          <CustomTable
            filters={filters}
            setFilters={setFilters}
            loading={isSubmitting}
            headers={challengeHeaders}
            pagination={pagination}
            dateFilters={[
              {
                title: "Date",
                from: "from",
                to: "to",
                fromTitle: "From",
                toTitle: "To",
              },
            ]}
            selectOptions={[
              {
                main_title: "Filter by status",
                title: "status",
                options: [
                  { value: "", text: "All" },
                  { value: "1", text: "Active" },
                  { value: "0", text: "Inactive" },
                ],
              },
            ]}
          >
            <tbody>
              {rows.map((item, index) => (
                <tr
                  key={item.id}
                  {...clickableTableRowNavProps(
                    navigate,
                    `/admin/challenges/${item.id}`,
                  )}
                >
                  <td>
                    {serialNum(
                      (filters.page - 1) * filters.per_page + index + 1,
                    )}
                  </td>
                  <td>{item?.title}</td>
                  <td>{labelType(item?.type)}</td>
                  <td>{item?.created_at}</td>
                  <td>{item?.duration} hours</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <Select
                      className={`tabel-select status${item?.status ? "Active" : "Inactive"}`}
                      id={`status-ch-${item?.id}`}
                      name="status"
                      value={item?.status ? "1" : "0"}
                      onChange={(e) => handleStatusChange(e, item?.id)}
                      isInputNeeded={false}
                    >
                      {statusOptions}
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </CustomTable>
        </div>
      </div>
    </DashboardLayout>
  );
};

const additionalFilters = { from: "", to: "" };
export default withModal(withFilters(ChallengeManagement, additionalFilters));
