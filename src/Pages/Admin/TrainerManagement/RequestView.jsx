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

const STATUS_MAP = {
    1: "Approved",
    2: "Pending",
    3: "Rejected",
};

const TrainerRequestView = ({ showModal, reasonModal }) => {
    const { id } = useParams();
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
    const [trainer, setTrainer] = useState(null);

    const fetchTrainer = async () => {
        try {
            startSubmitting(true);
            const response = await getDetails(`/doctor/${id}`);
            if (response?.status) setTrainer(response.data);
        } catch (error) {
            console.error("Error fetching trainer request details:", error);
        } finally {
            stopSubmitting(false);
        }
    };

    useEffect(() => {
        fetchTrainer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const statusLabel = useMemo(() => STATUS_MAP[trainer?.status] || "Pending", [trainer]);
    const statusClassName = `status${statusLabel}`;

    const details = useMemo(() => {
        if (!trainer) {
            return {
                name: "-",
                gender: "-",
                phone: "-",
                phoneValue: "-",
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

        const phoneValue = `${trainer.dialing_code ? `${trainer.dialing_code} ` : ""}${trainer.phone || "-"}`.trim();

        const experienceList = Array.isArray(trainer.experience)
            ? trainer.experience.map((item) => ({
                id: item.id,
                specialization: item.specialization || "-",
                experience: item.experience || "-",
            }))
            : [];

        const certifications = Array.isArray(trainer.certifications) && trainer.certifications.length
            ? trainer.certifications.map((cert) => ({
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
            name: [trainer.first_name, trainer.last_name].filter(Boolean).join(" ") || "-",
            gender: trainer.gender?.name || "-",
            phone: phoneValue || "-",
            phoneValue,
            email: trainer.email || "-",
            state: trainer.state?.name || "-",
            city: trainer.city?.name || "-",
            bio: trainer.bio || "-",
            language: trainer.language || "-",
            experienceList,
            rejection_reason: trainer.rejection_reason || null,
            certifications,
            photo: trainer.photo || images.placeholder,
        };
    }, [trainer]);

    const confirmApprove = async () => {
        try {
            startSubmitting(true);
            await post(`/doctor/${id}/status/request`, { status: "approved" });
            await fetchTrainer();
            showModal("Successfully", "Trainer has been approved successfully.", null, true);
        } catch (error) {
            console.error("Error approving trainer:", error);
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
            await fetchTrainer();
            reasonModal("Successfully", "Trainer has been rejected successfully.", null, true);
        } catch (error) {
            console.error("Error rejecting trainer:", error);
        } finally {
            stopSubmitting(false);
        }
    };

    const handleApprove = () => {
        showModal("Approve", "Are you sure you want to approve this trainer?", confirmApprove);
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
        <DashboardLayout pageTitle="Trainer Request Details">
            <div className="container-fluid">
                <div className="dashCard doctor-request-view">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                        <div className="d-flex align-items-center gap-3">
                            <BackButton2 />
                            <div>
                                <h2 className="mainTitle mb-1">Trainer Details</h2>
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
                                                <span>{getCountryFlag(value)}</span>
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

export default withModal(TrainerRequestView);






