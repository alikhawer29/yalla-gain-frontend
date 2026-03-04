import { useEffect, useState } from "react";
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

const EditVideo = ({ showModal }) => {
    const navigate = useNavigate();
    const { videoId } = useParams();
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
    const [initialValues, setInitialValues] = useState({ title: "", language: "", sets: "", rest_time: "", description: "", video: "", thumbnail: "", workout_content_id: "" });

    useEffect(() => {
        const load = async () => {
            const res = await getDetails(`/workout-content/video/${videoId}`);
            if (res?.status) {
                const d = res?.data || {};
                setInitialValues({
                    title: d.title || "",
                    language: d.language || "",
                    sets: d.sets || "",
                    rest_time: d.rest_time || "",
                    description: d.description || "",
                    video: d.video || "",
                    thumbnail: d.thumbnail || "",
                    workout_content_id: d.workout_content_id || "",
                });
            }
        };
        load();
    }, [videoId]);

    const handleSubmit = async (values) => {
        startSubmitting();
        const payload = { ...values };
        // Only send media fields if new Files are selected
        if (typeof values.thumbnail === "string" || !values.thumbnail) delete payload.thumbnail;
        if (typeof values.video === "string" || !values.video) delete payload.video;
        const res = await post(`/workout-content/video/${videoId}/update`, payload);
        if (res?.status) {
            showModal("Successfully", "Video has been updated successfully", () => navigate(`/admin/content-management/videos/${videoId}`), true);
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
                            <h2 className="mainTitle mb-4"><BackButton2 />Edit Video Content</h2>
                            <Formik enableReinitialize initialValues={initialValues} validationSchema={workoutVideoEditSchema} onSubmit={handleSubmit}>
                                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
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

                                            <VideoDropzone label="Upload Video" initialUrl={typeof values.video === 'string' ? values.video : ''} onChange={(file) => setFieldValue("video", file)} />
                                            {touched.video && errors.video ? <div className="red-text">{errors.video}</div> : null}

                                            <ImageDropzone label="Thumbnail" initialUrl={typeof values.thumbnail === 'string' ? values.thumbnail : ''} onChange={(file) => setFieldValue("thumbnail", file)} />
                                            {touched.thumbnail && errors.thumbnail ? <div className="red-text">{errors.thumbnail}</div> : null}

                                            <CustomButton type="submit" variant="primary" text="Update" pendingText="Submitting..." isPending={isSubmitting} />
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

export default withModal(EditVideo);

