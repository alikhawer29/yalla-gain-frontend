import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomInput from "../../../Components/CustomInput";
import { Select } from "../../../Components/Select";
import CustomButton from "../../../Components/CustomButton";
import withModal from "../../../HOC/withModal";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { language, exerciseKeys } from "../../../Config/TableStatus";
import { post } from "../../../Services/Api";
import { workoutContentAddSchema } from "../../../Config/Validations";
import ImageDropzone from "../../../Components/ImageDropzone";

const AddContent = ({ showModal }) => {
    const navigate = useNavigate();
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

    const initialValues = { title: "", exercise_key: "", image: "", description: "", language: "" };

    const handleSubmit = async (values) => {
        startSubmitting();
        const payload = { ...values };
        const res = await post(`/workout-content`, payload);
        if (res?.status) {
            showModal("Successfully", "New content has been created successfully", () => navigate("/admin/content-management"), true);
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
                            <h2 className="mainTitle mb-4"><BackButton2 />Add Workout Content</h2>
                            <Formik initialValues={initialValues} validationSchema={workoutContentAddSchema} onSubmit={handleSubmit}>
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
                                                required
                                                onChange={(file) => setFieldValue("image", file)}
                                            />
                                            {touched.image && errors.image ? (
                                                <div className="red-text">{errors.image}</div>
                                            ) : null}

                                            <CustomButton type="submit" variant="primary" text="Create" pendingText="Submitting..." isPending={isSubmitting} />
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

export default withModal(AddContent);
