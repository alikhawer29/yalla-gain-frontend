import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import CustomButton from "../../../Components/CustomButton";
import CustomInput from "../../../Components/CustomInput";
import ImageDropzone from "../../../Components/ImageDropzone";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import MultiSelect from "../../../Components/MultiSelect";
import { Select } from "../../../Components/Select";
import { challengeKinds, generalStatus } from "../../../Config/TableStatus";
import { challengeAddSchema } from "../../../Config/Validations";
import withModal from "../../../HOC/withModal";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { post } from "../../../Services/Api";
import "./style.css";

const bodyPartOptions = [
  { value: "arms", text: "Arms" },
  { value: "biceps", text: "Biceps" },
  { value: "triceps", text: "Triceps" },
  { value: "shoulders", text: "Shoulders" },
  { value: "chest", text: "Chest" },
  { value: "belly", text: "Belly" },
  { value: "back", text: "Back" },
  { value: "neck", text: "Neck" },
  { value: "face", text: "Face" },
  { value: "waist", text: "Waist" },
  { value: "glutes", text: "Glutes" },
  { value: "quads", text: "Quads" },
  { value: "hamstrings", text: "Hamstrings" },
  { value: "calves", text: "Calves" },
];

const AddChallenge = ({ showModal }) => {
  const navigate = useNavigate();
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const [unityChallengeId, setUnityChallengeId] = useState(null);

  const initialValues = {
    title: "",
    type: "",
    duration: 1,
    milestone: "",
    reward: 1,
    description: "",
    image: "",
    status: "",
    body_parts: [],
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
                      <CustomInput
                        label="Duration"
                        placeholder="Enter Duration"
                        name="duration"
                        value={values.duration}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.duration && errors.duration}
                        required
                        type="number"
                        min="0"
                      />
                    </div>

                    <div className="col-md-6 mb-4">
                      <CustomInput
                        label="Reward"
                        placeholder="Enter Reward"
                        name="reward"
                        value={values.reward}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.reward && errors.reward}
                        required
                        type="number"
                        min="0"
                      />
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

                    <div className="col-6 mb-4">
                      <MultiSelect
                        label="Body Part"
                        name="body_parts"
                        options={bodyPartOptions}
                        value={values.body_parts}
                        onChange={(v) => setFieldValue("body_parts", v)}
                        error={touched.body_parts && errors.body_parts}
                        placeholder="Select"
                      />
                    </div>

                    <div className="col-12">
                      <div className="row">
                        {values.body_parts.map((item, index) => (
                          <div className="col-6 mb-4" key={item.value}>
                            <CustomInput
                            width={"50%"}
                              label={item.text}
                              placeholder="Enter Percentage"
                              name={`body_parts[${index}].percentage`}
                              value={item.percentage}
                              onChange={(e) => {
                                const newBodyParts = [...values.body_parts];
                                newBodyParts[index].percentage = e.target.value;
                                setFieldValue("body_parts", newBodyParts);
                              }}
                              onBlur={handleBlur}
                              required
                              type="number"
                              rightText="%"
                            />
                          </div>
                        ))}
                      </div>
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
