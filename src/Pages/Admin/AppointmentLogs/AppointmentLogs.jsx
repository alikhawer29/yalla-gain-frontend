import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import CustomTable from "../../../Components/CustomTable";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import { userBookingLogsData } from "../../../Config/data";
import { appointmentLogsHeaders } from "../../../Config/TableHeaders";
import { appointmentTypeOptions } from "../../../Config/TableStatus";
import withFilters from "../../../HOC/withFilters";
import { dateFormat, serialNum } from "../../../Utils/helper";

const AppointmentLogs = ({ filters, setFilters, pagination, updatePagination }) => {
  const [appointmentLogs, setAppointmentLogs] = useState([]);
  const fetchAppointmentLogs = async () => {
    try {
      const response = userBookingLogsData;
      if (response.status) {
        const { data, total, per_page, current_page, to } = response.detail;
        setAppointmentLogs(data);
        updatePagination({
          showData: to,
          currentPage: current_page,
          totalRecords: total,
          totalPages: Math.ceil(total / per_page),
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      // console.log()
    }
  };

  useEffect(() => {
    fetchAppointmentLogs();
  }, [filters]);

  return (
    <DashboardLayout pageTitle="Appointment Logs">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="dashCard">
              <div className="row mb-4">
                <div className="col-12">
                  <h2 className="mainTitle mb-0">Appointment Logs</h2>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <CustomTable
                    filters={filters}
                    setFilters={setFilters}
                    headers={appointmentLogsHeaders}
                    pagination={pagination}
                    dateFilters={[
                      {
                        title: "Appointment Date",
                        from: "fromDate",
                        to: "toDate",
                        fromTitle: "From",
                        toTitle: "To",
                      },
                    ]}
                    selectOptions={[
                      {
                        main_title: "Appointment Type Status",
                        title: "Appointment Type",
                        options: appointmentTypeOptions,
                      },
                    ]}
                  >
                    <tbody>
                      {appointmentLogs?.map((item, index) => (
                        <tr key={item?.id}>
                          <td>{serialNum((filters.page - 1) * filters.per_page + index + 1)}</td>
                          <td>{item?.booking_id}</td>
                          <td>{item?.user?.name}</td>
                          <td>{item?.consultant?.name}</td>
                          <td>{item?.category}</td>
                          <td>{dateFormat(item?.booking_date)}</td>
                          <td>{dateFormat(item?.appointment_date)}</td>
                          <td>{item?.session_type}</td>
                          <td>{item?.appointment_type}</td>
                          <td>{item?.duration}</td>
                          <td>{item?.amount}</td>
                          <td
                            style={{
                              color:
                                item.status === "Upcoming" ? "#FDB332" : item.status === "In-Progress" ? "#D27231" : item.status === "Past" ? "#0DCF38" : "",
                            }}
                          >
                            {item?.status}
                          </td>
                          <td>
                            <div className="d-flex cp gap-3 tableAction align-items-center justify-content-center">
                              <span className="tooltip-toggle" aria-label="View">
                                <Link to={`${item.id}`}>
                                  <FaEye size={20} />
                                </Link>
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </CustomTable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withFilters(AppointmentLogs);
