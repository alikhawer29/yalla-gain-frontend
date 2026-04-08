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
import { post } from "../../../../Services/Api";
import ImageDropzone from "../../../../Components/ImageDropzone";
import VideoDropzone from "../../../../Components/VideoDropzone";
import { workoutVideoAddSchema } from "../../../../Config/Validations";

const AddVideo = ({ showModal }) => {
  const navigate = useNavigate();
  const { id: contentId } = useParams();
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const initialValues = {
    title: "",
    language: "",
    sets: "",
    rest_time: "",
    description: "",
    video: "",
    thumbnail: "",
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

  return (
    <DashboardLayout pageTitle="Content Management">
      <div className="container-fluid">
        <div className="dashCard">
          <div className="row">
            <div className="col-12">
              <h2 className="mainTitle mb-4">
                <BackButton2 />
                Add Video Content
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
                      <CustomInput
                        wrapperClass="mb-3"
                        label="Title"
                        placeholder="Enter title"
                        name="title"
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.title && errors.title}
                        required
                      />

                      <Select
                        wrapperClass="mb-3"
                        label="Language"
                        className="mainInput w-100"
                        name="language"
                        required
                        value={values.language}
                        onChange={(v) => setFieldValue("language", v)}
                        onBlur={handleBlur}
                        error={touched.language && errors.language}
                      >
                        {language}
                      </Select>

                      <CustomInput
                        wrapperClass="mb-3"
                        label="Sets"
                        placeholder="Enter sets"
                        name="sets"
                        type="number"
                        value={values.sets}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.sets && errors.sets}
                        required
                      />

                      <CustomInput
                        wrapperClass="mb-3"
                        label="Rest Time"
                        placeholder="Enter rest time (in minutes)"
                        name="rest_time"
                        type="number"
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
