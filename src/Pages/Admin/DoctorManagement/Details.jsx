import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate, useParams } from "react-router-dom";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import withModal from "../../../HOC/withModal";
import { getDetails, getAll, post } from "../../../Services/Api";
import {
  clickableTableRowNavProps,
  serialNum,
  getCountryFlag,
} from "../../../Utils/helper";
import { usePagination } from "../../../Hooks/usePagination";
import { images } from "../../../Assets";
import { doctorBookingHeaders } from "../../../Config/TableHeaders";
import "./style.css";
import { statusOptions } from "../../../Config/TableStatus";
import { Select } from "../../../Components/Select";

const formatStatusLabel = (value) => {
  if (!value) return "-";
  const label = value.toString();
  return label.charAt(0).toUpperCase() + label.slice(1);
};

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

  return (
    rawValue
      .split(",")
      .map((part) =>
        part
          .trim()
          .split(" ")
          .filter(Boolean)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      )
      .filter(Boolean)
      .join(", ") || "-"
  );
};

const doctorProfileSkeletonProps = {
  baseColor: "rgba(255, 255, 255, 0.12)",
  highlightColor: "rgba(255, 255, 255, 0.2)",
};

const DoctorDetails = ({ showModal }) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctorProfileLoading, setDoctorProfileLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    per_page: 10,
    search: "",
    status: "",
    from: "",
    to: "",
  });
  const [pagination, updatePagination] = usePagination(1, 10);

  const fetchDoctor = async () => {
    setDoctorProfileLoading(true);
    try {
      const response = await getDetails(`/doctor/${id}`);
      if (response?.status) {
        setDoctor(response.data || null);
      } else {
        setDoctor(null);
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      setDoctor(null);
    } finally {
      setDoctorProfileLoading(false);
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
        updatePagination({
          showData: 0,
          currentPage: 1,
          totalRecords: 0,
          totalPages: 1,
          perPage: filters?.per_page || 10,
        });
      }
    } catch (error) {
      console.error("Error fetching doctor bookings:", error);
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, id]);

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

    const phoneValue =
      `${doctor.dialing_code ? `${doctor.dialing_code} ` : ""}${doctor.phone || "-"}`.trim();

    const experienceList = Array.isArray(doctor.experience)
      ? doctor.experience.map((item) => ({
        id: item.id,
        specialization: item.specialization || "-",
        experience: item.experience || "-",
      }))
      : [];

    const certifications =
      Array.isArray(doctor.certifications) && doctor.certifications.length
        ? doctor.certifications.map((cert) => ({
          id: cert.id,
          institute_name: cert.institute_name || "-",
          certificate_title: cert.certificate_title || "-",
          certificate_picture:
            cert.certificate_picture || images.certificate_image,
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
      name:
        [doctor.first_name, doctor.last_name].filter(Boolean).join(" ") || "-",
      gender: formatNameField(doctor.gender),
      phone: phoneValue || "-",
      phoneValue,
      countryCode: doctor.country_code || "",
      email: doctor.email || "-",
      state: formatNameField(doctor.state),
      city: formatNameField(doctor.city),
      bio: doctor.bio || "-",
      language: formatLanguageField(doctor.language),
      status: doctor.status || "1",
      experienceList,
      certifications,
      photo: doctor.photo || images.placeholder,
    };
  }, [doctor]);

  const infoItems = useMemo(
    () => [
      { key: "user_name", label: t("fields.user_name"), value: details.name },
      { key: "gender", label: t("fields.gender"), value: details.gender },
      { key: "phone", label: t("fields.phone_number"), value: details.phoneValue },
      { key: "email", label: t("fields.email_address"), value: details.email },
      { key: "state", label: t("fields.state"), value: details.state },
      { key: "city", label: t("fields.city"), value: details.city },
      { key: "bio", label: t("fields.bio"), value: details.bio },
      { key: "language", label: t("fields.language"), value: details.language },
      {
        key: "experience",
        label: t("fields.specialization_experience"),
        value: details.experienceList,
      },
    ],
    [details, t],
  );

  const renderInfoValue = (item) => {
    const { key, value } = item;
    if (key === "experience") {
      if (!Array.isArray(value) || !value.length) return "-";
      return value.map((exp) => (
        <div key={exp.id}>
          {exp.specialization} ({exp.experience} {t("common.years")})
        </div>
      ));
    }
    if (key === "phone" && typeof value === "string") {
      return (
        <>
          {getCountryFlag(value, details.countryCode)}
          {value}
        </>
      );
    }
    return value ?? "-";
  };

  const handleStatusChange = (e, userId) => {
    const newStatusValue = e;
    showModal(
      `Mark as ${newStatusValue == "1" ? "Active" : "Inactive"}`,
      `Are you sure you want to change this user's status to ${newStatusValue == "1" ? "Active" : "Inactive"
      }?`,
      () => onConfirmStatusChange(userId, newStatusValue),
    );
  };

  const onConfirmStatusChange = async (userId, newStatusValue) => {
    await post(`/doctor/${userId}/status`, { status: newStatusValue });
    // setProfileData((prevData) => ({
    //     ...prevData,
    //     status: newStatusValue,
    // }));
    // getUser();

    fetchDoctor();
    showModal(
      "Successful",
      `User status has been changed to ${newStatusValue == "1" ? "Active" : "Inactive"
      } successfully.`,
      null,
      true,
    );
  };

  return (
    <DashboardLayout pageTitle={t('pages.doctor_details')}>
      <div className="container-fluid">
        <div className="dashCard doctor-request-view doctor-details-section">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <h2 className="mainTitle mainTitle--with-back mb-4">
              <BackButton2 />
              {t("pages.doctor_details")}
            </h2>
            {doctorProfileLoading ? (
              <Skeleton
                width={160}
                height={44}
                borderRadius={8}
                {...doctorProfileSkeletonProps}
              />
            ) : (
              <div className="status-action">
                <Select
                  className={`tabel-select status${doctor?.status ? "Active" : "Inactive"}`}
                  id={`status${id}`}
                  name="status"
                  label=""
                  value={doctor?.status ? "1" : "0"}
                  onChange={(e) => handleStatusChange(e, id)}
                  labelclass="me-2 mb-0"
                >
                  {statusOptions}
                </Select>
              </div>
            )}
          </div>

          {doctorProfileLoading ? (
            <>
              <div className="doctor-request-summary">
                <div className="d-flex align-items-center gap-5 mb-4 flex-wrap">
                  <Skeleton
                    circle
                    width={120}
                    height={120}
                    {...doctorProfileSkeletonProps}
                  />
                  <div className="d-flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton
                        key={i}
                        width={150}
                        height={42}
                        borderRadius={8}
                        {...doctorProfileSkeletonProps}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="doctor-info-grid">
                <div className="row">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      className="col-xl-3 col-md-6 mb-3"
                      key={`sk-info-${i}`}
                    >
                      <div className="detail-box">
                        <Skeleton
                          width="55%"
                          height={16}
                          {...doctorProfileSkeletonProps}
                          className="mb-2"
                        />
                        <Skeleton
                          width="90%"
                          height={22}
                          {...doctorProfileSkeletonProps}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="doctor-certification mt-5 detail-box">
                <Skeleton
                  width={220}
                  height={28}
                  {...doctorProfileSkeletonProps}
                  className="mb-3"
                />
                <div className="row g-4 align-items-center">
                  <div className="col-xl-5">
                    <div className="detail-box mb-3">
                      <Skeleton
                        width="50%"
                        height={16}
                        {...doctorProfileSkeletonProps}
                        className="mb-2"
                      />
                      <Skeleton
                        width="85%"
                        height={20}
                        {...doctorProfileSkeletonProps}
                      />
                    </div>
                    <div className="detail-box">
                      <Skeleton
                        width="45%"
                        height={16}
                        {...doctorProfileSkeletonProps}
                        className="mb-2"
                      />
                      <Skeleton
                        width="75%"
                        height={20}
                        {...doctorProfileSkeletonProps}
                      />
                    </div>
                  </div>
                  <div className="col-xl-7">
                    <div className="certificate-preview doctor-certificate-preview">
                      <Skeleton height={280} {...doctorProfileSkeletonProps} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="doctor-request-summary">
                <div className="d-flex align-items-center gap-5 mb-4">
                  <div className="detail-box-img">
                    <img src={details.photo} alt={details.name} />
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        navigate(`/admin/doctor-management/${id}/services`)
                      }
                    >
                      {t("provider.view_services")}
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        navigate(`/admin/doctor-management/${id}/reviews`)
                      }
                    >
                      {t("provider.rating_reviews")}
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        navigate(`/admin/doctor-management/${id}/dashboard`)
                      }
                    >
                      {t("sidebar.dashboard")}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        const q = new URLSearchParams({ doctorId: String(id) });
                        if (details?.name) q.set("doctorName", details.name);
                        navigate(`/admin/chat?${q.toString()}`);
                      }}
                    >
                      {t("provider.chat_with_doctor")}
                    </button>
                  </div>
                </div>
              </div>

              <div className="doctor-info-grid">
                <div className="row">
                  {infoItems.map((item) => (
                    <div className="col-xl-3 col-md-6 mb-3" key={item.key}>
                      <div className="detail-box">
                        <h6>{item.label}</h6>
                        <p className="mb-0">{renderInfoValue(item)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="doctor-certification mt-5 detail-box">
                <h3 className="section-title mb-3">{t("common.certificationDetails")}</h3>
                {details.certifications.map((cert, index) => (
                  <div
                    className="row g-4 align-items-center"
                    key={cert.id || index}
                  >
                    <div className="col-xl-3">
                      <div className="detail-box mb-3">
                        <h6>{t("common.instituteName")}</h6>
                        <p className="mb-0">{cert.institute_name}</p>
                      </div>
                    </div>
                    <div className="col-xl-3">
                      <div className="detail-box">
                        <h6>{t("common.certificateTitle")}</h6>
                        <p className="mb-0">{cert.certificate_title}</p>
                      </div>
                    </div>
                    <div className="col-xl-3"></div>
                    <div className="col-xl-6">
                      <div className="certificate-preview doctor-certificate-preview">
                        <img
                          src={cert.certificate_picture}
                          alt="Certificate"
                          className="img-fluid doctor-certificate-image"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="dashCard mt-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
            <h3 className="mainTitle mb-0">{t('pages.booking_logs')}</h3>
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
            dateFilters={[
              {
                title: "Date",
                from: "from",
                to: "to",
                fromTitle: "From",
                toTitle: "To",
              },
            ]}
          >
            <tbody>
              {bookings.map((item, index) => {
                const offset =
                  (pagination.currentPage - 1) *
                  (pagination.perPage || filters.per_page || 10);
                const label =
                  item.status === "past" || item.status === "completed"
                    ? "Past"
                    : formatStatusLabel(item.status);

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
                    <td>{serialNum(offset + index + 1)}</td>
                    <td>#{item.id || "-"}</td>
                    <td>
                      {item.service?.title || item.service_category || "-"}
                    </td>
                    <td>
                      {item.appointment_date ||
                        item.date ||
                        item.created_at ||
                        "-"}
                    </td>
                    <td>{item.amount_paid || item.charges || "-"}</td>
                    <td>
                      <span
                        className={`statusChip status${label.replace(/\s+/g, "")}`}
                      >
                        {label}
                      </span>
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

export default withModal(DoctorDetails);
