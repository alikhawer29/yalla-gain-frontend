import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import withModal from "../../../HOC/withModal";
import { getDetails, post } from "../../../Services/Api";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { images } from "../../../Assets";
import { getCountryFlag } from "../../../Utils/helper";
import "./style.css";

const formatNameField = (field) => {
    if (!field) return "-";
    const value = typeof field === "string" ? field : field.name || "";
    if (!value) return "-";
    return value.charAt(0).toUpperCase() + value.slice(1);
};

const formatLanguageField = (field) => {
    if (!field) return "-";

    const rawValue = typeof field === "string" ? field : field?.name || "";
    if (!rawValue) return "-";

    return rawValue
        .split(",")
        .map((part) =>
            part
                .trim()
                .split(" ")
                .filter(Boolean)
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
        )
        .filter(Boolean)
        .join(", ") || "-";
};

const STATUS_MAP = {
    1: "Approved",
    2: "Pending",
    3: "Rejected",
};

const DoctorRequestView = ({ showModal, reasonModal }) => {
    const { id } = useParams();
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
    const [doctor, setDoctor] = useState(null);

    const fetchDoctor = async () => {
        try {
            startSubmitting(true);
            const response = await getDetails(`/doctor/${id}`);
            if (response?.status) setDoctor(response.data);
        } catch (error) {
            console.error("Error fetching doctor request details:", error);
        } finally {
            stopSubmitting(false);
        }
    };

    useEffect(() => {
        fetchDoctor();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const statusLabel = useMemo(() => STATUS_MAP[doctor?.status] || "Pending", [doctor]);
    const statusClassName = `status${statusLabel}`;

    const details = useMemo(() => {
        if (!doctor) {
            return {
                name: "-",
                gender: "-",
                phone: "-",
                phoneValue: "-",
                countryCode: "",
                email: "-",
                state: "-",
                city: "-",
                bio: "-",
                language: "-",
                rejection_reason: null,
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

        const phoneValue = `${doctor.dialing_code ? `${doctor.dialing_code} ` : ""}${doctor.phone || "-"}`.trim();

        const experienceList = Array.isArray(doctor.experience)
            ? doctor.experience.map((item) => ({
                id: item.id,
                specialization: item.specialization || "-",
                experience: item.experience || "-",
            }))
            : [];

        const certifications = Array.isArray(doctor.certifications) && doctor.certifications.length
            ? doctor.certifications.map((cert) => ({
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
            name: [doctor.first_name, doctor.last_name].filter(Boolean).join(" ") || "-",
            gender: formatNameField(doctor.gender),
            phone: phoneValue || "-",
            phoneValue,
            countryCode: doctor.country_code || "",
            email: doctor.email || "-",
            state: formatNameField(doctor.state),
            city: formatNameField(doctor.city),
            bio: doctor.bio || "-",
            language: formatLanguageField(doctor.language),
            experienceList,
            rejection_reason: doctor.rejection_reason || null,
            certifications,
            photo: doctor.photo || images.placeholder,
        };
    }, [doctor]);

    const confirmApprove = async () => {
        try {
            startSubmitting(true);
            await post(`/doctor/${id}/status/request`, { status: "approved" });
            await fetchDoctor();
            showModal("Successfully", "Doctor has been approved successfully.", null, true);
        } catch (error) {
            console.error("Error approving doctor:", error);
        } finally {
            stopSubmitting(false);
        }
    };

    const confirmReject = async (reason) => {
        try {
            startSubmitting(true);
            await post(`/doctor/${id}/status/request`, {
                status: "rejected",
                rejection_reason: reason,
            });
            await fetchDoctor();
            reasonModal("Successfully", "Doctor has been rejected successfully.", null, true);
        } catch (error) {
            console.error("Error rejecting doctor:", error);
        } finally {
            stopSubmitting(false);
        }
    };

    const handleApprove = () => {
        showModal("Approve", "Are you sure you want to approve this doctor?", confirmApprove);
    };

    const handleReject = () => {
        reasonModal(
            "",
            "",
            confirmReject,
            false,
            true,
            "",
            "",
            "Rejected Reason :",
            "Write Rejected Reason......",
            true
        );
    };

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

    return (
        <DashboardLayout pageTitle="Doctor Request Details">
            <div className="container-fluid">
                <div className="dashCard doctor-request-view">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                        <div className="d-flex align-items-center gap-3">
                            <BackButton2 />
                            <div>
                                <h2 className="mainTitle mb-1">Doctor Details</h2>
                            </div>
                        </div>
                        <span className={statusClassName}>{statusLabel}</span>
                    </div>

                    <div className="doctor-request-summary">
                        <div className="d-flex align-items-center gap-5 mb-4">
                            <div className="detail-box-img">
                                <img src={details.photo} alt={details.name} />
                            </div>
                        </div>
                        {/* check if status is 2 */}

                        {statusLabel === "Pending" && (
                            <div className="doctor-request-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleApprove}
                                    disabled={isSubmitting || statusLabel === "Approved"}
                                >
                                    Approve
                                </button>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={handleReject}
                                    disabled={isSubmitting || statusLabel === "Rejected"}
                                >
                                    Reject
                                </button>
                            </div>
                        )}

                    </div>

                    <div className="doctor-info-grid">
                        <div className="row">
                            {infoItems.map(({ label, value }) => (
                                <div className="col-xl-3 col-md-6 mb-3" key={label}>
                                    <div className="detail-box">
                                        <h6>{label}</h6>
                                        <p className="mb-0">
                                            {label === "Phone Number" && typeof value === "string" && (
                                                <span>{getCountryFlag(value, details.countryCode)}</span>
                                            )}
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

                    <div className="doctor-certification mt-5 detail-box">
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
                    {details?.rejection_reason && (
                        <div className="doctor-info-grid">
                            <div className="row">

                                <div className="col-xl-3 col-md-6 mb-3" key="Rejection Reason">
                                    <div className="detail-box">
                                        <h6>Rejection Reason</h6>
                                        <p className="mb-0">
                                            {details?.rejection_reason}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}

                </div>
            </div>
        </DashboardLayout >
    );
};

export default withModal(DoctorRequestView);



