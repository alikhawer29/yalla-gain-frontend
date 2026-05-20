import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomInput from "../../../Components/CustomInput";
import CustomButton from "../../../Components/CustomButton";
import withModal from "../../../HOC/withModal";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { Select } from "../../../Components/Select";
import { language } from "../../../Config/TableStatus";
import { post } from "../../../Services/Api";
import "./style.css";
import ImageDropzone from "../../../Components/ImageDropzone";
import VideoDropzone from "../../../Components/VideoDropzone";

const AddFAQ = ({ showModal }) => {
    const navigate = useNavigate();
    const initialValues = { question: "", answer: "", image: null, video: null };

    const handleSubmit = async (values) => {
        // validations based on API requirements
        const question = (values.question || "").trim();
        const answer = (values.answer || "").trim();
        const image = values.image instanceof File ? values.image : null;
        const video = values.video instanceof File ? values.video : null;

        if (!question) {
            showModal("Error", "Question is required.", null, true);
            return;
        }

        if (!answer && !image && !video) {
            showModal(
                "Error",
                "Provide at least one of Answer, Photo or Video.",
                null,
                true
            );
            return;
        }

        const payload = { question };
        if (answer) payload.answer = answer;
        if (image) payload.image = image;
        if (video) payload.video = video;

        const res = await post(`/faq`, payload);
        if (res?.status) {
            showModal(
                "Successfully",
                "FAQ has been added successfully.",
                () => navigate("/admin/faqs-management"),
                true
            );
        } else {
            showModal("Error", res?.message || "Something went wrong.", null, true);
        }
    };

    return (
        <DashboardLayout pageTitle={t('sidebar.faqs_management')}>
            <div className="container-fluid">
                <div className="dashCard">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="mainTitle mb-4"><BackButton2 />{t('pages.add_faqs')}</h2>

                            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                                {({ values, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
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
                                                <ImageDropzone label="Upload Photo" onChange={(f) => setFieldValue("image", f)} />
                                            </div>
                                            <div className="col-6">
                                                <VideoDropzone label="Upload Video" onChange={(f) => setFieldValue("video", f)} />
                                            </div>
                                        </div>
                                        <CustomButton type="submit" text="Add FAQs" className="btn btn-primary" />
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

export default withModal(AddFAQ);
