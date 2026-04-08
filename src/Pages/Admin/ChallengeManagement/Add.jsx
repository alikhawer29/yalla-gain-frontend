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
import { challengeKinds, generalStatus } from "../../../Config/TableStatus";
import { challengeAddSchema } from "../../../Config/Validations";
import { post } from "../../../Services/Api";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import "./style.css";

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
      if (
        payload?.challenge_id &&
        Number(payload.challenge_id) === Number(unityChallengeId)
      ) {
        console.log(
          "[Challenge Add] challenge_id matched, redirecting to /admin/challenges",
        );
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

  const initialValues = {
    title: "",
    type: "",
    duration: 1,
    milestone: "",
    reward: 1,
    description: "",
    image: "",
    status: "",
  };

  const handleSubmit = async (values) => {
    startSubmitting();
    const payload = { ...values };
    const res = await post(`/challenge`, payload);
    if (res?.status) {
      const createdId = res?.data?.id;
      if (createdId) {
        setUnityChallengeId(createdId);
      }

      showModal(
        "Successfully",
        "Challenge has been added successfully.",
        () => navigate("/admin/challenges"),
        true,
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
              <h2 className="mainTitle mb-5">
                <BackButton2 />
                Add Challenge
              </h2>
              <Formik
                initialValues={initialValues}
                validationSchema={challengeAddSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                }) => (
                  <form className="row" onSubmit={handleSubmit}>
                    <div className="col-md-6 mb-4">
                      <CustomInput
                        label="Challenge Title"
                        placeholder="Enter Challenge Title"
                        name="title"
                        value={values.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.title && errors.title}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-4">
                      <Select
                        label="Status"
                        name="status"
                        value={values.status}
                        onChange={(v) => setFieldValue("status", v)}
                        onBlur={handleBlur}
                        error={touched.status && errors.status}
                        required
                        // mainLabel="Select Status"
                      >
                        {generalStatus}
                      </Select>
                    </div>

                    <div className="col-md-6 mb-4">
                      <Select
                        label="Type Of Challenge"
                        name="type"
                        required
                        value={values.type}
                        onChange={(v) => setFieldValue("type", v)}
                        onBlur={handleBlur}
                        error={touched.type && errors.type}
                        mainLabel="Select"
                      >
                        {challengeKinds}
                      </Select>
                    </div>

                    <div className="col-md-6 mb-4">
                      <CustomInput
                        label="Add Milestone To Be Achieved"
                        placeholder="Write Milestone To Be Achieved In This Challenge"
                        name="milestone"
                        value={values.milestone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.milestone && errors.milestone}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        Duration<span className="text-danger">*</span>
                      </label>
                      <div className="counter-input">
                        <button
                          type="button"
                          className="counter-btn plus-btn"
                          onClick={() =>
                            setFieldValue("duration", values.duration + 1)
                          }
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                        <span className="counter-value">
                          {values.duration}{" "}
                          {values.duration > 1 ? "Days" : "Day"}
                        </span>
                        <button
                          type="button"
                          className="counter-btn minus-btn"
                          onClick={() =>
                            setFieldValue(
                              "duration",
                              Math.max(1, values.duration - 1),
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                      </div>
                      {touched.duration && errors.duration && (
                        <div className="error-message red-text">
                          {errors.duration}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-4">
                      <label className="form-label">
                        Reward<span className="text-danger">*</span>
                      </label>
                      <div className="counter-input">
                        <button
                          type="button"
                          className="counter-btn plus-btn"
                          onClick={() =>
                            setFieldValue("reward", values.reward + 1)
                          }
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                        <span className="counter-value">
                          {values.reward}{" "}
                          {values.reward > 1 ? "Yalla Coins" : "Yalla Coin"}
                        </span>
                        <button
                          type="button"
                          className="counter-btn minus-btn"
                          onClick={() =>
                            setFieldValue(
                              "reward",
                              Math.max(1, values.reward - 1),
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                      </div>
                      {touched.reward && errors.reward && (
                        <div className="error-message red-text">
                          {errors.reward}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6 mb-4">
                      <ImageDropzone
                        label="Upload Image"
                        required
                        onChange={(file) => setFieldValue("image", file)}
                      />
                      {touched.image && errors.image ? (
                        <div className="error-message red-text">
                          {errors.image}
                        </div>
                      ) : null}
                    </div>

                    <div className="col-md-6 mb-4">
                      <CustomInput
                        label="Description"
                        placeholder="Enter Description"
                        name="description"
                        type="textarea"
                        rows={7}
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.description && errors.description}
                        required
                      />
                    </div>

                    <div className="col-12 mt-4">
                      <CustomButton
                        type="submit"
                        variant="primary"
                        text="Add"
                        isPending={isSubmitting}
                        className="add-btn"
                      />
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

export default withModal(AddChallenge);
