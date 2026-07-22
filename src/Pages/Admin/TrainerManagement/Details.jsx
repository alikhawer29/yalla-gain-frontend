import { useEffect, useMemo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate, useParams } from "react-router-dom";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomTable from "../../../Components/CustomTable";
import withModal from "../../../HOC/withModal";
import { getDetails, getAll, post } from "../../../Services/Api";
import BookingStatusText from "../../../Components/BookingStatusText";
import {
  clickableTableRowNavProps,
  serialNum,
  getCountryFlag,
} from "../../../Utils/helper";
import { getBookingLocalDate } from "../../../Utils/timezone";
import { usePagination } from "../../../Hooks/usePagination";
import { images } from "../../../Assets";
import { doctorBookingHeaders } from "../../../Config/TableHeaders";
import "./style.css";
import { statusOptions } from "../../../Config/TableStatus";
import { Select } from "../../../Components/Select";

const trainerProfileSkeletonProps = {
  baseColor: "rgba(255, 255, 255, 0.12)",
  highlightColor: "rgba(255, 255, 255, 0.2)",
};

const formatStatusLabel = (value) => {
  if (!value) return "-";
  const label = value.toString();
  return label.charAt(0).toUpperCase() + label.slice(1);
};

const formatNameField = (field) => {
  if (field == null || field === "") return "-";
  if (typeof field === "string") {
    const t = field.trim();
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : "-";
  }
  if (typeof field === "object") {
    const n = field.name ?? field.title ?? field.label;
    if (n != null && String(n).trim()) {
      const s = String(n).trim();
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
  }
  return "-";
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

const TrainerDetails = ({ showModal }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainerProfileLoading, setTrainerProfileLoading] = useState(true);
  const [Trainer, setTrainer] = useState(null);
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

  const fetchTrainer = async () => {
    setTrainerProfileLoading(true);
    try {
      const response = await getDetails(`/doctor/${id}`);
      if (response?.status) {
        setTrainer(response.data || null);
      } else {
        setTrainer(null);
      }
    } catch (error) {
      console.error("Error fetching Trainer details:", error);
      setTrainer(null);
    } finally {
      setTrainerProfileLoading(false);
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

  const details = useMemo(() => {
    if (!Trainer) {
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
      `${Trainer.dialing_code ? `${Trainer.dialing_code} ` : ""}${Trainer.phone || "-"}`.trim();

    const experienceList = Array.isArray(Trainer.experience)
      ? Trainer.experience.map((item) => ({
          id: item.id,
          specialization: item.specialization || "-",
          experience: item.experience || "-",
        }))
      : [];

    const certifications =
      Array.isArray(Trainer.certifications) && Trainer.certifications.length
        ? Trainer.certifications.map((cert) => ({
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
        [Trainer.first_name, Trainer.last_name].filter(Boolean).join(" ") ||
        "-",
      gender: formatNameField(Trainer.gender),
      phone: phoneValue || "-",
      phoneValue,
      countryCode: Trainer.country_code || "",
      email: Trainer.email || "-",
      state: formatNameField(Trainer.state),
      city: formatNameField(Trainer.city),
      bio: Trainer.bio || "-",
      language: formatLanguageField(Trainer.language),
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
    [details],
  );

  const handleStatusChange = (e, userId) => {
    const newStatusValue = e;
    showModal(
      `Mark as ${newStatusValue == "1" ? "Active" : "Inactive"}`,
      `Are you sure you want to change this user's status to ${
        newStatusValue == "1" ? "Active" : "Inactive"
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

    fetchTrainer();
    showModal(
      "Successful",
      `User status has been changed to ${
        newStatusValue == "1" ? "Active" : "Inactive"
      } successfully.`,
      null,
      true,
    );
  };

  return (
    <DashboardLayout pageTitle="Trainer Details">
      <div className="container-fluid">
        <div className="dashCard Trainer-request-view Trainer-details-section">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <h2 className="mainTitle mb-4">
              <BackButton2 />
              Trainer Details
            </h2>
            {trainerProfileLoading ? (
              <Skeleton
                width={160}
                height={44}
                borderRadius={8}
                {...trainerProfileSkeletonProps}
              />
            ) : (
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
            )}
          </div>

          {trainerProfileLoading ? (
            <>
              <div className="Trainer-request-summary">
                <div className="d-flex align-items-center gap-5 mb-4 flex-wrap">
                  <Skeleton
                    circle
                    width={120}
                    height={120}
                    {...trainerProfileSkeletonProps}
                  />
                  <div className="d-flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton
                        key={i}
                        width={150}
                        height={42}
                        borderRadius={8}
                        {...trainerProfileSkeletonProps}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="Trainer-info-grid">
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
                          {...trainerProfileSkeletonProps}
                          className="mb-2"
                        />
                        <Skeleton
                          width="90%"
                          height={22}
                          {...trainerProfileSkeletonProps}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="Trainer-certification mt-5 detail-box">
                <Skeleton
                  width={220}
                  height={28}
                  {...trainerProfileSkeletonProps}
                  className="mb-3"
                />
                <div className="row g-4 align-items-center">
                  <div className="col-xl-5">
                    <div className="detail-box mb-3">
                      <Skeleton
                        width="50%"
                        height={16}
                        {...trainerProfileSkeletonProps}
                        className="mb-2"
                      />
                      <Skeleton
                        width="85%"
                        height={20}
                        {...trainerProfileSkeletonProps}
                      />
                    </div>
                    <div className="detail-box">
                      <Skeleton
                        width="45%"
                        height={16}
                        {...trainerProfileSkeletonProps}
                        className="mb-2"
                      />
                      <Skeleton
                        width="75%"
                        height={20}
                        {...trainerProfileSkeletonProps}
                      />
                    </div>
                  </div>
                  <div className="col-xl-7">
                    <div className="certificate-preview doctor-certificate-preview">
                      <Skeleton height={280} {...trainerProfileSkeletonProps} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="Trainer-request-summary">
                <div className="d-flex align-items-center gap-5 mb-4">
                  <div className="detail-box-img">
                    <img src={details.photo} alt={details.name} />
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        navigate(`/admin/trainer-management/${id}/services`)
                      }
                    >
                      View Services
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        navigate(`/admin/trainer-management/${id}/reviews`)
                      }
                    >
                      Rating & Reviews
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        navigate(`/admin/trainer-management/${id}/dashboard`)
                      }
                    >
                      Dashboard
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        const q = new URLSearchParams({
                          trainerId: String(id),
                        });
                        if (details?.name) q.set("trainerName", details.name);
                        navigate(`/admin/chat?${q.toString()}`);
                      }}
                    >
                      Chat With Trainer
                    </button>
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
                          {label === "Phone Number" &&
                            typeof value === "string" && (
                              <span>
                                {getCountryFlag(value, details.countryCode)}
                              </span>
                            )}
                          {label === "Specialization and Experience" &&
                          Array.isArray(value)
                            ? value.map((item) => (
                                <div key={item.id}>
                                  {item.specialization} ({item.experience}{" "}
                                  years)
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
                  <div
                    className="row g-4 align-items-center"
                    key={cert.id || index}
                  >
                    <div className="col-xl-3">
                      <div className="detail-box mb-3">
                        <h6>Institute Name</h6>
                        <p className="mb-0">{cert.institute_name}</p>
                      </div>
                    </div>
                    <div className="col-xl-3">
                      <div className="detail-box">
                        <h6>Certificate Title</h6>
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
                      {getBookingLocalDate(item)}
                    </td>
                    <td>{item.amount_paid || item.charges || "-"}</td>
                    <td>
                      <BookingStatusText
                        status={
                          item.status === "past" || item.status === "completed"
                            ? "past"
                            : item.status
                        }
                      />
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
