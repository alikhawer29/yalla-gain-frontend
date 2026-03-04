import { useEffect, useState } from "react";
import { Formik, FieldArray } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomInput from "../../../Components/CustomInput";
import { Select } from "../../../Components/Select";
import CustomButton from "../../../Components/CustomButton";
import withModal from "../../../HOC/withModal";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { subscriptionPlanSchema } from "../../../Config/Validations";
import { getDetails, post } from "../../../Services/Api";
import { useFormStatus } from "../../../Hooks/useFormStatus";

const initial = { title: "Monthly", duration: "1 Month", price: "15 Yalla Coins", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet." };

const PlanEdit = ({ showModal }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
    const [form, setForm] = useState({ title: "", duration: "", price: "", description: "", features: [""] });
    const initialValues = form;

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getDetails(`/plan/${id}`);
                if (res?.status) {
                    const d = res.data || {};
                    setForm({
                        title: d.title || "",
                        duration: (d.duration || "").toLowerCase(),
                        price: d.price?.toString() || "",
                        description: d.description || "",
                        features: Array.isArray(d.features) && d.features.length ? d.features : [""],
                    });
                }
            } catch (e) {
                // ignore for now; could add toast
            }
        };
        load();
    }, [id]);

    return (
        <DashboardLayout pageTitle="Subscription Management">
            <div className="container-fluid">
                <div className="dashCard">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="mainTitle mb-4"><BackButton2 />Edit Plan</h2>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={subscriptionPlanSchema}
                                enableReinitialize
                                onSubmit={async (values) => {
                                    startSubmitting();
                                    const payload = {
                                        title: values.title,
                                        duration: values.duration,
                                        price: values.price,
                                        description: values.description,
                                        features: values.features?.filter((f) => f?.trim()),
                                    };
                                    await post(`/plan/${id}/update`, payload);
                                    stopSubmitting();
                                    showModal("Successfully", "Plan has been updated Successfully", () => navigate(`/admin/subscriptions/plans/${id}`), true);
                                }}
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
                                                rows={5}
                                                value={values.description}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.description && errors.description}
                                            />

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
                                            <CustomButton type="submit" variant="primary" text="Update Plan" isPending={isSubmitting} pendingText="Updating..." />
                                        </div>
                                        <div className="col-12 col-xl-10 d-none">
                                            <CustomButton type="submit" variant="primary" text="Update Plan" isPending={isSubmitting} pendingText="Updating..." />
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

export default withModal(PlanEdit);
