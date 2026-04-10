import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { Select } from "../../../Components/Select";
import { normalStatus, statusOptions } from "../../../Config/TableStatus";
import withModal from "../../../HOC/withModal";
import { getDetails, post } from "../../../Services/Api";
import "./style.css";
import CustomTable from "../../../Components/CustomTable";
import { contentVideoHeaders } from "../../../Config/TableHeaders";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { usePagination } from "../../../Hooks/usePagination";
import { getAll } from "../../../Services/Api";
import { clickableTableRowNavProps, serialNum } from "../../../Utils/helper";

const ContentView = ({ showModal }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const [videos, setVideos] = useState([]);
  const [filters, setFilters] = useState({
    page: 1,
    per_page: 10,
    search: "",
    from: "",
    to: "",
    status: "",
  });
  const [pagination, updatePagination] = usePagination(1, 10);

  const fetchContent = async () => {
    try {
      const res = await getDetails(`/workout-content/${id}`);
      if (res?.status) setContent(res?.data);
    } catch (e) {}
  };

  useEffect(() => {
    fetchContent();
  }, [id]);

  const fetchVideos = async () => {
    try {
      startSubmitting(true);
      const params = { ...filters };
      if (!params.status || params.status === "all") delete params.status;
      if (!params.from) delete params.from;
      if (!params.to) delete params.to;
      const res = await getAll(`/workout-content/${id}/videos`, params);
      if (res?.status) {
        const data = res?.data || [];
        const meta = res?.meta || {};
        setVideos(data);
        const total = meta?.total ?? data?.length ?? 0;
        const per_page = meta?.per_page ?? Number(filters?.per_page || 10);
        const current_page = meta?.current_page ?? Number(filters?.page || 1);
        const to = meta?.to ?? Math.min(total, current_page * per_page);
        updatePagination({
          showData: to,
          currentPage: current_page,
          totalRecords: total,
          totalPages: Math.max(1, Math.ceil(total / per_page)),
          perPage: per_page,
        });
      }
    } catch (e) {
    } finally {
      stopSubmitting(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [filters, id]);

  const handleVideoStatusChange = (e, videoId) => {
    const newStatus = e;
    showModal(
      `Mark as ${newStatus == "1" ? "Active" : "Inactive"}`,
      `Are you sure you want to change this video's status to ${newStatus == "1" ? "Active" : "Inactive"}?`,
      async () => {
        await post(`/workout-content/video/${videoId}/status`);
        fetchVideos();
        showModal(
          "Successful",
          `Video status has been changed to ${newStatus == "1" ? "Active" : "Inactive"} successfully.`,
          null,
          true,
        );
      },
    );
  };

  const handleStatusChange = (e) => {
    const newStatusValue = e;
    showModal(
      `Mark as ${newStatusValue == "1" ? "Active" : "Inactive"}`,
      `Are you sure you want to change this content's status to ${newStatusValue == "1" ? "Active" : "Inactive"}?`,
      () => onConfirmStatusChange(newStatusValue),
    );
  };

  const onConfirmStatusChange = async (newStatusValue) => {
    await post(`/workout-content/${id}/status`);
    await fetchContent();
    showModal(
      "Successful",
      `Content status has been changed to ${newStatusValue == "1" ? "Active" : "Inactive"} successfully.`,
      null,
      true,
    );
  };

  return (
    <DashboardLayout pageTitle="Content Management">
      <div className="container-fluid">
        {/* Details Card */}
        <div className="dashCard">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mainTitle mb-0">
                  <BackButton2 />
                  View Content
                </h2>
                <div className="d-flex align-items-center gap-2">
                  <div className="status-action">
                    <Select
                      className={`tabel-select status${content?.status ? "Active" : "Inactive"}`}
                      id={`status${id}`}
                      name="status"
                      label=""
                      value={content?.status ? "1" : "0"}
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
                  {/* <div className="mb-4">
                    <h5 className="detail-label">Title:</h5>
                    <p className="detail-value mb-0">{content?.title ?? "-"}</p>
                  </div> */}

                  <div className="row mb-4">
                    <div className="mb-4">
                      <h5 className="detail-label">Muscle:</h5>
                      <p className="detail-value mb-0">
                        {content?.muscle_title ?? "-"}
                      </p>
                    </div>
                    {/* <div className="col-md-4">
                      <h5 className="detail-label">Exercise Type:</h5>
                      <p className="detail-value mb-0">
                        {content?.exercise_title ?? "-"}
                      </p>
                    </div> */}
                    {/* <div className="col-md-4">
                      <h5 className="detail-label">Language:</h5>
                      <p className="detail-value mb-0">
                        {content?.language
                          ? content?.language.charAt(0).toUpperCase() +
                            content?.language.slice(1)
                          : "-"}
                      </p>
                    </div> */}
                    <div className="col-md-4">
                      <h5 className="detail-label">Created On:</h5>
                      <p className="detail-value mb-0">
                        {content?.created_at ?? "-"}
                      </p>
                    </div>
                  </div>
                  {content?.image && (
                    <div className="mb-4 image-box">
                      <h5 className="detail-label">Image:</h5>
                      <img src={content.image} alt={content?.title} />
                    </div>
                  )}
                  <div className="mb-4">
                    <h5 className="detail-label">Description:</h5>
                    <p className="detail-value-weak mb-0">
                      {content?.description
                        ? content?.description.charAt(0).toUpperCase() +
                          content?.description.slice(1)
                        : "-"}
                    </p>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      navigate(`/admin/content-management/${id}/edit`)
                    }
                  >
                    Edit Content
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Videos Management Card */}
        <div className="dashCard mt-4">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="mainTitle mb-0">Videos</h3>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    navigate(`/admin/content-management/${id}/videos/add`)
                  }
                >
                  Add Video
                </button>
              </div>
              <CustomTable
                filters={filters}
                setFilters={setFilters}
                loading={isSubmitting}
                headers={contentVideoHeaders}
                pagination={pagination}
                selectOptions={[
                  {
                    main_title: "Filter by status",
                    title: "status",
                    options: normalStatus,
                  },
                ]}
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
                  {videos.map((item, index) => (
                    <tr
                      key={item.id}
                      {...clickableTableRowNavProps(
                        navigate,
                        `/admin/content-management/videos/${item.id}`,
                      )}
                    >
                      <td>
                        {serialNum(
                          (filters.page - 1) * filters.per_page + index + 1,
                        )}
                      </td>
                      <td>{item?.exercise?.text}</td>
                      <td>{item?.sets}</td>
                      <td>{item?.rest_time} seconds</td>
                      {/* <td>{item?.language}</td> */}
                      <td>{item?.created_at}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <Select
                          className={`tabel-select w-50 status${item?.status ? "Active" : "Inactive"}`}
                          id={`status-video-${item?.id}`}
                          name="status"
                          value={item?.status ? "1" : "0"}
                          onChange={(e) => handleVideoStatusChange(e, item?.id)}
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withModal(ContentView);
