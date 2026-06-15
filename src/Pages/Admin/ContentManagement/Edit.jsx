import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomInput from "../../../Components/CustomInput";
import { Select } from "../../../Components/Select";
import CustomButton from "../../../Components/CustomButton";
import withModal from "../../../HOC/withModal";
import BackButton2 from "../../../Components/BackButton/BackButton2";
import { useFormStatus } from "../../../Hooks/useFormStatus";
import {
  language,
  exerciseKeys,
  exercisesByMuscle,
} from "../../../Config/TableStatus";
import { getDetails, post } from "../../../Services/Api";
import { workoutContentEditSchema } from "../../../Config/Validations";
import ImageDropzone from "../../../Components/ImageDropzone";
import "./style.css";

const contentEditSkeletonProps = {
  baseColor: "rgba(255, 255, 255, 0.12)",
  highlightColor: "rgba(255, 255, 255, 0.2)",
};

const ContentEditFormSkeleton = () => (
  <div className="content-edit-skeleton col-12 col-xl-6 col-xxl-5">
    <div className="mb-3">
      <Skeleton
        width="25%"
        height={18}
        {...contentEditSkeletonProps}
        className="mb-2"
      />
      <Skeleton height={48} borderRadius={8} {...contentEditSkeletonProps} />
    </div>
    <div className="mb-3">
      <Skeleton
        width="30%"
        height={18}
        {...contentEditSkeletonProps}
        className="mb-2"
      />
      <Skeleton height={120} borderRadius={8} {...contentEditSkeletonProps} />
    </div>
    <div className="mb-3">
      <Skeleton
        width="28%"
        height={18}
        {...contentEditSkeletonProps}
        className="mb-2"
      />
      <Skeleton height={180} borderRadius={12} {...contentEditSkeletonProps} />
    </div>
    <Skeleton
      width={140}
      height={44}
      borderRadius={8}
      {...contentEditSkeletonProps}
    />
  </div>
);

const emptyValues = {
  title: "",
  muscle_key: "",
  muscle_title: "",
  exercise_key: "",
  exercise_title: "",
  image: "",
  description: "",
  language: "",
};

const EditContent = ({ showModal }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isSubmitting, startSubmitting, stopSubmitting } = useFormStatus();
  const [initialValues, setInitialValues] = useState(emptyValues);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await getDetails(`/workout-content/${id}`);
        if (!cancelled && res?.status) {
          const d = res?.data || {};
          setInitialValues({
            muscle_key: d.muscle_key || "",
            muscle_title: d.muscle_title || "",
            image: d.image || "",
            description: d.description || "",
          });
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Unable to fetch workout content:", error);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (values) => {
    startSubmitting();
    const payload = { ...values };
    if (
      typeof values.image === "string" ||
      values.image === null ||
      values.image === undefined
    ) {
      delete payload.image;
    }
    const res = await post(`/workout-content/${id}/update`, payload);
    if (res?.status) {
      showModal(
        "Successfully",
        "Workout Plan has been Updated Successfully",
        () => navigate(`/admin/content-management/${id}`),
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
          <div className="row">
            <div className="col-12">
              <h2 className="mainTitle mb-4">
                <BackButton2 />
                Edit Workout Content
              </h2>
              {loading ? (
                <div className="row">
                  <ContentEditFormSkeleton />
                </div>
              ) : (
              <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={workoutContentEditSchema}
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
                }) => {
                  const exerciseOptions = values.muscle_key
                    ? [
                        { value: "", text: "Select Exercise" },
                        ...(exercisesByMuscle[values.muscle_key]?.map(
                          (item) => ({
                            value: item.value,
                            text: item.text,
                          }),
                        ) || []),
                      ]
                    : [{ value: "", text: "Select Exercise" }];

                  return (
                    <form className="row" onSubmit={handleSubmit}>
                      <div className="col-12 col-xl-6 col-xxl-5">
                        {/* <CustomInput
                          wrapperClass="mb-3"
                          label="Title"
                          placeholder="Enter title"
                          name="title"
                          value={values.title}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.title && errors.title}
                          required
                        /> */}

                        <Select
                          wrapperClass="mb-3"
                          label="Muscle"
                          labelclass="mb-2"
                          className="mainInput w-100"
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
                            setFieldValue("exercise_key", "");
                            setFieldValue("exercise_title", "");
                          }}
                          required
                          onBlur={handleBlur}
                          error={touched.muscle_key && errors.muscle_key}
                        >
                          {exerciseKeys}
                        </Select>

                        {/* <Select
                          wrapperClass="mb-3"
                          label="Exercise"
                          labelclass="mb-2"
                          className="mainInput w-100"
                          name="exercise_key"
                          value={values.exercise_key}
                          onChange={(v) => {
                            setFieldValue("exercise_key", v);
                            setFieldValue(
                              "exercise_title",
                              v
                                ? (exerciseOptions.find(
                                    (item) => item.value === v,
                                  )?.text ?? "")
                                : "",
                            );
                          }}
                          onBlur={handleBlur}
                          error={touched.exercise_key && errors.exercise_key}
                        >
                          {exerciseOptions}
                        </Select> */}

                        <CustomInput
                          wrapperClass="mb-3"
                          label="Description"
                          placeholder="Enter description"
                          name="description"
                          type="textarea"
                          rows={4}
                          value={values.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={touched.description && errors.description}
                          required
                        />

                        {/* <Select
                          wrapperClass="mb-3"
                          label="Language"
                          labelclass="mb-2"
                          className="mainInput w-100"
                          name="language"
                          value={values.language}
                          onChange={(v) => setFieldValue("language", v)}
                          onBlur={handleBlur}
                          error={touched.language && errors.language}
                        >
                          {language}
                        </Select> */}

                        <ImageDropzone
                          label="Upload Image"
                          initialUrl={
                            typeof initialValues.image === "string"
                              ? initialValues.image
                              : ""
                          }
                          onChange={(file) => setFieldValue("image", file)}
                          required
                        />
                        {touched.image && errors.image ? (
                          <div className="red-text">{errors.image}</div>
                        ) : null}

                        <CustomButton
                          type="submit"
                          variant="primary"
                          text="Update"
                          pendingText="Submitting..."
                          isPending={isSubmitting}
                        />
                      </div>
                    </form>
                  );
                }}
              </Formik>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default withModal(EditContent);
