import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import CustomPagination from "../../../Components/CustomPagination";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import { usePagination } from "../../../Hooks/usePagination";
import { getAll, getDetails } from "../../../Services/Api";
import { images } from "../../../Assets";
import "./style.css";

const INITIAL_STATS = {
    averageRating: 0,
    totalCount: 0,
    counts: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    },
    percents: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    },
};

const DoctorReviews = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [doctorName, setDoctorName] = useState("-");
    const [stats, setStats] = useState(INITIAL_STATS);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ page: 1, rating: "" });
    const [pagination, updatePagination] = usePagination(1, 15);

    const fetchDoctorName = async () => {
        try {
            const response = await getDetails(`/doctor/${id}`);
            if (response?.status) {
                const name = [response.data?.first_name, response.data?.last_name]
                    .filter(Boolean)
                    .join(" ");
                setDoctorName(name || "-");
            } else {
                setDoctorName("-");
            }
        } catch (error) {
            console.error("Error fetching doctor details:", error);
            setDoctorName("-");
        }
    };

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const params = { page: filters.page };
            if (filters.rating) {
                params.rating = filters.rating;
            }

            const response = await getAll(`/doctor/${id}/reviews`, params);
            if (response) {
                setStats({
                    averageRating: Number(response.averageRating) || 0,
                    totalCount: Number(response.totalCount) || 0,
                    counts: {
                        5: Number(response.fiveStarCount) || 0,
                        4: Number(response.fourStarCount) || 0,
                        3: Number(response.threeStarCount) || 0,
                        2: Number(response.twoStarCount) || 0,
                        1: Number(response.oneStarCount) || 0,
                    },
                    percents: {
                        5: Number(response.fiveStarPercent) || 0,
                        4: Number(response.fourStarPercent) || 0,
                        3: Number(response.threeStarPercent) || 0,
                        2: Number(response.twoStarPercent) || 0,
                        1: Number(response.oneStarPercent) || 0,
                    },
                });

                const ratingData = response.ratings?.data ?? [];
                setReviews(ratingData);

                const meta = response.ratings?.meta ?? {};
                const total = meta?.total ?? ratingData.length ?? 0;
                const perPage = meta?.per_page ?? 15;
                const currentPage = meta?.current_page ?? filters.page ?? 1;
                const showData = meta?.to ?? Math.min(total, currentPage * perPage);
                updatePagination({
                    showData,
                    currentPage,
                    totalRecords: total,
                    totalPages: Math.max(1, Math.ceil(total / perPage)),
                    perPage,
                });
            } else {
                setStats(INITIAL_STATS);
                setReviews([]);
                updatePagination({ showData: 0, currentPage: 1, totalRecords: 0, totalPages: 1, perPage: 15 });
            }
        } catch (error) {
            console.error("Error fetching doctor reviews:", error);
            setStats(INITIAL_STATS);
            setReviews([]);
            updatePagination({ showData: 0, currentPage: 1, totalRecords: 0, totalPages: 1, perPage: 15 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctorName();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        fetchReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, id]);

    const ratingSummary = useMemo(
        () => [5, 4, 3, 2, 1].map((value) => ({
            value: String(value),
            label: `${value} Star`,
            count: stats.counts[value],
            percent: stats.percents[value],
        })),
        [stats]
    );

    const averageRatingDisplay = useMemo(() => stats.averageRating.toFixed(1), [stats.averageRating]);

    const handleRatingChange = (event) => {
        const { value } = event.target;
        setFilters((prev) => ({
            ...prev,
            page: 1,
            rating: value,
        }));
    };

    return (
        <DashboardLayout pageTitle="Doctor Reviews">
            <div className="container-fluid">
                <div className="dashCard doctor-reviews-section">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
                        <h2 className="mainTitle mb-4">
                            <BackButton2 />
                            Rate & Reviews
                        </h2>
                        {/* <button
                            className="btn btn-outline-primary"
                            onClick={() => navigate(`/admin/doctor-management/${id}`)}
                        >
                            Back to Profile
                        </button> */}
                    </div>

                    <div className="rating-summary-card">
                        <div className="rating-score">
                            <h3 className="score-value">{averageRatingDisplay}/5</h3>
                            <p className="score-count mb-0">({stats.totalCount})</p>
                        </div>
                        <div className="rating-bars flex-grow-1">
                            {/* <label className="rating-bar-row" key="all">
                                <span className="rating-option">
                                    <input
                                        type="radio"
                                        name="ratingFilter"
                                        value=""
                                        checked={filters.rating === ""}
                                        onChange={handleRatingChange}
                                    />
                                    <span className="bar-label">All</span>
                                </span>
                                <div className="bar-track">
                                    <div className="bar-fill" style={{ width: `${stats.totalCount ? 100 : 0}%` }} />
                                </div>
                                <span className="bar-count">{stats.totalCount}</span>
                            </label> */}
                            {ratingSummary.map((item) => (
                                <label className="rating-bar-row" key={item.label}>
                                    <span className="rating-option">
                                        <input
                                            type="radio"
                                            name="ratingFilter"
                                            value={item.value}
                                            checked={filters.rating === item.value}
                                            onChange={handleRatingChange}
                                        />
                                        <span className="bar-label">{item.label}</span>
                                    </span>
                                    <div className="bar-track">
                                        <div className="bar-fill" style={{ width: `${item.percent}%` }} />
                                    </div>
                                    <span className="bar-count">{item.count}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="review-list mt-4">
                        {loading ? (
                            <p className="text-center text-white-50 mb-0">Loading reviews...</p>
                        ) : reviews.length ? (
                            reviews.map((review) => {
                                const reviewerName = [review.user?.first_name, review.user?.last_name]
                                    .filter(Boolean)
                                    .join(" ") || "-";
                                const reviewerAvatar = review.user?.photo || images.placeholder;
                                const reviewDate = review.created_at || "-";
                                const ratingValue = Number(review.rating) || 0;

                                return (
                                    <div className="review-card" key={review.id}>
                                        <div className="d-flex flex-column flex-md-row gap-3">
                                            <div className="reviewer-info">
                                                <img src={reviewerAvatar} alt={reviewerName} className="review-avatar"
                                                    onError={(e) => e.target.src = images.placeholder} />
                                                <div>
                                                    <div className="review-stars">
                                                        {Array.from({ length: 5 }).map((_, index) => (
                                                            <FontAwesomeIcon
                                                                key={index}
                                                                icon={faStar}
                                                                className={index < ratingValue ? "filled" : "muted"}
                                                            />
                                                        ))}
                                                    </div>
                                                    <h4 className="reviewer-name mb-1">{reviewerName}</h4>
                                                    <p className="review-date mb-2">{reviewDate}</p>

                                                </div>
                                            </div>
                                            <p className="review-comment mb-0">{review.review || "-"}</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-center text-white-50 mb-0">No reviews found.</p>
                        )}
                    </div>

                    <CustomPagination pagination={pagination} setFilters={setFilters} />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DoctorReviews;


