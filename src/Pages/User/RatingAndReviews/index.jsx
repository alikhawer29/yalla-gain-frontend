import { useEffect, useState } from "react";
import { Col, Container, ProgressBar, Row } from "react-bootstrap";
import { FaRegStar, FaStar } from "react-icons/fa6";
import Rating from "react-rating";
import { useParams } from "react-router-dom";
import CustomButton from "../../../Components/CustomButton";
import { ratingReviewsData } from "../../../Config/data";
// import { ratingReviewsData } from "../../../Config/data";
import withFilters from "../../../HOC/withFilters";
import { usePageTitleUser } from "../../../Utils/helper";
import "./style.css";

const RatingsAndReviews = () => {
  usePageTitleUser("Rating & Review");

  const { id } = useParams();
  const [productDetails, setProductDetails] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [reviewsFilter, setReviewsFilter] = useState("All");

  const getReviews = async () => {
    const response = ratingReviewsData?.detail?.data;
    if (response && Array.isArray(response)) {
      setProductDetails(response);
    }
  };

  // UseEffect for calling the async function and handling other side effects
  useEffect(() => {
    getReviews();
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [id]);

  useEffect(() => {
    setFilteredReviews(
      reviews?.comments?.filter((c) => {
        if (reviewsFilter === "All") return c;
        else {
          return Number(c.rating) === Number(reviewsFilter);
        }
      })
    );
  }, [reviews, reviewsFilter]);

  return (
    <Container fluid>
      <div className="py-sm-5 py-3 px-sm-0 px-1">
        <div className="site_card">
          <Row>
            <Col sm={12} className="mb-3 mb-lg-4">
              <h2 className="page-title fw-bold mb-0 text-center">
                Rating & Reviews
              </h2>
            </Col>
          </Row>
          <Row>
            <Col xs={12} lg={10} className="pt-4 pt-lg-5 mx-auto">
              {productDetails.map((product, index) => {
                const filteredReviews =
                  reviewsFilter === "All"
                    ? product?.reviews?.comments ?? []
                    : (product?.reviews?.comments ?? []).filter(
                        (review) => review.rating === parseInt(reviewsFilter)
                      );

                return (
                  <div key={index} className="product-reviews box-shadow">
                    <Row>
                      <Col
                        xs={12}
                        className="d-flex flex-wrap justify-content-between align-items-center gap-4 rating-reviews"
                      >
                        <div className="d-flex flex-column align-items-start reviews-info">
                          <div className="d-flex gap-4 align-items-baseline">
                            <h3 className="fw-bold">
                              {product?.rating}
                              <span>/5</span>
                            </h3>
                            <p className="review-count mb-0">
                              {product?.reviews?.count} Reviews
                            </p>
                          </div>
                          <Rating
                            className="mt-3"
                            emptySymbol={
                              <FaRegStar color="#FFE420" size={40} />
                            }
                            fullSymbol={<FaStar size={40} color="#FFE420" />}
                            initialRating={parseFloat(product?.rating).toFixed(
                              1
                            )}
                            readonly
                          />
                        </div>

                        <div className="reviews-bar">
                          <div className="reviews-item d-flex flex-wrap align-items-center gap-lg-4 gap-2">
                            <label htmlFor="rating1">5 Star</label>
                            <ProgressBar variant="progress" now={90} />
                            <span>30</span>
                          </div>
                          <div className="reviews-item d-flex flex-wrap align-items-center gap-lg-4 gap-2">
                            <label htmlFor="rating2">4 Star</label>
                            <ProgressBar variant="progress" now={75} />
                            <span>20</span>
                          </div>
                          <div className="reviews-item d-flex flex-wrap align-items-center gap-lg-4 gap-2">
                            <label htmlFor="rating3">3 Star</label>
                            <ProgressBar variant="progress" now={20} />
                            <span>5</span>
                          </div>
                          <div className="reviews-item d-flex flex-wrap align-items-center gap-lg-4 gap-2">
                            <label htmlFor="rating4">2 Star</label>
                            <ProgressBar variant="progress" now={10} />
                            <span>1</span>
                          </div>
                          <div className="reviews-item d-flex flex-wrap align-items-center gap-lg-4 gap-2">
                            <label htmlFor="rating5">1 Star</label>
                            <ProgressBar variant="progress" now={4} />
                            <span>1</span>
                          </div>
                        </div>
                      </Col>

                      <Col xs={12} className="mt-4 pt-3">
                        <div className="d-flex flex-wrap gap-3 review-tabs">
                          {["All", "5", "4", "3", "2", "1"].map((star) => (
                            <CustomButton
                              key={star}
                              onClick={() => setReviewsFilter(star)}
                              className={`btn ${
                                reviewsFilter === star
                                  ? "btn-primary"
                                  : "btn-outline-primary"
                              }`}
                            >
                              {star !== "All" ? (
                                <div className="d-flex align-items-center">
                                  <FaStar color="#FFB400" />
                                  <span>{star}</span>
                                </div>
                              ) : (
                                "All"
                              )}
                            </CustomButton>
                          ))}
                        </div>

                        <hr className="my-5" />

                        {filteredReviews.length > 0 ? (
                          filteredReviews.map((review, i) => (
                            <div
                              key={i}
                              className="card-comment d-flex flex-md-row flex-column align-items-md-center gap-3 mt-4"
                            >
                              <div className="d-flex flex-grow-1 gap-3 comment-info">
                                <img
                                  className="profile-avatar"
                                  src={review.user?.["photo-path"]}
                                  alt="user_photo"
                                />
                                <div className="flex-grow-1 align-self-center">
                                  <div className="star-rating d-flex gap-1 mb-3">
                                    {Array.from({ length: review.rating }).map(
                                      (_, j) => (
                                        <FaStar
                                          key={`${i}-${j}`}
                                          style={{ color: "#FFE420" }}
                                        />
                                      )
                                    )}
                                  </div>
                                  <h6 className="mb-1">{review.user?.name}</h6>
                                  <time
                                    className="published-date"
                                    dateTime={review.timestamp}
                                  >
                                    {review.timestamp}
                                  </time>
                                </div>
                              </div>
                              <div className="d-flex flex-grow-1 align-self-center">
                                <div className="comment-text">
                                  <p>{review.comment}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No {reviewsFilter} star review</p>
                        )}
                      </Col>
                    </Row>
                  </div>
                );
              })}
            </Col>
          </Row>
        </div>
      </div>
    </Container>
  );
};

export default withFilters(RatingsAndReviews);
