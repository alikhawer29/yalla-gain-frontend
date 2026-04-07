import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import { doctorDetailsMap, doctorServices } from "./doctorData";
import { doctorServicesHeaders } from "../../../Config/TableHeaders";
import { usePagination } from "../../../Hooks/usePagination";
import { clickableTableRowNavProps, serialNum } from "../../../Utils/helper";
import "./style.css";
import { getAll, post } from "../../../Services/Api";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { statusOptions } from "../../../Config/TableStatus";
import { Select } from "../../../Components/Select";
import withModal from "../../../HOC/withModal";

const TrainerServices = ({ showModal }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const doctor = useMemo(
    () => doctorDetailsMap[id] ?? doctorDetailsMap["01"],
    [id],
  );
  const servicesSource = useMemo(
    () => doctorServices[id] ?? doctorServices["01"],
    [id],
  );
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const [filters, setFilters] = useState({
    page: 1,
    per_page: 10,
    search: "",
    status: "",
  });
  const [pagination, updatePagination] = usePagination(1, 10);
  const [rows, setRows] = useState([]);
  const [pageMeta, setPageMeta] = useState({
    currentPage: 1,
    perPage: 10,
    totalRecords: servicesSource.length,
  });

  useEffect(() => {
    const perPage = Number(filters.per_page) || 10;
    const currentPage = Number(filters.page) || 1;
    const normalizedSearch = filters.search?.trim().toLowerCase() ?? "";
    const statusFilter = filters.status?.trim();

    const filtered = servicesSource.filter((service) => {
      const matchesSearch =
        !normalizedSearch ||
        service.serviceCategory.toLowerCase().includes(normalizedSearch);
      const matchesStatus =
        !statusFilter ||
        service.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });

    const totalRecords = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / perPage));

    if (currentPage > totalPages) {
      setFilters((prev) => ({ ...prev, page: totalPages }));
      return;
    }

    const startIndex = (currentPage - 1) * perPage;
    const paginated = filtered.slice(startIndex, startIndex + perPage);

    setRows(paginated);
    setPageMeta({ currentPage, perPage, totalRecords });
    updatePagination({
      showData: Math.min(totalRecords, startIndex + paginated.length),
      currentPage,
      totalRecords,
      totalPages,
      perPage,
    });
  }, [filters, servicesSource, setFilters, updatePagination]);

  const startIndex = (pageMeta.currentPage - 1) * pageMeta.perPage;

  const fetchServices = async () => {
    try {
      startSubmitting(true);
      const url = `/doctor/${id}/services`;
      const response = await getAll(url, filters);
      // const response = subscriptionLogsData;
      if (response.status) {
        const { data } = response;
        const { total, per_page, current_page, to } = response?.meta;
        setRows(data);
        updatePagination({
          showData: to,
          currentPage: current_page,
          totalRecords: total,
          totalPages: Math.ceil(total / per_page),
        });
      }
    } catch (error) {
      console.error("Error fetching trainer services:", error);
    } finally {
      stopSubmitting(false);
    }
  };

  const handleStatusChange = (e, userId) => {
    const newStatusValue = e;
    showModal(
      null,
      `Are you sure you want to change this service's status to ${
        newStatusValue == "1" ? "Active" : "Inactive"
      }?`,
      () => onConfirmStatusChange(userId, newStatusValue),
    );
  };

  const onConfirmStatusChange = async (userId, newStatusValue) => {
    const response = await post(`/doctor/${userId}/services/status`);
    // setUserData((prevData) =>
    //     prevData.map((user) =>
    //         user.id == userId ? { ...user, status: newStatusValue } : user
    //     )
    // );
    // fetchUsers();

    fetchServices();
    showModal(
      null,
      `Service status has been changed to ${
        newStatusValue == "1" ? "Active" : "Inactive"
      } successfully.`,
      null,
      true,
    );
  };

  useEffect(() => {
    fetchServices();
  }, [filters]);

  return (
    <DashboardLayout pageTitle="Trainer Services">
      <div className="container-fluid">
        <div className="dashCard doctor-services-section">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <div className="d-flex align-items-center gap-3">
              <BackButton2 />
              <div>
                <h2 className="mainTitle mb-1">Trainer Services</h2>
                {/* <p className="detail-subtitle mb-0">Services offered by {doctor.name}</p> */}
              </div>
            </div>
          </div>

          <CustomTable
            filters={filters}
            setFilters={setFilters}
            loading={false}
            headers={doctorServicesHeaders}
            pagination={pagination}
            selectOptions={[
              {
                main_title: "Filter by status",
                title: "status",
                options: [
                  { value: "", text: "All" },
                  { value: "Active", text: "Active" },
                  { value: "Inactive", text: "Inactive" },
                ],
              },
            ]}
          >
            <tbody>
              {rows.map((service, index) => (
                <tr
                  key={service.id}
                  {...clickableTableRowNavProps(
                    navigate,
                    `/admin/trainer-management/${id}/services/${service.id}`,
                  )}
                >
                  <td>{serialNum(startIndex + index + 1)}</td>
                  <td>{service.title}</td>
                  <td>{service.created_at}</td>
                  <td>{service.charges} Yalla Coins</td>
                  {/* <td>
                                        <span className={`statusChip status${service.status}`}>{service.status ? "Active" : "Inactive"}</span>
                                    </td> */}
                  <td onClick={(e) => e.stopPropagation()}>
                    <Select
                      className={`tabel-select status${service?.status ? "Active" : "Inactive"}`}
                      required
                      id={`status${service?.id}`}
                      name="status"
                      value={service?.status ? "1" : "0"}
                      onChange={(e) => handleStatusChange(e, service?.id)}
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

export default withModal(TrainerServices);
