import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import CustomButton from "../../../Components/CustomButton";
import CustomInput from "../../../Components/CustomInput";
import ImageDropzone from "../../../Components/ImageDropzone";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import { Select } from "../../../Components/Select";
import { workoutContentAddSchema } from "../../../Config/Validations";
import withModal from "../../../HOC/withModal";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import { getDetails, post } from "../../../Services/Api";

const AddContent = ({ showModal }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const [muscleOptions, setMuscleOptions] = useState([]);
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  useEffect(() => {
    const loadMuscles = async () => {
      const res = await getDetails("/muscles");
      if (res?.status && res?.data) {
        const options = [
          { value: "", text: "Select Muscle" },
          ...res.data.map((item) => ({
            value: item.id,
            text: item.text,
          })),
        ];
        setMuscleOptions(options);
      }
    };
    loadMuscles();
  }, []);

  const initialValues = {
    muscle_id: "",
    image: "",
    description: "",
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
    <DashboardLayout pageTitle={t('sidebar.content_management')}>
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
              return (
                <form className="row" onSubmit={handleSubmit}>
                  <div className="col-12 col-xl-6 col-xxl-5">
                    {/* Muscle Dropdown */}
                    <Select
                      wrapperClass="mb-3"
                      label="Muscle"
                      name="muscle_id"
                      value={values.muscle_id}
                      onChange={(v) => {
                        setFieldValue("muscle_id", v);
                        setSelectedMuscle(v);
                      }}
                      required
                      error={touched.muscle_id && errors.muscle_id}
                    >
                      {muscleOptions}
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
                      required
                      error={touched.description && errors.description}
                    />

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
