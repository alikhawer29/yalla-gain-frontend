import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import withFilters from "../../../HOC/withFilters";
import withModal from "../../../HOC/withModal";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { clickableTableRowNavProps, serialNum } from "../../../Utils/helper";
import { Select } from "../../../Components/Select";
import { statusOptions } from "../../../Config/TableStatus";
import { serviceCategoryHeaders } from "../../../Config/TableHeaders";
import { getAll, post } from "../../../Services/Api";

const formatType = (value = "") => {
  if (!value) return "-";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const normalizeStatus = (value) => {
  if (
    value === 1 ||
    value === "1" ||
    value === true ||
    String(value).toLowerCase() === "active"
  ) {
    return "1";
  }
  return "0";
};

const ServiceCategoryManagement = ({
  showModal,
  filters,
  setFilters,
  pagination,
  updatePagination,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const [rows, setRows] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);

  const requestParams = useMemo(
    () => ({
      ...filters,
      search: filters?.search || "",
      from: filters?.from || filters?.fromDate || "",
      to: filters?.to || filters?.toDate || "",
    }),
    [filters],
  );

  useEffect(() => {
    let isCancelled = false;
    const params = { ...requestParams };

    const fetchCategories = async () => {
      try {
        startSubmitting();
        const response = await getAll(`/service-categories`, params);
        if (response?.status) {
          const data = response?.data || [];
          const meta = response?.meta || {};
          if (isCancelled) return;
          setRows(data);

          const total = Number(meta?.total ?? data?.length ?? 0);
          const perPage = Number(
            meta?.per_page ?? params?.per_page ?? filters?.per_page ?? 10,
          );
          const currentPage = Number(
            meta?.current_page ?? params?.page ?? filters?.page ?? 1,
          );
          const shown = Number(
            meta?.to ?? Math.min(total, currentPage * perPage),
          );
          const calculatedPages =
            Number.isFinite(perPage) && perPage > 0
              ? Math.ceil(total / perPage)
              : 1;
          const totalPages = Math.max(
            1,
            Number(meta?.last_page ?? calculatedPages),
          );

          if (isCancelled) return;
          updatePagination({
            showData: shown,
            currentPage,
            totalRecords: total,
            totalPages,
            perPage,
          });
        } else {
          if (isCancelled) return;
          setRows([]);
          if (isCancelled) return;
          updatePagination({
            showData: 0,
            currentPage: 1,
            totalRecords: 0,
            totalPages: 1,
            perPage: Number(params?.per_page ?? 10),
          });
        }
      } catch (error) {
        console.error("Error fetching service categories:", error);
        if (!isCancelled) {
          setRows([]);
        }
      } finally {
        if (!isCancelled) {
          stopSubmitting();
        }
      }
    };

    fetchCategories();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    requestParams.page,
    requestParams.per_page,
    requestParams.search,
    requestParams.from,
    requestParams.to,
    reloadKey,
  ]);

  const handleStatusChange = (nextStatus, id, title) => {
    showModal(
      null,
      `Are you sure you want to change the status of ${title || "this category"} to ${nextStatus === "1" ? "Active" : "Inactive"}?`,
      () => onConfirmStatusChange(id, nextStatus),
    );
  };

  const onConfirmStatusChange = async (id, nextStatus) => {
    try {
      await post(`/service-category/${id}/status`, { status: nextStatus });
      setReloadKey((prev) => prev + 1);
      showModal(
        null,
        `Category status has been changed to ${nextStatus === "1" ? "Active" : "Inactive"} successfully.`,
        null,
        true,
      );
    } catch (error) {
      console.error("Unable to update category status:", error);
      showModal(
        "Error",
        "Unable to change category status at the moment.",
        null,
        true,
      );
    }
  };

  const currentPage = Number(
    requestParams?.page ?? filters?.page ?? pagination?.currentPage ?? 1,
  );
  const perPage = Number(
    requestParams?.per_page ?? filters?.per_page ?? pagination?.perPage ?? 10,
  );

  return (
    <DashboardLayout pageTitle={t('sidebar.service_category_management')}>
      <div className="container-fluid">
        <div className="dashCard">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="mainTitle mb-0">{t('sidebar.service_category_management')}</h2>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate(`/admin/service-category-management/add`)}
            >
              Add Category
            </button>
          </div>

          <CustomTable
            filters={filters}
            setFilters={setFilters}
            loading={isSubmitting}
            headers={serviceCategoryHeaders}
            pagination={pagination}
            dateFilters={[
              {
                title: "Created Date",
                from: "from",
                to: "to",
                fromTitle: "From",
                toTitle: "To",
              },
            ]}
          >
            <tbody>
              {rows.map((item, index) => {
                const statusValue = normalizeStatus(item?.status);
                return (
                  <tr
                    key={item?.id || index}
                    {...clickableTableRowNavProps(
                      navigate,
                      `/admin/service-category-management/${item?.id}`,
                    )}
                  >
                    <td>
                      {serialNum((currentPage - 1) * perPage + index + 1)}
                    </td>
                    <td>{item?.title || item?.name || "-"}</td>
                    <td>{formatType(item?.type)}</td>
                    <td>{item?.created_at || "-"}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <Select
                        className={`tabel-select status${statusValue === "1" ? "Active" : "Inactive"}`}
                        id={`category-status-${item?.id}`}
                        name="status"
                        value={statusValue}
                        onChange={(value) =>
                          handleStatusChange(
                            value,
                            item?.id,
                            item?.title || item?.name,
                          )
                        }
                        isInputNeeded={false}
                      >
                        {statusOptions}
                      </Select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </CustomTable>
        </div>
      </div>
    </DashboardLayout>
  );
};

const additionalFilters = { from: "", to: "" };
export default withModal(
  withFilters(ServiceCategoryManagement, additionalFilters),
);
