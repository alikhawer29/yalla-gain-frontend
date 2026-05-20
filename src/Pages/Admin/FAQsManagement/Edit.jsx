import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomInput from "../../../Components/CustomInput";
import CustomButton from "../../../Components/CustomButton";
import withModal from "../../../HOC/withModal";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { Select } from "../../../Components/Select";
import { language } from "../../../Config/TableStatus";
import { getDetails, post } from "../../../Services/Api";
import "./style.css";
import ImageDropzone from "../../../Components/ImageDropzone";
import VideoDropzone from "../../../Components/VideoDropzone";

const EditFAQ = ({ showModal }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({
    question: "",
    answer: "",
    image: "",
    video: "",
  });
  const [removeImage, setRemoveImage] = useState(0);
  const [removeVideo, setRemoveVideo] = useState(0);
  const [origMedia, setOrigMedia] = useState({ image: "", video: "" });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getDetails(`/faq/${id}`);
        const d = res?.data || {};
        setInitialValues({
          question: d.question || "",
          answer: d.answer || "",
          image: d.image || "",
          video: d.video || "",
        });
        setOrigMedia({ image: d.image || "", video: d.video || "" });
        setRemoveImage(0);
        setRemoveVideo(0);
      } catch (e) {
        console.error("Failed to load FAQ detail:", e);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (values) => {
    const question = (values.question || "").trim();
    const answer = (values.answer || "").trim();
    const newImage = values.image instanceof File ? values.image : null;
    const newVideo = values.video instanceof File ? values.video : null;

    const hasAnswer = !!answer;
    const hasImage = !!newImage || (!!origMedia.image && !removeImage);
    const hasVideo = !!newVideo || (!!origMedia.video && !removeVideo);

    if (!question) {
      showModal("Error", "Question is required.", null, true);
      return;
    }
    if (!(hasAnswer || hasImage || hasVideo)) {
      showModal(
        "Error",
        "Provide at least one of Answer, Photo or Video.",
        null,
        true,
      );
      return;
    }

    const payload = {
      question,
      remove_image: removeImage,
      remove_video: removeVideo,
    };
    if (hasAnswer) payload.answer = answer;
    if (newImage) payload.image = newImage;
    if (newVideo) payload.video = newVideo;

    const res = await post(`/faq/${id}/update`, payload);
    if (res?.status) {
      showModal(
        "Successfully",
        "FAQ has been updated successfully.",
        () => navigate(`/admin/faqs-management`),
        true,
      );
    } else {
      showModal("Error", res?.message || "Something went wrong.", null, true);
    }
  };

  const handleDelete = () => {
    showModal(
      "Delete FAQ",
      "Are you sure you want to delete this FAQ?",
      async () => {
        const res = await post(`/faq/${id}/delete`, {});
        if (res?.status) {
          showModal(
            null,
            "FAQ has been deleted successfully.",
            () => navigate("/admin/faqs-management"),
            true,
          );
        } else {
          showModal(
            "Error",
            res?.message || "Could not delete FAQ.",
            null,
            true,
          );
        }
      },
    );
  };

  return (
    <DashboardLayout pageTitle={t('sidebar.faqs_management')}>
      <div className="container-fluid">
        <div className="dashCard">
          <div className="row">
            <div className="col-12">
              <h2 className="mainTitle mb-4">
                <BackButton2 />
                Edit FAQs
              </h2>

              <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-12">
                        <CustomInput
                          wrapperClass="mb-3"
                          label="Question"
                          placeholder="Write a question..."
                          name="question"
                          value={values.question}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          required
                        />

                        <CustomInput
                          wrapperClass="mb-3"
                          label="Text"
                          placeholder="Add Text Answer"
                          name="answer"
                          type="textarea"
                          rows={5}
                          value={values.answer}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                      <div className="col-6">
                        <ImageDropzone
                          label="Upload Photo"
                          initialUrl={
                            typeof initialValues.image === "string"
                              ? initialValues.image
                              : ""
                          }
                          onChange={(f) => {
                            setFieldValue("image", f);
                            if (f === null) setRemoveImage(1);
                            else if (f instanceof File) setRemoveImage(0);
                          }}
                        />
                      </div>
                      <div className="col-6">
                        <VideoDropzone
                          label="Upload Video"
                          initialUrl={
                            typeof initialValues.video === "string"
                              ? initialValues.video
                              : ""
                          }
                          onChange={(f) => {
                            setFieldValue("video", f);
                            if (f === null) setRemoveVideo(1);
                            else if (f instanceof File) setRemoveVideo(0);
                          }}
                        />
                      </div>
                    </div>
                    <CustomButton
                      type="submit"
                      variant="primary"
                      text="Update"
                    />
                    <CustomButton
                      type="button"
                      className="ms-3"
                      variant="secondary"
                      text="Delete"
                      onClick={handleDelete}
                    />
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

export default withModal(EditFAQ);
