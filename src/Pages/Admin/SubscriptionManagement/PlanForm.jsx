import CustomInput from "../../../Components/CustomInput";
import { Select } from "../../../Components/Select";
import CustomButton from "../../../Components/CustomButton";
import {
  DURATION_OPTIONS,
  FEATURE_TOGGLES,
  NUMERIC_BENEFIT_FIELDS,
  PLAN_TYPE_OPTIONS,
} from "./planConfig";
import {
  handleDurationChange,
  handlePlanTypeChange,
  isFreePlan,
} from "./planFormHelpers";
import PlanPreviewCard from "./PlanPreviewCard";
import "./style.css";

const PlanFormSection = ({ title, subtitle, children }) => (
  <section className="plan-form-section">
    <div className="plan-form-section__header">
      <h3 className="plan-form-section__title">{title}</h3>
      {subtitle && <p className="plan-form-section__subtitle">{subtitle}</p>}
    </div>
    {children}
  </section>
);

const FeatureToggleCard = ({
  toggle,
  checked,
  disabled,
  onChange,
  idPrefix = "",
}) => (
  <label
    className={`plan-feature-card${checked ? " plan-feature-card--on" : ""}${disabled ? " plan-feature-card--locked" : ""}`}
    htmlFor={`${idPrefix}${toggle.id}`}
  >
    <span className="plan-feature-card__label">{toggle.label}</span>
    <div className="form-check form-switch plan-feature-card__switch mb-0">
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        id={`${idPrefix}${toggle.id}`}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  </label>
);

const PlanForm = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
  isSubmitting,
  submitText = "Save Plan",
  pendingText = "Saving...",
}) => {
  const free = isFreePlan(values.plan_type);
  const periodHint = values.duration === "yearly" ? "per year" : "per month";

  return (
    <div className="plan-form-layout">
      <PlanFormSection
        title="Basic Plan Info"
        subtitle="Plan type, billing cycle, and pricing."
      >
        <div className="row">
          <div className={free ? "col-12" : "col-md-6"}>
            <Select
              wrapperClass="mb-0"
              label="Plan Type"
              labelclass="mb-2"
              className="mainInput w-100"
              name="plan_type"
              required
              value={values.plan_type}
              onChange={(v) => {
                setFieldValue("plan_type", v);
                handlePlanTypeChange(v, setFieldValue, values);
              }}
              onBlur={handleBlur}
              error={touched.plan_type && errors.plan_type}
            >
              {PLAN_TYPE_OPTIONS}
            </Select>
          </div>
          {!free && (
            <div className="col-md-6">
              <Select
                wrapperClass="mb-0"
                label="Duration"
                labelclass="mb-2"
                className="mainInput w-100"
                name="duration"
                required
                value={values.duration ?? ""}
                onChange={(v) => {
                  setFieldValue("duration", v);
                  handleDurationChange(v, values.plan_type, setFieldValue);
                }}
                onBlur={handleBlur}
                error={touched.duration && errors.duration}
              >
                {DURATION_OPTIONS}
              </Select>
            </div>
          )}
        </div>

        {!free && (
          <div className="row mt-3">
            <div className="col-md-6">
              <CustomInput
                wrapperClass="mb-0"
                label="Price"
                placeholder="Enter price"
                name="price"
                type="number"
                min={0}
                step="0.01"
                value={values.price}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.price && errors.price}
                required
              />
            </div>
            <div className="col-md-6 d-flex align-items-end">
              <label className="plan-trial-toggle w-100">
                <span className="plan-trial-toggle__label">Enable Trial</span>
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="has_trial"
                    checked={values.has_trial}
                    onChange={(e) =>
                      setFieldValue("has_trial", e.target.checked)
                    }
                  />
                </div>
              </label>
            </div>
          </div>
        )}
      </PlanFormSection>

      <PlanFormSection
        title="Feature Toggles"
        subtitle="Turn optional benefits on or off. Core fitness features stay included on paid plans."
      >
        <div className="plan-feature-grid">
          {FEATURE_TOGGLES.map((toggle) => {
            const isLocked = free || toggle.alwaysIncluded;
            const checked = toggle.alwaysIncluded
              ? true
              : Boolean(values[toggle.field]);

            return (
              <FeatureToggleCard
                key={toggle.id}
                toggle={toggle}
                checked={checked}
                disabled={isLocked}
                onChange={(on) =>
                  toggle.field && setFieldValue(toggle.field, on)
                }
              />
            );
          })}
        </div>
      </PlanFormSection>

      {!free && (
        <PlanFormSection
          title="Numeric Benefits"
          subtitle={`Enter counts only — we format sessions and points ${periodHint} automatically.`}
        >
          <div className="row">
            {NUMERIC_BENEFIT_FIELDS.map((field) => (
              <div className="col-md-4" key={field.name}>
                <CustomInput
                  wrapperClass="mb-0"
                  label={field.label}
                  name={field.name}
                  type="number"
                  min={0}
                  value={values[field.name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched[field.name] && errors[field.name]}
                  required
                />
              </div>
            ))}
          </div>
        </PlanFormSection>
      )}

      <PlanFormSection
        title="Preview"
        subtitle="How this plan will appear to subscribers."
      >
        <PlanPreviewCard values={values} />
      </PlanFormSection>

      <div className="d-flex">
        <CustomButton
          type="submit"
          variant="primary"
          text={submitText}
          pendingText={pendingText}
          isPending={isSubmitting}
        />
      </div>
    </div>
  );
};

export default PlanForm;
