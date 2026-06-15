import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomInput from "../../../../Components/CustomInput";
import { Select } from "../../../../Components/Select";
import CustomButton from "../../../../Components/CustomButton";
import withModal from "../../../../HOC/withModal";
import BackButton2 from "../../../../Components/BackButton/BackButton2";
import { useFormStatus } from "../../../../Hooks/useFormStatus";
import { language } from "../../../../Config/TableStatus";
import { getDetails, post } from "../../../../Services/Api";
import ImageDropzone from "../../../../Components/ImageDropzone";
import VideoDropzone from "../../../../Components/VideoDropzone";
import { workoutVideoEditSchema } from "../../../../Config/Validations";
import "./style.css";

const videoEditSkeletonProps = {
  baseColor: "rgba(255, 255, 255, 0.12)",
  highlightColor: "rgba(255, 255, 255, 0.2)",
};

const VideoEditFormSkeleton = () => (
  <div className="video-edit-skeleton col-12 col-xl-6 col-xxl-5">
    {Array.from({ length: 3 }, (_, index) => (
      <div className="mb-3" key={`video-edit-field-sk-${index}`}>
        <Skeleton
          width={index === 2 ? "30%" : "25%"}
          height={18}
          {...videoEditSkeletonProps}
          className="mb-2"
        />
        <Skeleton
          height={index === 2 ? 120 : 48}
          borderRadius={8}
          {...videoEditSkeletonProps}
        />
      </div>
    ))}
    {Array.from({ length: 2 }, (_, index) => (
      <div className="mb-3" key={`video-edit-media-sk-${index}`}>
        <Skeleton
          width="28%"
          height={18}
          {...videoEditSkeletonProps}
          className="mb-2"
        />
        <Skeleton
          height={index === 0 ? 220 : 180}
          borderRadius={12}
          {...videoEditSkeletonProps}
        />
      </div>
    ))}
    <Skeleton
      width={140}
      height={44}
      borderRadius={8}
      {...videoEditSkeletonProps}
    />
  </div>
);

const EditVideo = ({ showModal }) => {
  const navigate = useNavigate();
  const { videoId } = useParams();
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const [initialValues, setInitialValues] = useState({
    sets: "",
    rest_time: "",
    description: "",
    video: "",
    thumbnail: "",
    workout_content_id: "",
    exercise_id: "",
  });
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const [muscleId, setMuscleId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await getDetails(`/workout-content/video/${videoId}`);
        if (!cancelled && res?.status) {
          const d = res?.data || {};
          setInitialValues({
            sets: d.sets || "",
            rest_time: d.rest_time || "",
            description: d.description || "",
            video: d.video || "",
            thumbnail: d.thumbnail || "",
            workout_content_id: d.workout_content_id || "",
            exercise_id: d.exercise_id || "",
          });

          if (d?.exercise?.muscle_id) {
            const muscleIdValue = d.exercise.muscle_id;
            setMuscleId(muscleIdValue);
            const exerciseRes = await getDetails(
              `/muscles/${muscleIdValue}/exercises`,
            );
            if (!cancelled && exerciseRes?.status && exerciseRes?.data) {
              const options = exerciseRes.data.map((item) => ({
                value: item.id,
                text: item.text,
              }));
              setExerciseOptions(options);
            }
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Unable to fetch video details:", error);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [videoId]);

  const handleSubmit = async (values) => {
    startSubmitting();
    const payload = { ...values };
    // Only send media fields if new Files are selected
    if (typeof values.thumbnail === "string" || !values.thumbnail)
      delete payload.thumbnail;
    if (typeof values.video === "string" || !values.video) delete payload.video;
    const res = await post(`/workout-content/video/${videoId}/update`, payload);
    if (res?.status) {
      showModal(
        "Successfully",
        "Video has been updated successfully",
        () => navigate(`/admin/content-management/videos/${videoId}`),
        true,
      );
    } else {
      showModal("Error", res?.message ?? "Something went wrong", null, true);
    }
    stopSubmitting();
  };

  return (
    <DashboardLayout pageTitle="Content Management">
      <div className="container-fluid">
        <div className="dashCard">
          <div className="row">
            <div className="col-12">
              <h2 className="mainTitle mb-4">
                <BackButton2 />
                Edit Video Content
              </h2>
              {loading ? (
                <div className="row">
                  <VideoEditFormSkeleton />
                </div>
              ) : (
              <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={workoutVideoEditSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                }) => (
                  <form className="row" onSubmit={handleSubmit}>
                    <div className="col-12 col-xl-6 col-xxl-5">
                      <Select
                        wrapperClass="mb-3"
                        label="Exercise"
                        name="exercise_id"
                        value={values.exercise_id}
                        onChange={(v) => {
                          console.log("Exercise ID:", v);
                          setFieldValue("exercise_id", v);
                        }}
                        error={touched.exercise_id && errors.exercise_id}
                      >
                        {exerciseOptions}
                      </Select>

                      <CustomInput
                        wrapperClass="mb-3"
                        label="Sets"
                        placeholder="Enter sets"
                        name="sets"
                        type="number"
                        min="0"
                        value={values.sets}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.sets && errors.sets}
                        required
                      />

                      <CustomInput
                        wrapperClass="mb-3"
                        label="Rest Time"
                        placeholder="Enter rest time (in seconds)"
                        name="rest_time"
                        type="number"
                        min="0"
                        value={values.rest_time}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.rest_time && errors.rest_time}
                        required
                      />

                      <CustomInput
                        wrapperClass="mb-3"
                        label="Description"
                        placeholder="Enter description"
                        name="description"
                        type="textarea"
                        rows={4}
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.description && errors.description}
                        required
                      />

                      <VideoDropzone
                        label="Upload Video"
                        initialUrl={
                          typeof values.video === "string" ? values.video : ""
                        }
                        onChange={(file) => setFieldValue("video", file)}
                      />
                      {touched.video && errors.video ? (
                        <div className="red-text">{errors.video}</div>
                      ) : null}

                      <ImageDropzone
                        label="Thumbnail"
                        initialUrl={
                          typeof values.thumbnail === "string"
                            ? values.thumbnail
                            : ""
                        }
                        onChange={(file) => setFieldValue("thumbnail", file)}
                      />
                      {touched.thumbnail && errors.thumbnail ? (
                        <div className="red-text">{errors.thumbnail}</div>
                      ) : null}

                      <CustomButton
                        type="submit"
                        variant="primary"
                        text="Update"
                        pendingText="Submitting..."
                        isPending={isSubmitting}
                      />
                    </div>
                  </form>
                )}
              </Formik>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withModal(EditVideo);
