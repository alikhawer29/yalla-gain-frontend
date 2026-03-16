import { useEffect, useState } from "react";
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
import { challengeKinds } from "../../../Config/TableStatus";
import { challengeAddSchema } from "../../../Config/Validations";
import { post } from "../../../Services/Api";
import { io } from "socket.io-client";


const AddChallenge = ({ showModal }) => {
    const navigate = useNavigate();
    const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
    const [unityChallengeId, setUnityChallengeId] = useState(null);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const s = io("https://custom-dev.onlinetestingserver.com:2170/", {
            transports: ["websocket"],
        });

        s.on("connect", () => {
            console.log("[Challenge Add] Socket connected", s.id);
        });

        s.on("connect_error", (err) => {
            console.log("[Challenge Add] Socket connect_error", err?.message || err);
        });

        s.on("disconnect", (reason) => {
            console.log("[Challenge Add] Socket disconnected", reason);
        });

        setSocket(s);

        return () => {
            console.log("[Challenge Add] Cleaning up socket");
            s.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket || !unityChallengeId) return;

        const handler = (payload) => {
            console.log("[Challenge Add] Received closeIFrame event", payload);
            if (payload?.challenge_id && Number(payload.challenge_id) === Number(unityChallengeId)) {
                console.log("[Challenge Add] challenge_id matched, redirecting to /admin/challenges");
                navigate("/admin/challenges");
            }
        };

        const baseEvent = "closeIFrame";
        const dynamicEvent = `${baseEvent}${unityChallengeId}`;

        console.log("[Challenge Add] Subscribing to socket events", {
            baseEvent,
            dynamicEvent,
        });

        socket.on(baseEvent, handler);
        socket.on(dynamicEvent, handler);

        return () => {
            console.log("[Challenge Add] Unsubscribing from socket events", {
                baseEvent,
                dynamicEvent,
            });
            socket.off(baseEvent, handler);
            socket.off(dynamicEvent, handler);
        };
    }, [socket, unityChallengeId, navigate]);

    const initialValues = { title: "", type: "", duration: "", milestone: "", reward: "", description: "", image: "" };

    const handleSubmit = async (values) => {
        startSubmitting();
        // Static flow for now
        // showModal("Successfully", "Challenge has been added successfully", () => navigate("/admin/challenges"), true);
        const payload = { ...values };
        const res = await post(`/challenge`, payload);
        if (res?.status) {
            const createdId = res?.data?.id;
            if (createdId) {
                setUnityChallengeId(createdId);
            }

            showModal(
                "Successfully",
                "Challenge has been added successfully. You can now set its avatar below.",
                null,
                true
            );
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
                            <h2 className="mainTitle mb-4"><BackButton2 />Add Challenge</h2>
                            <Formik initialValues={initialValues} validationSchema={challengeAddSchema} onSubmit={handleSubmit}>
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
                                                placeholder="e.g., 10 (in days)"
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
                                                placeholder="e.g., 10 (in Yalla Coins)"
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

                                            <ImageDropzone label="Upload Image" required onChange={(file) => setFieldValue("image", file)} />
                                            {touched.image && errors.image ? (
                                                <div className="red-text">{errors.image}</div>
                                            ) : null}

                                            <CustomButton type="submit" variant="primary" text="Add" isPending={isSubmitting} />
                                        </div>
                                    </form>
                                )}
                            </Formik>
                            {unityChallengeId && (
                                <div className="mt-4">
                                    <h3 className="mainTitle mb-3">Set Challenge Avatar</h3>
                                    <div className="ratio ratio-16x9">
                                        <iframe
                                            title="Set Challenge Avatar"
                                            src={`https://custom-dev.onlinetestingserver.com/yalla-unity-host/YallaGainWebGL/?challenge_id=${unityChallengeId}`}
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

export default withModal(AddChallenge);

