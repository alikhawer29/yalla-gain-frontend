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
import { challengeKinds } from "../../../Config/TableStatus";
import { getDetails, post } from "../../../Services/Api";
import { io } from "socket.io-client";
import { challengeEditSchema } from "../../../Config/Validations";

const STATIC_CHALLENGES = [
    { id: 1, title: "Abc", type: "run", duration: "1 Day", milestone: "Run 1 hour daily", reward: "10 Yalla Coin", description: "Lorem ipsum", image: "" },
    { id: 2, title: "Xyz", type: "workout", duration: "10 Day", milestone: "10 pushups daily", reward: "5 Yalla Coin", description: "Lorem ipsum", image: "" },
];

const EditChallenge = ({ showModal }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
    const [initialValues, setInitialValues] = useState({ title: "", type: "", duration: "", milestone: "", reward: "", description: "", image: "" });
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const s = io("https://custom-dev.onlinetestingserver.com:2170/", {
            transports: ["websocket"],
        });

        s.on("connect", () => {
            console.log("[Challenge Edit] Socket connected", s.id);
        });

        s.on("connect_error", (err) => {
            console.log("[Challenge Edit] Socket connect_error", err?.message || err);
        });

        s.on("disconnect", (reason) => {
            console.log("[Challenge Edit] Socket disconnected", reason);
        });

        setSocket(s);

        return () => {
            console.log("[Challenge Edit] Cleaning up socket");
            s.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket || !id) return;

        const handler = (payload) => {
            console.log("[Challenge Edit] Received closeIFrame event", payload);
            if (payload?.challenge_id && Number(payload.challenge_id) === Number(id)) {
                console.log("[Challenge Edit] challenge_id matched, redirecting to /admin/challenges");
                navigate("/admin/challenges");
            }
        };

        const baseEvent = "closeIFrame";
        const dynamicEvent = `${baseEvent}${id}`;

        console.log("[Challenge Edit] Subscribing to socket events", {
            baseEvent,
            dynamicEvent,
        });

        socket.on(baseEvent, handler);
        socket.on(dynamicEvent, handler);

        return () => {
            console.log("[Challenge Edit] Unsubscribing from socket events", {
                baseEvent,
                dynamicEvent,
            });
            socket.off(baseEvent, handler);
            socket.off(dynamicEvent, handler);
        };
    }, [socket, id, navigate]);

    useEffect(() => {
        const load = async () => {
            const res = await getDetails(`/challenge/${id}`);
            if (res?.status) {
                const d = res?.data || {};
                setInitialValues({
                    title: d.title || "",
                    type: d.type || "",
                    image: d.image || "",
                    description: d.description || "",
                    duration: d.duration || "",
                    milestone: d.milestone || "",
                    reward: d.reward || "",
                });
            }
        };
        load();
    }, [id]);

    const handleSubmit = async (values) => {
        startSubmitting();
        const payload = { ...values };
        if (typeof values.image === "string" || values.image === null || values.image === undefined) {
            delete payload.image;
        }
        const res = await post(`/challenge/${id}/update`, payload);
        if (res?.status) {
            showModal("Successfully", "Challenge has been updated successfully", null, true);
        } else {
            showModal("Error", res?.message ?? "Something went wrong", null, true);
        }
        stopSubmitting();
    };

    return (
        <DashboardLayout pageTitle="Challenge Management">
            <div className="container-fluid">
                <div className="dashCard">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="mainTitle mb-4"><BackButton2 />Edit Challenge</h2>
                            <Formik enableReinitialize initialValues={initialValues} validationSchema={challengeEditSchema} onSubmit={handleSubmit}>
                                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
                                    <form className="row" onSubmit={handleSubmit}>
                                        <div className="col-12 col-xl-6 col-xxl-5">
                                            <CustomInput
                                                wrapperClass="mb-3"
                                                label="Challenge Title"
                                                placeholder="Enter Challenge Title"
                                                name="title"
                                                value={values.title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.title && errors.title}
                                                required
                                            />

                                            <Select
                                                wrapperClass="mb-3"
                                                label="Type Of Challenge"
                                                className="mainInput w-100"
                                                name="type"
                                                required
                                                value={values.type}
                                                onChange={(v) => setFieldValue("type", v)}
                                                onBlur={handleBlur}
                                                error={touched.type && errors.type}
                                            >
                                                {challengeKinds}
                                            </Select>

                                            <CustomInput
                                                wrapperClass="mb-3"
                                                label="Duration"
                                                placeholder="e.g., 10 Days"
                                                name="duration"
                                                value={values.duration}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.duration && errors.duration}
                                                required
                                            />

                                            <CustomInput
                                                wrapperClass="mb-3"
                                                label="Add Milestone To Be Achieved"
                                                placeholder="Write milestone to be achieved"
                                                name="milestone"
                                                value={values.milestone}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.milestone && errors.milestone}
                                                required
                                            />

                                            <CustomInput
                                                wrapperClass="mb-3"
                                                label="Reward"
                                                placeholder="e.g., 10 Yalla Coins"
                                                name="reward"
                                                value={values.reward}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.reward && errors.reward}
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
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.description && errors.description}
                                                required
                                            />

                                            <ImageDropzone label="Upload Image" initialUrl={typeof values.image === 'string' ? values.image : ''} onChange={(file) => setFieldValue("image", file)} />
                                            {touched.image && errors.image ? (
                                                <div className="red-text">{errors.image}</div>
                                            ) : null}

                                            <CustomButton type="submit" variant="primary" text="Update" isPending={isSubmitting} />
                                        </div>
                                    </form>
                                )}
                            </Formik>
                            {id && (
                                <div className="mt-4">
                                    <h3 className="mainTitle mb-3">Set Challenge Avatar</h3>
                                    <div className="ratio ratio-16x9">
                                        <iframe
                                            title="Set Challenge Avatar"
                                            src={`https://custom-dev.onlinetestingserver.com/yalla-unity-host/YallaGainWebGL/?challenge_id=${id}`}
                                            width="100%"
                                            height="600"
                                            frameBorder="0"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default withModal(EditChallenge);

