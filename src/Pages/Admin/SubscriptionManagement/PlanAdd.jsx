import { useState } from "react";
import { Formik, FieldArray } from "formik";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomInput from "../../../Components/CustomInput";
import { Select } from "../../../Components/Select";
import CustomButton from "../../../Components/CustomButton";
import withModal from "../../../HOC/withModal";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import Toast, { showToast } from "../../../Components/Toast";

import { subscriptionPlanSchema } from "../../../Config/Validations";
import { post } from "../../../Services/Api";

const PlanAdd = ({ showModal }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ title: "", duration: "", price: "", description: "", features: [""] });
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

    const initialValues = form;


    const handleSubmit = async (values) => {
        startSubmitting();

        const payload = { ...values, features: values.features?.filter((f) => f?.trim()) };
        let response = await post("/plan", payload);

        if (response.status) {
            showModal(
                "Successfully",
                "New Plan has been Created Successfully",
                () => navigate("/admin/subscriptions/plans"),
                true
            );
        } else {
            showToast(response?.message ?? "Something went wrong", "error");
        }


        stopSubmitting();
    }


    return (
        <DashboardLayout pageTitle="Subscription Management">
            <div className="container-fluid">
                <div className="dashCard">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="mainTitle mb-4"><BackButton2 />Add New Plan</h2>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={subscriptionPlanSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                                    <form className="row" onSubmit={handleSubmit}>
                                        <div className="col-12 col-xl-6 col-xxl-5">
                                            <CustomInput
                                                wrapperClass="mb-3"
                                                label="Subscription Plan Title"
                                                placeholder="Enter Subscription Plan Title"
                                                name="title"
                                                value={values.title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.title && errors.title}
                                                required
                                            />

                                            <Select
                                                wrapperClass="mb-3"
                                                label="Duration"
                                                labelclass="mb-2"
                                                className="mainInput w-100"
                                                name="duration"
                                                required
                                                value={values.duration}
                                                onChange={(v) => setFieldValue("duration", v)}
                                                onBlur={handleBlur}
                                                error={touched.duration && errors.duration}
                                            >
                                                {[
                                                    { value: "", text: "Select Duration" },
                                                    { value: "monthly", text: "Monthly" },
                                                    { value: "yearly", text: "Yearly" },
                                                ]}
                                            </Select>

                                            <CustomInput
                                                wrapperClass="mb-3"
                                                label="Price"
                                                placeholder="Enter Price"
                                                name="price"
                                                type="number"
                                                value={values.price}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.price && errors.price}
                                                required
                                            />

                                            <CustomInput
                                                wrapperClass="mb-3"
                                                label="Description"
                                                placeholder="Enter Description"
                                                name="description"
                                                type="textarea"
                                                rows={4}
                                                value={values.description}
                                                required
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.description && errors.description}
                                            />

                                            {/* Features dynamic list */}
                                            <div className="mb-3">
                                                <label className="form-label">Features</label>
                                                <FieldArray name="features">
                                                    {({ push, remove }) => (
                                                        <div>
                                                            {values.features?.map((_, index) => (
                                                                <div className="d-flex gap-2 mb-2" key={index}>
                                                                    <div className="flex-grow-1">
                                                                        <CustomInput
                                                                            placeholder={`Enter feature`}
                                                                            name={`features[${index}]`}
                                                                            value={values.features[index]}
                                                                            onChange={handleChange}

                                                                            onBlur={handleBlur}
                                                                            error={touched.features?.[index] && errors.features?.[index]}
                                                                        />
                                                                    </div>
                                                                    <button type="button" className="btn btn-secondary" onClick={() => push("")}>Add</button>
                                                                    {values.features.length > 1 && (
                                                                        <button type="button" className="btn btn-outline-danger" onClick={() => remove(index)}>Remove</button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            {typeof errors.features === 'string' && (
                                                                <div className="red-text">{errors.features}</div>
                                                            )}
                                                        </div>
                                                    )}
                                                </FieldArray>
                                            </div>

                                            <CustomButton type="submit" variant="primary" text="Create Plan" pendingText="Submitting..."
                                                isPending={isSubmitting} />
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

export default withModal(PlanAdd);
