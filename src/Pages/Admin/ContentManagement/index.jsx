import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import withFilters from "../../../HOC/withFilters";
import withModal from "../../../HOC/withModal";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { clickableTableRowNavProps, serialNum } from "../../../Utils/helper";
import { Select } from "../../../Components/Select";
import { statusOptions } from "../../../Config/TableStatus";
import { getAll, post } from "../../../Services/Api";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { contentHeaders } from "../../../Config/TableHeaders";

const ContentManagement = ({
  showModal,
  filters,
  setFilters,
  pagination,
  updatePagination,
}) => {
  const [rows, setRows] = useState([]);
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const navigate = useNavigate();

  const fetchContents = async () => {
    try {
      startSubmitting(true);
      const response = await getAll(`/workout-contents`, filters);
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
      // silently ignore; toast can be added
    } finally {
      stopSubmitting(false);
    }
  };

  useEffect(() => {
    fetchContents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleStatusChange = (e, id) => {
    const newStatusValue = e;
    showModal(
      null,
      `Are you sure you want to change this content's status to ${newStatusValue == "1" ? "Active" : "Inactive"}?`,
      () => onConfirmStatusChange(id, newStatusValue),
    );
  };

  const onConfirmStatusChange = async (id, newStatusValue) => {
    await post(`/workout-content/${id}/status`);
    fetchContents();
    showModal(
      null,
      `Content status has been changed to ${newStatusValue == "1" ? "Active" : "Inactive"} successfully.`,
      null,
      true,
    );
  };

  return (
    <DashboardLayout pageTitle="Content Management">
      <div className="container-fluid">
        <div className="dashCard">
          <div className="row">
            <div className="col-12">
              <div className="row mb-2">
                <div className="col-12 d-flex justify-content-between align-items-center">
                  <h2 className="mainTitle mb-0">Content Management</h2>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate("/admin/content-management/add")}
                  >
                    Add Content
                  </button>
                </div>
              </div>
              <CustomTable
                filters={filters}
                setFilters={setFilters}
                loading={isSubmitting}
                headers={contentHeaders}
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
                        `/admin/content-management/${item.id}`,
                      )}
                    >
                      <td>
                        {serialNum(
                          (filters.page - 1) * filters.per_page + index + 1,
                        )}
                      </td>
                      <td>{item?.title}</td>
                      <td>{item?.exercise_key}</td>
                      {/* <td>
                                                {item?.image ? (
                                                    <img src={item.image} alt={item.title} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }} />
                                                ) : (
                                                    "-"
                                                )}
                                            </td> */}
                      <td>{item?.created_at}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <Select
                          className={`tabel-select status${item?.status ? "Active" : "Inactive"}`}
                          id={`status${item?.id}`}
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
        </div>
      </div>
    </DashboardLayout>
  );
};

const additionalFilters = { from: "", to: "" };
export default withModal(withFilters(ContentManagement, additionalFilters));
