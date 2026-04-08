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

const exercisesByMuscle = {
  chest: [
    { value: "cable_high_to_low", text: "Cable High to Low" },
    { value: "chest_butterfly", text: "Chest Butterfly" },
    { value: "declined_press", text: "Declined Chest Press" },
    { value: "flat_press", text: "Flat Press" },
    { value: "inclined_press", text: "Inclined Press" },
    { value: "pushups", text: "Pushups" },
  ],
  back: [
    { value: "barbell_rows", text: "Barbell Rows" },
    { value: "deadlift", text: "Deadlift" },
    { value: "lat_pulldown", text: "Lat Pulldown" },
    { value: "pull_over", text: "Pull Over" },
    { value: "seated_cable_rows", text: "Seated Cable Rows" },
    { value: "tbar_rows", text: "T-Bar Rows" },
    { value: "pullups", text: "Pull-Ups" },
  ],
  shoulders: [
    { value: "dumbbell_press", text: "Dumbbell Shoulder Press" },
    { value: "face_pulls", text: "Face Pulls" },
    { value: "front_raises", text: "Shoulder Front Raises" },
    { value: "lateral_raises", text: "Shoulder Lateral Raises" },
  ],
  legs: [
    { value: "hip_thrust", text: "Hip Thrust" },
    { value: "leg_curls", text: "Leg Curls" },
    { value: "leg_extension", text: "Leg Extension" },
    { value: "leg_press", text: "Leg Press" },
    { value: "romanian_deadlift", text: "Romanian Deadlift" },
    { value: "squats", text: "Squats" },
    { value: "calf_raises", text: "Calf Raises" },
  ],
  biceps: [
    { value: "biceps_curls", text: "Biceps Curls" },
    { value: "hammer_curls", text: "Hammer Curls" },
    { value: "incline_curls", text: "Inclined Biceps Curls" },
  ],
  triceps: [
    { value: "rope_pushdown", text: "Triceps Rope Pushdown" },
    { value: "dips", text: "Triceps Dips" },
  ],
  trapeze: [{ value: "shrugs", text: "Shrugs" }],
  abs: [
    { value: "leg_raises", text: "Leg Raises" },
    { value: "plank", text: "Plank" },
  ],
};

const AddContent = ({ showModal }) => {
  const navigate = useNavigate();
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();

  const initialValues = {
    title: "",
    muscle_key: "",
    exercise_key: "",
    image: "",
    description: "",
    language: "",
    muscle_title: "",
    exercise_title: "",
  };

  const handleSubmit = async (values) => {
    startSubmitting();
    const payload = { ...values };
    const res = await post(`/workout-content`, payload);

    if (res?.status) {
      showModal(
        "Successfully",
        "Workout Plan has been Added  Successfully",
        () => navigate("/admin/content-management"),
        true,
      );
    } else {
      showModal("Error", res?.message ?? "Something went wrong", null, false);
    }
    stopSubmitting();
  };

  return (
    <DashboardLayout pageTitle="Content Management">
      <div className="container-fluid">
        <div className="dashCard">
          <h2 className="mainTitle mb-4">
            <BackButton2 />
            Add Workout Content
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={workoutContentAddSchema}
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
              setFieldTouched,
              submitCount,
            }) => {
              const exerciseOptions = values.muscle_key
                ? [
                    { value: "", text: "Select Exercise" },
                    ...(exercisesByMuscle[values.muscle_key]?.map((item) => ({
                      value: item.value,
                      text: item.text,
                    })) || []),
                  ]
                : [{ value: "", text: "Select Exercise" }];

              return (
                <form className="row" onSubmit={handleSubmit}>
                  <div className="col-12 col-xl-6 col-xxl-5">
                    <CustomInput
                      wrapperClass="mb-3"
                      label="Title"
                      name="title"
                      placeholder="Enter title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.title && errors.title}
                      required
                    />

                    {/* Muscle Dropdown */}
                    <Select
                      wrapperClass="mb-3"
                      label="Muscle"
                      name="muscle_key"
                      value={values.muscle_key}
                      onChange={(v) => {
                        setFieldValue("muscle_key", v);
                        setFieldValue(
                          "muscle_title",
                          v
                            ? (exerciseKeys.find((item) => item.value === v)
                                ?.text ?? "")
                            : "",
                        );
                        setFieldValue("exercise_key", ""); // reset exercise
                      }}
                      error={touched.muscle_key && errors.muscle_key}
                    >
                      {exerciseKeys}
                    </Select>

                    {/* Exercise Dropdown */}
                    <Select
                      wrapperClass="mb-3"
                      label="Exercise"
                      name="exercise_key"
                      value={values.exercise_key}
                      onChange={(v) => {
                        setFieldValue("exercise_key", v);
                        setFieldValue(
                          "exercise_title",
                          v
                            ? (exerciseOptions.find((item) => item.value === v)
                                ?.text ?? "")
                            : "",
                        );
                      }}
                      error={touched.exercise_key && errors.exercise_key}
                    >
                      {exerciseOptions}
                    </Select>

                    <CustomInput
                      wrapperClass="mb-3"
                      label="Description"
                      name="description"
                      placeholder="Enter description"
                      type="textarea"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.description && errors.description}
                    />

                    <Select
                      wrapperClass="mb-3"
                      label="Language"
                      name="language"
                      value={values.language}
                      onChange={(v) => setFieldValue("language", v)}
                      error={touched.language && errors.language}
                    >
                      {language}
                    </Select>

                    <ImageDropzone
                      label="Upload Image"
                      required
                      onChange={(file) => {
                        setFieldValue("image", file ?? "", true);
                        setFieldTouched("image", true, false);
                      }}
                    />
                    {(touched.image || submitCount > 0) && errors.image ? (
                      <div className="red-text">{errors.image}</div>
                    ) : null}

                    <CustomButton
                      type="submit"
                      text="Create"
                      isPending={isSubmitting}
                    />
                  </div>
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withModal(AddContent);
