import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import withModal from "../../../HOC/withModal";
import { getDetails, getAll, post } from "../../../Services/Api";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { serialNum, getCountryFlag } from "../../../Utils/helper";
import { usePagination } from "../../../Hooks/usePagination";
import { images } from "../../../Assets";
import { doctorBookingHeaders } from "../../../Config/TableHeaders";
import "./style.css";
import { statusOptions } from "../../../Config/TableStatus";
import { Select } from "../../../Components/Select";

const STATUS_MAP = {
    1: "Approved",
    2: "Pending",
    3: "Rejected",
};

const formatStatusLabel = (value) => {
    if (!value) return "-";
    const label = value.toString();
    return label.charAt(0).toUpperCase() + label.slice(1);
};

const TrainerDetails = ({ showModal }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
    const [Trainer, setTrainer] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [filters, setFilters] = useState({ page: 1, per_page: 10, search: "", status: "", from: "", to: "" });
    const [pagination, updatePagination] = usePagination(1, 10);

    const fetchTrainer = async () => {
        try {
            startSubmitting(true);
            const response = await getDetails(`/doctor/${id}`);
            if (response?.status) setTrainer(response.data);
        } catch (error) {
            console.error("Error fetching Trainer details:", error);
        } finally {
            stopSubmitting(false);
        }
    };

    const fetchBookings = async () => {
        try {
            setBookingLoading(true);
            const response = await getAll(`/doctor/${id}/booking-logs`, filters);
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
            console.error("Error fetching Trainer bookings:", error);
        } finally {
            setBookingLoading(false);
        }
    };

    useEffect(() => {
        fetchTrainer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        fetchBookings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, id]);

    const statusLabel = useMemo(() => STATUS_MAP[Trainer?.status] || "Pending", [Trainer]);
    const statusClassName = `status${statusLabel}`;

    const details = useMemo(() => {
        if (!Trainer) {
            return {
                name: "-",
                gender: "-",
                phone: "-",
                phoneValue: "-",
                email: "-",
                state: "-",
                city: "-",
                bio: "-",
                status: "1",
                language: "-",
                experienceList: [],
                certifications: [
                    {
                        id: "placeholder",
                        institute_name: "-",
                        certificate_title: "-",
                        certificate_picture: images.certificate_image,
                    },
                ],
                photo: images.placeholder,
            };
        }

        const phoneValue = `${Trainer.dialing_code ? `${Trainer.dialing_code} ` : ""}${Trainer.phone || "-"}`.trim();

        const experienceList = Array.isArray(Trainer.experience)
            ? Trainer.experience.map((item) => ({
                id: item.id,
                specialization: item.specialization || "-",
                experience: item.experience || "-",
            }))
            : [];

        const certifications = Array.isArray(Trainer.certifications) && Trainer.certifications.length
            ? Trainer.certifications.map((cert) => ({
                id: cert.id,
                institute_name: cert.institute_name || "-",
                certificate_title: cert.certificate_title || "-",
                certificate_picture: cert.certificate_picture || images.certificate_image,
            }))
            : [
                {
                    id: "placeholder",
                    institute_name: "-",
                    certificate_title: "-",
                    certificate_picture: images.certificate_image,
                },
            ];

        return {
            name: [Trainer.first_name, Trainer.last_name].filter(Boolean).join(" ") || "-",
            gender: Trainer.gender?.name || "-",
            phone: phoneValue || "-",
            phoneValue,
            email: Trainer.email || "-",
            state: Trainer.state?.name || "-",
            city: Trainer.city?.name || "-",
            bio: Trainer.bio || "-",
            language: Trainer.language || "-",
            status: Trainer.status || "1",
            experienceList,
            certifications,
            photo: Trainer.photo || images.placeholder,
        };
    }, [Trainer]);

    const infoItems = useMemo(
        () => [
            { label: "User Name", value: details.name },
            { label: "Gender", value: details.gender },
            { label: "Phone Number", value: details.phoneValue },
            { label: "Email Address", value: details.email },
            { label: "State", value: details.state },
            { label: "City", value: details.city },
            { label: "Bio", value: details.bio },
            { label: "Language", value: details.language },
            {
                label: "Specialization and Experience",
                value: details.experienceList.length ? details.experienceList : "-",
            },
        ],
        [details]
    );

    const handleStatusChange = (e, userId) => {
        const newStatusValue = e;
        showModal(
            `Mark as ${newStatusValue == "1" ? "Active" : "Inactive"}`,
            `Are you sure you want to change this user's status to ${newStatusValue == "1" ? "Active" : "Inactive"
            }?`,
            () => onConfirmStatusChange(userId, newStatusValue)
        );
    };

    const onConfirmStatusChange = async (userId, newStatusValue) => {
        await post(`/doctor/${userId}/status`, { status: newStatusValue });
        // setProfileData((prevData) => ({
        //     ...prevData,
        //     status: newStatusValue,
        // }));
        // getUser();

        fetchTrainer();
        showModal(
            "Successful",
            `User status has been changed to ${newStatusValue == "1" ? "Active" : "Inactive"
            } successfully.`,
            null,
            true
        );
    };

    return (
        <DashboardLayout pageTitle="Trainer Details">
            <div className="container-fluid">
                <div className="dashCard Trainer-request-view Trainer-details-section">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                        <div className="d-flex align-items-center gap-3">
                            <BackButton2 />
                            <div>
                                <h2 className="mainTitle mb-1">Trainer Details</h2>
                            </div>
                        </div>
                        {/* <span className={`statusChip ${statusClassName}`}>{statusLabel}</span>
                         */}
                        <div className="status-action">
                            <Select
                                className={`tabel-select status${Trainer?.status ? "Active" : "Inactive"}`}
                                id={`status${id}`}
                                name="status"
                                label=""
                                value={Trainer?.status ? "1" : "0"}
                                onChange={(e) => handleStatusChange(e, id)}
                                labelclass="me-2 mb-0"
                            >
                                {statusOptions}
                            </Select>
                        </div>
                    </div>

                    <div className="Trainer-request-summary">
                        <div className="d-flex align-items-center gap-5 mb-4">
                            <div className="detail-box-img">
                                <img src={details.photo} alt={details.name} />
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                <button className="btn btn-primary" onClick={() => navigate(`/admin/trainer-management/${id}/services`)}>View Services</button>
                                <button className="btn btn-primary" onClick={() => navigate(`/admin/trainer-management/${id}/reviews`)}>Rating & Reviews</button>
                                <button className="btn btn-primary" onClick={() => navigate(`/admin/trainer-management/${id}/dashboard`)}>Dashboard</button>
                                <button className="btn btn-primary" onClick={() => navigate(`/admin/chat`)}>Chat With Trainer</button>
                            </div>
                        </div>
                    </div>

                    <div className="Trainer-info-grid">
                        <div className="row">
                            {infoItems.map(({ label, value }) => (
                                <div className="col-xl-3 col-md-6 mb-3" key={label}>
                                    <div className="detail-box">
                                        <h6>{label}</h6>
                                        <p className="mb-0">
                                            {label === "Phone Number" && typeof value === "string" && <span>{getCountryFlag(value)}</span>}
                                            {label === "Specialization and Experience" && Array.isArray(value)
                                                ? value.map((item) => (
                                                    <div key={item.id}>
                                                        {item.specialization} ({item.experience} years)
                                                    </div>
                                                ))
                                                : value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="Trainer-certification mt-5 detail-box">
                        <h3 className="section-title mb-3">Certification Detail</h3>
                        {details.certifications.map((cert, index) => (
                            <div className="row g-4 align-items-center" key={cert.id || index}>
                                <div className="col-xl-5">
                                    <div className="detail-box mb-3">
                                        <h6>Institute Name</h6>
                                        <p className="mb-0">{cert.institute_name}</p>
                                    </div>
                                    <div className="detail-box">
                                        <h6>Certificate Title</h6>
                                        <p className="mb-0">{cert.certificate_title}</p>
                                    </div>
                                </div>
                                <div className="col-xl-7">
                                    <div>
                                        <img src={cert.certificate_picture} alt="Certificate" className="img-fluid" />
                                    </div>
                                </div>
                            </div>
                        ))}
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
                        headers={doctorBookingHeaders}
                        pagination={pagination}
                        // selectOptions={[{
                        //     main_title: "Filter by status",
                        //     title: "status",
                        //     options: [
                        //         { value: "", text: "All" },
                        //         { value: "Pending", text: "Pending" },
                        //         { value: "Upcoming", text: "Upcoming" },
                        //         { value: "Past", text: "Past" },
                        //         { value: "Approved", text: "Approved" },
                        //     ],
                        // }]}
                        dateFilters={[{ title: "Date", from: "from", to: "to", fromTitle: "From", toTitle: "To" }]}
                    >
                        <tbody>
                            {bookings.map((item, index) => {
                                const rowIndex = serialNum((pagination.currentPage - 1) * (pagination.perPage || filters.per_page || 10) + index + 1);
                                const bookingId = item.booking_id || "-";
                                const serviceTitle = item.service?.title || item.service_category || "-";
                                const appointmentDate = item.appointment_date || item.date || item.created_at || "-";
                                const appointmentTime = item.appointment_start_time && item.appointment_end_time ? `${item.appointment_start_time} - ${item.appointment_end_time}` : "";
                                const amountPaid = item.amount_paid || item.charges || "-";
                                const label = formatStatusLabel(item.status);
                                const statusClass = `status${label.replace(/\s+/g, "")}`;

                                return (
                                    <tr key={item.id || index}>
                                        <td>{rowIndex}</td>
                                        <td>{bookingId}</td>
                                        <td>{serviceTitle}</td>
                                        <td>{appointmentDate}</td>
                                        <td>{amountPaid}</td>
                                        <td>
                                            <span className={`statusChip ${statusClass}`}>{label}</span>
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

export default withModal(TrainerDetails);



