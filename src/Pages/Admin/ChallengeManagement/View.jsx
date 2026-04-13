import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import { Select } from "../../../Components/Select";
import { statusOptions } from "../../../Config/TableStatus";
import withModal from "../../../HOC/withModal";
import { getDetails, post } from "../../../Services/Api";
import "./style.css";

const capitalize = (v) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : v);

const ChallengeView = ({ showModal }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const fetchContent = async () => {
    try {
      const res = await getDetails(`/challenge/${id}`);
      if (res?.status) setData(res?.data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchContent();
  }, [id]);

  const handleStatusChange = (e) => {
    const newStatusValue = e;
    showModal(
      `Mark as ${newStatusValue == "1" ? "Active" : "Inactive"}`,
      `Are you sure you want to ${newStatusValue == "1" ? "Active" : "Inactive"} Challenge?`,
      () => onConfirmStatusChange(newStatusValue),
    );
  };

  const onConfirmStatusChange = async (newStatusValue) => {
    await post(`/challenge/${id}/status`);
    await fetchContent();
    showModal(
      "Successful",
      `Challenge has been ${newStatusValue == "1" ? "Activeted" : "Deactivated"} successfully.`,
      null,
      true,
    );
  };

  return (
    <DashboardLayout pageTitle="Challenge Management">
      <div className="container-fluid">
        <div className="dashCard">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mainTitle mb-0">
              <BackButton2 />
              View Challenge
            </h2>
            <div className="d-flex align-items-center gap-2">
              <div className="status-action">
                <Select
                  className={`tabel-select status${data?.status ? "Active" : "Inactive"}`}
                  id={`status${id}`}
                  name="status"
                  label=""
                  value={data?.status ? "1" : "0"}
                  onChange={handleStatusChange}
                  labelclass="me-2 mb-0"
                >
                  {statusOptions}
                </Select>
              </div>
            </div>
          </div>
          <div className="row content-view">
            <div className="col-12 col-xxl-8">
              {data?.image && (
                <div className="mb-3">
                  <img
                    src={data.image}
                    alt="challenge"
                    style={{ maxWidth: 420, borderRadius: 8 }}
                  />
                </div>
              )}
              <div className="row mb-3">
                <div className="col-md-6">
                  <h5 className="detail-label">Challenge Title</h5>
                  <p className="detail-value">{data?.title ?? "-"}</p>
                </div>
                <div className="col-md-6">
                  <h5 className="detail-label">Type Of Challenge</h5>
                  <p className="detail-value">
                    {capitalize(data?.type) ?? "-"}
                  </p>
                </div>
                <div className="col-md-6">
                  <h5 className="detail-label">Milestone To Be Achieved</h5>
                  <p className="detail-value">{data?.milestone ?? "-"}</p>
                </div>
                <div className="col-md-6">
                  <h5 className="detail-label">Duration</h5>
                  <p className="detail-value">
                    {data?.duration ? data?.duration + " Days" : "-"}
                  </p>
                </div>
                <div className="col-md-6">
                  <h5 className="detail-label">Reward</h5>
                  <p className="detail-value">
                    {data?.reward ? data?.reward + " Yalla Coin" : "-"}
                  </p>
                </div>
              </div>
              <div className="mb-4">
                <h5 className="detail-label">Description:</h5>
                <p className="detail-value-weak mb-0">
                  {data?.description ?? "-"}
                </p>
              </div>

              {data?.body_parts?.length > 0 && (
                <div className="mb-5">
                  <h5 className="body-parts-heading mb-4">
                    Effective percentage on body parts ( can be +- both):
                  </h5>
                  <div className="row">
                    <div className="col-12">
                      <h5 className="detail-label mb-4">Body Parts</h5>
                      {data.body_parts.map((item, index) => (
                        <div
                          className="d-flex align-items-center mb-4 gap-5"
                          key={index}
                        >
                          <div className="body-part-chip">{item.text}</div>
                          <div className="percentage-info">
                            <h6 className="percentage-label mb-1">
                              Effective Percentage
                            </h6>
                            <p className="percentage-value mb-0">
                              {item.percentage}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <button
                className="btn btn-primary add-btn"
                onClick={() => navigate(`/admin/challenges/${id}/edit`)}
              >
                Edit Content
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withModal(ChallengeView);
