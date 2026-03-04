import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomInput from "../../../Components/CustomInput";
import { Select } from "../../../Components/Select";
import CustomButton from "../../../Components/CustomButton";
import withModal from "../../../HOC/withModal";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import ImageDropzone from "../../../Components/ImageDropzone";
import { generalStatus, serviceCategoryTypeOptions } from "../../../Config/TableStatus";
import { post } from "../../../Services/Api";
import { serviceCategoryAddSchema } from "../../../Config/Validations";

const AddServiceCategory = ({ showModal }) => {
    const navigate = useNavigate();
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

    const initialValues = { title: "", type: "", status: "", image: "" };

    const handleSubmit = async (values) => {
        startSubmitting();
        const payload = { ...values };
        const response = await post(`/service-category`, payload);
        if (response?.status) {
            showModal("Successfully", "Category has been added successfully", () => navigate(`/admin/service-category-management`), true);
        } else {
            showModal("Error", response?.message ?? "Something went wrong", null, true);
        }
        stopSubmitting();
    };

    return (
        <DashboardLayout pageTitle="Service Category Management">
            <div className="container-fluid">
                <div className="dashCard">
                    <div className="row">
                        <div className="col-12 col-xl-6 col-xxl-5">
                            <h2 className="mainTitle mb-4"><BackButton2 />Add Category</h2>
                            <Formik initialValues={initialValues} validationSchema={serviceCategoryAddSchema} onSubmit={handleSubmit}>
                                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                                    <form onSubmit={handleSubmit}>
                                        <CustomInput
                                            wrapperClass="mb-3"
                                            label="Category Title"
                                            placeholder="Enter Category Title"
                                            name="title"
                                            value={values.title}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={touched.title && errors.title}
                                            required
                                        />

                                        <Select
                                            wrapperClass="mb-3"
                                            label="Type"
                                            className="mainInput w-100"
                                            name="type"
                                            value={values.type}
                                            onChange={(value) => setFieldValue("type", value)}
                                            onBlur={handleBlur}
                                            error={touched.type && errors.type}
                                            required
                                        >
                                            {serviceCategoryTypeOptions}
                                        </Select>

                                        <Select
                                            wrapperClass="mb-3"
                                            label="Status"
                                            className="mainInput w-100"
                                            name="status"
                                            value={values.status}
                                            onChange={(value) => setFieldValue("status", value)}
                                            onBlur={handleBlur}
                                            error={touched.status && errors.status}
                                            required
                                        >
                                            {generalStatus}
                                        </Select>

                                        <ImageDropzone label="Upload Image" required onChange={(file) => setFieldValue("image", file)} />
                                        {touched.image && errors.image ? (
                                            <div className="red-text mb-3">{errors.image}</div>
                                        ) : null}

                                        <CustomButton type="submit" variant="primary" text="Add Category" isPending={isSubmitting} />
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

export default withModal(AddServiceCategory);

