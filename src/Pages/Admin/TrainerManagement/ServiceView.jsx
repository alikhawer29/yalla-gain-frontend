import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import { doctorServiceBookingHeaders } from "../../../Config/TableHeaders";
import { usePagination } from "../../../Hooks/usePagination";
import BookingStatusText from "../../../Components/BookingStatusText";
import {
  clickableTableRowNavProps,
  serialNum,
  timeFormat,
} from "../../../Utils/helper";
import { getAll, post } from "../../../Services/Api";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { images } from "../../../Assets";
import "./style.css";
import { Select } from "../../../Components/Select";
import { statusOptions } from "../../../Config/TableStatus";
import withModal from "../../../HOC/withModal";

const SERVICE_STATUS_MAP = {
    1: "Active",
    0: "Inactive",
    active: "Active",
    inactive: "Inactive",
};

const formatServiceStatus = (value) => {
    if (value === null || value === undefined) return "Inactive";
    if (Number.isFinite(value)) {
        return Number(value) === 1 ? "Active" : "Inactive";
    }
    const normalized = value.toString().toLowerCase();
    return SERVICE_STATUS_MAP[normalized] || value;
};

const formatDay = (value) => {
    if (!value) return "-";
    const lower = value.toString().toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
};

const formatSlotRange = (start, end) => {
    if (!start && !end) return "-";
    if (start && end) return `${timeFormat(start)} - ${timeFormat(end)}`;
    return timeFormat(start || end) || "-";
};

const TrainerServiceView = ({ showModal }) => {
    const { id, serviceId } = useParams();
    const navigate = useNavigate();
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
    const [service, setService] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [filters, setFilters] = useState({ page: 1, per_page: 10, search: "", status: "", from: "", to: "" });
    const [pagination, updatePagination] = usePagination(1, 10);

    const fetchService = async () => {
        try {
            startSubmitting(true);
            const response = await getAll(`/doctor/${serviceId}/service/view`);
            if (response?.status) {
                setService(response.data);
            } else {
                setService(null);
            }
        } catch (error) {
            console.error("Error fetching trainer service details:", error);
            setService(null);
        } finally {
            stopSubmitting(false);
        }
    };

    const fetchBookings = async () => {
        try {
            setBookingLoading(true);
            const params = { ...filters, service_id: serviceId };
            if (!params.search) delete params.search;
            if (!params.status) delete params.status;
            if (!params.from) delete params.from;
            if (!params.to) delete params.to;

            const response = await getAll(`/doctor/${serviceId}/service/bookings`, params);
            if (response?.status) {
                const data = response?.data || [];
                const meta = response?.meta || {};
                setBookings(data);
                const total = meta?.total ?? data.length ?? 0;
                const perPage = meta?.per_page ?? Number(filters?.per_page || 10);
                const currentPage = meta?.current_page ?? Number(filters?.page || 1);
                const showData = meta?.to ?? Math.min(total, currentPage * perPage);
                updatePagination({
                    showData,
                    currentPage,
                    totalRecords: total,
                    totalPages: Math.max(1, Math.ceil(total / perPage)),
                    perPage,
                });
            } else {
                setBookings([]);
                updatePagination({ showData: 0, currentPage: 1, totalRecords: 0, totalPages: 1, perPage: filters?.per_page || 10 });
            }
        } catch (error) {
            console.error("Error fetching trainer service bookings:", error);
            setBookings([]);
            updatePagination({ showData: 0, currentPage: 1, totalRecords: 0, totalPages: 1, perPage: filters?.per_page || 10 });
        } finally {
            setBookingLoading(false);
        }
    };

    useEffect(() => {
        fetchService();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, serviceId]);

    useEffect(() => {
        fetchBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, id, serviceId]);

    const serviceDetails = useMemo(() => {
        if (!service) {
            return {
                category: "-",
                title: "-",
                description: "-",
                charges: "-",
                status: "1",
                banner: images.placeholder,
                statusLabel: "Inactive",
                slots: [],
            };
        }

        const statusLabel = formatServiceStatus(service.status);
        const slotGroups = Array.isArray(service.service_slots)
            ? (() => {
                const slotMap = new Map();
                service.service_slots.forEach((slot) => {
                    const day = formatDay(slot.day);
                    const time = formatSlotRange(slot.start_time, slot.end_time);
                    const entries = slotMap.get(day) || [];
                    entries.push({ id: slot.id, time });
                    slotMap.set(day, entries);
                });
                return Array.from(slotMap.entries()).map(([day, entries]) => ({
                    day,
                    slots: entries,
                }));
            })()
            : [];

        return {
            category: service.service_category?.title || "-",
            title: service.title || "-",
            description: service.description || "-",
            charges: service.charges || "-",
            banner: service.image || images.placeholder,
            statusLabel,
            status: service.status,
            slots: slotGroups,
        };
    }, [service]);

    const handleStatusChange = (e, userId) => {
        const newStatusValue = e;
        showModal(
            `Mark as ${newStatusValue == "1" ? "Active" : "Inactive"}`,
            `Are you sure you want to change this service's status to ${newStatusValue == "1" ? "Active" : "Inactive"
            }?`,
            () => onConfirmStatusChange(userId, newStatusValue)
        );
    };

    const onConfirmStatusChange = async (userId, newStatusValue) => {
        await post(`/doctor/${userId}/services/status`, { status: newStatusValue });
        // setProfileData((prevData) => ({
        //     ...prevData,
        //     status: newStatusValue,
        // }));
        // getUser();

        fetchService();

        showModal(
            "Successful",
            `Service status has been changed to ${newStatusValue == "1" ? "Active" : "Inactive"
            } successfully.`,
            null,
            true
        );
    };

    const statusClassName = `status${serviceDetails.statusLabel.replace(/\s+/g, "")}`;
    const startIndex = (pagination.currentPage - 1) * (pagination.perPage || filters.per_page || 10);

    return (
        <DashboardLayout pageTitle="Service Details">
            <div className="container-fluid">
                <div className="dashCard doctor-service-view">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                        <div className="d-flex align-items-center gap-3">
                            <BackButton2 />
                            <div>
                                <h2 className="mainTitle mb-1">View Service</h2>
                                {/* <p className="detail-subtitle mb-0">Detailed view of service {serviceDetails.title}</p> */}
                            </div>
                        </div>
                        <div className="d-flex flex-column align-items-end gap-2">
                            {/* <span className={`statusChip ${statusClassName}`}>{serviceDetails.statusLabel}</span> */}
                            <div className="status-action">
                                <Select
                                    className={`tabel-select status${serviceDetails?.status ? "Active" : "Inactive"}`}
                                    id={`status${serviceId}`}
                                    name="status"
                                    label=""
                                    value={serviceDetails?.status ? "1" : "0"}
                                    onChange={(e) => handleStatusChange(e, serviceId)}
                                    labelclass="me-2 mb-0"
                                >
                                    {statusOptions}
                                </Select>
                            </div>
                            {/* <button
                                className="btn btn-outline-primary"
                                onClick={() => navigate(`/admin/trainer-management/${id}/services`)}
                                disabled={isSubmitting}
                            >
                                Back to Services
                            </button> */}
                        </div>
                    </div>



                    <div className="service-hero mb-4">
                        <img src={serviceDetails.banner} alt={serviceDetails.category} />
                    </div>

                    <div className="row mb-2">
                        {/* <div className="col-xl-4">
                            <div className="info-tile">
                                <span className="info-label">Service</span>
                                <p className="info-value mb-0">{serviceDetails.title}</p>
                            </div>
                            <div className="info-tile mt-3">
                                <span className="info-label">Service Charges</span>
                                <p className="info-value mb-0">{serviceDetails.charges} Yalla Coins</p>
                            </div>
                        </div> */}
                        <div className="col-xl-3 col-md-6 mb-3">
                            <div className="detail-box">
                                <h6>Service Category</h6>
                                <p className="mb-0">{serviceDetails.title}</p>
                            </div>
                        </div>
                        <div className="col-xl-3 col-md-6 mb-3">
                            <div className="detail-box">
                                <h6>Service Charges</h6>
                                <p className="mb-0">{serviceDetails.charges} Yalla Coins</p>
                            </div>
                        </div>
                        <div className="col-xl-6 col-md-6 mb-3">
                            <div className="detail-box">
                                <h6>Description</h6>
                                <p className="mb-0">{serviceDetails.description}</p>
                            </div>
                        </div>
                    </div>

                    <h4 className="f-white-color">Slots</h4>

                    <div className="row">
                        {serviceDetails.slots.length ? (
                            serviceDetails.slots.map((slotGroup) => (
                                // <div className="slot-card" key={slotGroup.day}>
                                //     <span className="slot-day">{slotGroup.day}</span>
                                //     {slotGroup.slots.map((slot) => (
                                //         <><span className="slot-time" key={slot.id || slot.time}>{slot.time}</span><br /></>
                                //     ))}
                                // </div>
                                <div className="col-xl-3 col-md-6 mb-3">
                                    <div className="detail-box">
                                        <h6>{slotGroup.day}</h6>
                                        {slotGroup.slots.map((slot) => (
                                            <p className="mb-0">{slot.time}</p>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="slot-card">
                                <span className="slot-day">-</span>
                                <span className="slot-time">No slots available</span>
                            </div>
                        )}
                    </div>

                </div>

                <div className="dashCard mt-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                        <h3 className="mainTitle mb-0">Booking Logs</h3>
                    </div>
                    <CustomTable
                        filters={filters}
                        setFilters={setFilters}
                        loading={bookingLoading}
                        headers={doctorServiceBookingHeaders}
                        pagination={pagination}
                        selectOptions={[{
                            main_title: "Filter by status",
                            title: "status",
                            options: [
                                { value: "", text: "All" },
                                { value: "pending", text: "Pending" },
                                { value: "upcoming", text: "Upcoming" },
                                { value: "in-progress", text: "In-Progress" },
                                { value: "past", text: "Past" },
                                { value: "approved", text: "Approved" },
                            ],
                        }]}
                        dateFilters={[{ title: "Date", from: "from", to: "to", fromTitle: "From", toTitle: "To" }]}
                    >
                        <tbody>
                            {bookings.map((item, index) => {
                                const rowIndex = serialNum(startIndex + index + 1);
                                const bookingId = item.booking_id || item.bookingId || "-";
                                const userName = [item.first_name, item.last_name].filter(Boolean).join(" ")
                                    || [item.user?.first_name, item.user?.last_name].filter(Boolean).join(" ")
                                    || item.user?.name
                                    || "-";
                                const appointmentDate = item.appointment_date || item.date || item.created_at || "-";
                                const charges = item.amount_paid || item.charges || "-";
                                return (
                                    <tr
                                        key={item.id || index}
                                        {...(item.id
                                            ? clickableTableRowNavProps(
                                                  navigate,
                                                  `/admin/appointments/${item.id}`,
                                              )
                                            : {})}
                                    >
                                        <td>{rowIndex}</td>
                                        <td>{bookingId}</td>
                                        <td>{userName}</td>
                                        <td>{appointmentDate}</td>
                                        <td>{charges}</td>
                                        <td>
                                            <BookingStatusText status={item.status} />
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

export default withModal(TrainerServiceView);




