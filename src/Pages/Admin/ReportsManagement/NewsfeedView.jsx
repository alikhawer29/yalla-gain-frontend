import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link, useParams } from "react-router-dom";
import { images } from "../../../Assets";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import withModal from "../../../HOC/withModal";
import { getDetails, post } from "../../../Services/Api";
import { dateFormat, getCountryFlag } from "../../../Utils/helper";
import "./style.css";

const formatContactPhone = (dialingCode, phone) => {
  const code = dialingCode?.toString().trim() || "";
  const num = phone?.toString().trim() || "";
  if (!code && !num) return "";
  const normalizedCode = code.startsWith("+") ? code : `+${code}`;
  return [normalizedCode, num].filter(Boolean).join(" ").trim();
};

const reportViewSkeletonProps = {
  baseColor: "rgba(255, 255, 255, 0.12)",
  highlightColor: "rgba(255, 255, 255, 0.2)",
};

const NewsfeedView = ({ showModal, reasonModal, closeModal }) => {
  const { id } = useParams();
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await getDetails(`/reports/feed/${id}`);
        if (res?.status && res?.data) {
          const data = res.data;
          setDetail({
            id: data?.id,
            created_at: data?.created_at,
            reason: data?.reason,
            user: {
              id: data?.user?.id,
              first_name: data?.user?.first_name,
              last_name: data?.user?.last_name,
              email: data?.user?.email,
              phone: data?.user?.phone,
              dialing_code: data?.user?.dialing_code,
              photo: data?.user?.photo || images.placeholder,
            },
            post_id: data?.post?.id ?? data?.post_id,
          });
          setStatus(data?.status === 1 ? "Pending" : "Resolved");
        } else {
          setDetail(null);
        }
      } catch (e) {
        console.error("Error fetching feed report detail:", e);
        setDetail(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const onResolve = () => {
    showModal(
      "Resolved Report",
      "Are you sure you want to mark this report as Resolved?",
      async () => {
        try {
          const res = await post(`/reports/feed/${id}/status`, {});
          if (res?.status) {
            setStatus("Resolved");
            reasonModal(
              null,
              "Report has been marked resolved",
              closeModal,
              true,
              false,
              "",
              "",
              "",
              "",
              true,
            );
          } else {
            showModal(
              "Failed",
              res?.message || "Could not resolve report.",
              null,
              true,
            );
          }
        } catch (e) {
          console.error("Error updating feed report status:", e);
          showModal("Failed", "Could not resolve report.", null, true);
        }
      },
      false,
    );
  };

  return (
    <DashboardLayout pageTitle="View Report">
      <div className="container-fluid">
        <div className="dashCard report-view">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2 className="mainTitle mb-0">
              <BackButton2 /> View Report
            </h2>
            {loading ? (
              <Skeleton width={100} height={24} {...reportViewSkeletonProps} />
            ) : (
              <div>
                <label style={{ color: "#666" }} className="fw-medium">
                  Status
                </label>
                <span
                  className={`ms-2 fw-semibold status ${status.toLowerCase()}`}
                >
                  {status}
                </span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="d-flex flex-md-row flex-column">
              <div className="flex-grow-1">
                <Skeleton
                  width={140}
                  height={28}
                  {...reportViewSkeletonProps}
                  className="mb-3"
                />
                <div className="booking-detail-card mb-4">
                  <div className="d-flex align-items-center flex-wrap gap-3 my-4">
                    <Skeleton
                      circle
                      width={100}
                      height={100}
                      {...reportViewSkeletonProps}
                    />
                    <div className="flex-grow-1">
                      <Skeleton
                        width={120}
                        height={14}
                        {...reportViewSkeletonProps}
                        className="mb-2"
                      />
                      <Skeleton
                        width={180}
                        height={22}
                        {...reportViewSkeletonProps}
                      />
                    </div>
                    <Skeleton
                      width={160}
                      height={44}
                      borderRadius={8}
                      {...reportViewSkeletonProps}
                    />
                  </div>
                </div>
                <div className="row">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div
                      className="col-xxl-3 col-xl-6 mb-3"
                      key={`user-sk-${i}`}
                    >
                      <div className="detail-box">
                        <Skeleton
                          width="55%"
                          height={16}
                          {...reportViewSkeletonProps}
                          className="mb-2"
                        />
                        <Skeleton
                          width="85%"
                          height={22}
                          {...reportViewSkeletonProps}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Skeleton
                  width={160}
                  height={28}
                  {...reportViewSkeletonProps}
                  className="my-4"
                />
                <div className="row my-2">
                  <div className="col-xxl-3 col-xl-6 mb-3">
                    <div className="detail-box">
                      <Skeleton
                        width="50%"
                        height={16}
                        {...reportViewSkeletonProps}
                        className="mb-2"
                      />
                      <Skeleton
                        width="70%"
                        height={22}
                        {...reportViewSkeletonProps}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-6 col-xl-12 mb-3">
                    <div className="detail-box">
                      <Skeleton
                        width="40%"
                        height={16}
                        {...reportViewSkeletonProps}
                        className="mb-2"
                      />
                      <Skeleton height={80} {...reportViewSkeletonProps} />
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-2 mt-2">
                  <Skeleton
                    width={160}
                    height={44}
                    borderRadius={8}
                    {...reportViewSkeletonProps}
                  />
                  <Skeleton
                    width={130}
                    height={44}
                    borderRadius={8}
                    {...reportViewSkeletonProps}
                  />
                </div>
              </div>
            </div>
          ) : !detail ? (
            <p className="text-white mb-0">Report not found.</p>
          ) : (
            <div className="d-flex flex-md-row flex-column">
              <div className="flex-grow-1 order-1 order-md-0">
                <div className="row">
                  <div className="col-xxl-10 col-lg-9">
                    <div className="mb-4">
                      <h2 className="my-2 sub-title">User Detail</h2>
                      <div className="booking-detail-card">
                        <div className="d-flex align-items-center flex-wrap">
                          <div className="d-flex gap-sm-3 gap-2 align-items-center">
                            <div className="d-flex align-items-center gap-5 my-4">
                              <div className="detail-box-img">
                                <img
                                  src={detail?.user?.photo}
                                  alt="user"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = images.placeholder;
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <span className="info-label">User Name</span>
                              <p
                                className="info-value mb-0"
                                style={{ fontSize: 16 }}
                              >
                                {[
                                  detail?.user?.first_name,
                                  detail?.user?.last_name,
                                ]
                                  .filter(Boolean)
                                  .join(" ") || "-"}
                              </p>
                            </div>
                          </div>
                          <div className="ms-3">
                            <Link
                              className="btn btn-secondary"
                              to={`/admin/user-management/${detail?.user?.id || ""}`}
                            >
                              View User Details
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="row mt-3">
                        {[
                          {
                            label: "User Name",
                            value: [
                              detail?.user?.first_name,
                              detail?.user?.last_name,
                            ]
                              .filter(Boolean)
                              .join(" "),
                          },
                          {
                            label: "Phone Number",
                            value: formatContactPhone(
                              detail?.user?.dialing_code,
                              detail?.user?.phone,
                            ),
                          },
                          {
                            label: "E-Mail Address",
                            value: detail?.user?.email,
                          },
                        ].map(({ label, value }) => (
                          <div className="col-xxl-3 col-xl-6 mb-3" key={label}>
                            <div className="detail-box">
                              <h6>{label}</h6>
                              <p className="mb-0">
                                {label === "Phone Number" && value && (
                                  <span>{getCountryFlag(value)}</span>
                                )}{" "}
                                {value || "-"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <h2 className="mb-4 sub-title">Report Details</h2>
                    <div className="row my-2">
                      <div className="col-xxl-3 col-xl-6 mb-3">
                        <div className="detail-box">
                          <h6>Report Date</h6>
                          <p className="mb-0">
                            {dateFormat(detail?.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="col-xxl-6 col-xl-12 mb-3">
                        <div className="detail-box">
                          <h6>Message</h6>
                          <p className="mb-0">{detail?.reason || "-"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex gap-2 mt-2">
                      {status === "Pending" && (
                        <button className="btn btn-primary" onClick={onResolve}>
                          Mark As Resolved
                        </button>
                      )}
                      {detail?.post_id && (
                        <Link
                          className="btn btn-secondary"
                          to={`/admin/reports-management/newsfeed/${detail.post_id}/post`}
                        >
                          View Post
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withModal(NewsfeedView);
