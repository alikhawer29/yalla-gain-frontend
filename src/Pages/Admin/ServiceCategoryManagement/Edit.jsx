import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomInput from "../../../Components/CustomInput";
import { Select } from "../../../Components/Select";
import CustomButton from "../../../Components/CustomButton";
import withModal from "../../../HOC/withModal";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import ImageDropzone from "../../../Components/ImageDropzone";
import { generalStatus, serviceCategoryTypeOptions } from "../../../Config/TableStatus";
import { getDetails, post } from "../../../Services/Api";
import { serviceCategoryEditSchema } from "../../../Config/Validations";

const normalizeStatus = (value) => {
    if (value === 1 || value === "1" || value === true || String(value).toLowerCase() === "active") {
        return "1";
    }
    return "0";
};

const EditServiceCategory = ({ showModal }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
    const [initialValues, setInitialValues] = useState({ title: "", type: "", status: "", image: "" });

    useEffect(() => {
        const loadDetails = async () => {
            try {
                const res = await getDetails(`/service-category/${id}`);
                if (res?.status) {
                    const data = res?.data || {};
                    setInitialValues({
                        title: data?.title || data?.name || "",
                        type: data?.type || "",
                        status: normalizeStatus(data?.status),
                        image: data?.image || "",
                    });
                }
            } catch (error) {
                console.error("Unable to fetch category details:", error);
            }
        };

        loadDetails();
    }, [id]);

    const handleSubmit = async (values) => {
        startSubmitting();
        const payload = { ...values };
        if (typeof values.image === "string" || values.image === null || values.image === undefined) {
            delete payload.image;
        }
        const response = await post(`/service-category/${id}/update`, payload);
        if (response?.status) {
            showModal("Successfully", "Category has been updated successfully", () => navigate(`/admin/service-category-management/${id}`), true);
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
                            <h2 className="mainTitle mb-4"><BackButton2 />Edit Category</h2>
                            <Formik enableReinitialize initialValues={initialValues} validationSchema={serviceCategoryEditSchema} onSubmit={handleSubmit}>
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

                                        <ImageDropzone
                                            label="Upload Image"
                                            initialUrl={typeof values.image === "string" ? values.image : ""}
                                            onChange={(file) => setFieldValue("image", file)}
                                        />
                                        {touched.image && errors.image ? (
                                            <div className="red-text mb-3">{errors.image}</div>
                                        ) : null}

                                        <CustomButton type="submit" variant="primary" text="Update Category" isPending={isSubmitting} />
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

export default withModal(EditServiceCategory);

