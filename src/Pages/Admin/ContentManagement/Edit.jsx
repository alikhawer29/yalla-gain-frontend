import { useEffect, useState } from "react";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomInput from "../../../Components/CustomInput";
import { Select } from "../../../Components/Select";
import CustomButton from "../../../Components/CustomButton";
import withModal from "../../../HOC/withModal";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { language, exerciseKeys } from "../../../Config/TableStatus";
import { getDetails, post } from "../../../Services/Api";
import { workoutContentEditSchema } from "../../../Config/Validations";
import ImageDropzone from "../../../Components/ImageDropzone";

const EditContent = ({ showModal }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
    const [initialValues, setInitialValues] = useState({ title: "", exercise_key: "", image: "", description: "", language: "" });

    useEffect(() => {
        const load = async () => {
            const res = await getDetails(`/workout-content/${id}`);
            if (res?.status) {
                const d = res?.data || {};
                setInitialValues({
                    title: d.title || "",
                    exercise_key: d.exercise_key || "",
                    image: d.image || "",
                    description: d.description || "",
                    language: d.language || "",
                });
            }
        };
        load();
    }, [id]);

    const handleSubmit = async (values) => {
        startSubmitting();
        // Only send image if a new File has been selected
        const payload = { ...values };
        if (typeof values.image === "string" || values.image === null || values.image === undefined) {
            delete payload.image;
        }
        const res = await post(`/workout-content/${id}/update`, payload);
        if (res?.status) {
            showModal("Successfully", "Content has been updated successfully", () => navigate(`/admin/content-management/${id}`), true);
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
                            <h2 className="mainTitle mb-4"><BackButton2 />Edit Workout Content</h2>
                            <Formik enableReinitialize initialValues={initialValues} validationSchema={workoutContentEditSchema} onSubmit={handleSubmit}>
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
                                                label="Exercise Type"
                                                labelclass="mb-2"
                                                className="mainInput w-100"
                                                name="exercise_key"
                                                required
                                                value={values.exercise_key}
                                                onChange={(v) => setFieldValue("exercise_key", v)}
                                                onBlur={handleBlur}
                                                error={touched.exercise_key && errors.exercise_key}
                                            >
                                                {exerciseKeys}
                                            </Select>

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

                                            <Select
                                                wrapperClass="mb-3"
                                                label="Language"
                                                labelclass="mb-2"
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

                                            <ImageDropzone
                                                label="Upload Image"
                                                initialUrl={typeof initialValues.image === 'string' ? initialValues.image : ''}
                                                onChange={(file) => setFieldValue("image", file)}
                                            />
                                            {touched.image && errors.image ? (
                                                <div className="red-text">{errors.image}</div>
                                            ) : null}

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

export default withModal(EditContent);
