import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton2 from "../../../../Components/BackButton/BackButton2";
import CustomButton from "../../../../Components/CustomButton";
import CustomInput from "../../../../Components/CustomInput";
import ImageDropzone from "../../../../Components/ImageDropzone";
import { DashboardLayout } from "../../../../Components/Layouts/AdminLayout/DashboardLayout";
import { Select } from "../../../../Components/Select";
import VideoDropzone from "../../../../Components/VideoDropzone";
import { workoutVideoAddSchema } from "../../../../Config/Validations";
import withModal from "../../../../HOC/withModal";
import { useFormStatus } from "../../../../Hooks/useFormStatus";
import { getDetails, post } from "../../../../Services/Api";

const AddVideo = ({ showModal }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: contentId } = useParams();
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const [muscleTitle, setMuscleTitle] = useState("");
  const [exerciseOptions, setExerciseOptions] = useState([]);
  const [muscleId, setMuscleId] = useState(null);

  const initialValues = {
    sets: "",
    rest_time: "",
    description: "",
    video: "",
    thumbnail: "",
    exercise_id: "",
  };

  const handleSubmit = async (values) => {
    startSubmitting();
    const payload = { ...values, workout_content_id: contentId };
    const res = await post(`/workout-content/video`, payload);
    if (res?.status) {
      showModal(
        "Successfully",
        "Video has been created successfully",
        () => navigate(`/admin/content-management/${contentId}`),
        true,
      );
    } else {
      showModal("Error", res?.message ?? "Something went wrong", null, true);
    }
    stopSubmitting();
  };

  useEffect(() => {
    const load = async () => {
      const res = await getDetails(`/workout-content/${contentId}`);
      if (res?.status) {
        const d = res?.data || {};
        setMuscleTitle(d.muscle_title || "");
        setMuscleId(d?.muscle?.id);
        // Load exercises for this muscle
        if (d?.muscle?.id) {
          const exerciseRes = await getDetails(
            `/muscles/${d?.muscle?.id}/exercises`,
          );
          if (exerciseRes?.status && exerciseRes?.data) {
            const options = [
              { value: "", text: "Select Exercise" },
              ...exerciseRes.data.map((item) => ({
                value: item.id,
                text: item.text,
              })),
            ];
            setExerciseOptions(options);
          }
        }
      }
    };
    load();
  }, [contentId]);

  return (
    <DashboardLayout pageTitle={t('sidebar.content_management')}>
      <div className="container-fluid">
        <div className="dashCard">
          <div className="row">
            <div className="col-12">
              <h2 className="mainTitle mb-4">
                <BackButton2 />
                Add Video Content - {muscleTitle}
              </h2>
              <Formik
                initialValues={initialValues}
                validationSchema={workoutVideoAddSchema}
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
                        required
                        onChange={(file) => setFieldValue("video", file)}
                      />
                      {touched.video && errors.video ? (
                        <div className="red-text">{errors.video}</div>
                      ) : null}

                      <ImageDropzone
                        label="Thumbnail"
                        required
                        onChange={(file) => setFieldValue("thumbnail", file)}
                      />
                      {touched.thumbnail && errors.thumbnail ? (
                        <div className="red-text">{errors.thumbnail}</div>
                      ) : null}

                      <CustomButton
                        type="submit"
                        variant="primary"
                        text="Add Video"
                        pendingText="Submitting..."
                        isPending={isSubmitting}
                      />
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withModal(AddVideo);
