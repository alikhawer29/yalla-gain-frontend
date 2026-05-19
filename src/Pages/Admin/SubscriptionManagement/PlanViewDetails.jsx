import {
  FEATURE_TOGGLES,
  getPlanDisplayTitle,
  NUMERIC_BENEFIT_FIELDS,
} from "./planConfig";
import { isFreePlan, mapPlanToForm, toFormFlag } from "./planFormHelpers";
import PlanPreviewCard from "./PlanPreviewCard";

const ViewSection = ({ title, subtitle, children }) => (
  <section className="plan-form-section plan-view-section">
    <div className="plan-form-section__header">
      <h3 className="plan-form-section__title">{title}</h3>
      {subtitle && <p className="plan-form-section__subtitle">{subtitle}</p>}
    </div>
    {children}
  </section>
);

const InfoTile = ({ label, value, highlight }) => (
  <div className="plan-view-tile">
    <span className="plan-view-tile__label">{label}</span>
    <span
      className={`plan-view-tile__value${highlight ? ` plan-view-tile__value--${highlight}` : ""}`}
    >
      {value}
    </span>
  </div>
);

const FeatureStatusCard = ({ label, included, locked }) => (
  <div
    className={`plan-view-feature-card${included ? " plan-view-feature-card--on" : ""}`}
  >
    <span className="plan-view-feature-card__label">{label}</span>
    <span
      className={`plan-view-feature-card__badge${included ? " plan-view-feature-card__badge--yes" : " plan-view-feature-card__badge--no"}`}
    >
      {locked ? "Included" : included ? "Included" : "Not included"}
    </span>
  </div>
);

const formatPlanType = (type) =>
  type ? type.charAt(0).toUpperCase() + type.slice(1) : "-";

const formatDuration = (duration) =>
  duration ? duration.charAt(0).toUpperCase() + duration.slice(1) : "-";

const PlanViewDetails = ({ plan }) => {
  if (!plan) {
    return (
      <p className="plan-view-loading text-white mb-0">Loading plan details…</p>
    );
  }

  const values = mapPlanToForm(plan);
  const free = isFreePlan(values.plan_type);
  const yearly = values.duration === "yearly";
  const periodLabel = yearly ? "per year" : "per month";

  const getToggleIncluded = (toggle) => {
    if (toggle.alwaysIncluded) return true;
    if (!toggle.field) return false;
    return Boolean(values[toggle.field]);
  };

  return (
    <div className="plan-view-layout">
      <div className="plan-view-hero">
        <div>
          <p className="plan-view-hero__eyebrow">Subscription plan</p>
          <h3 className="plan-view-hero__title">
            {getPlanDisplayTitle(values.plan_type, values.duration)}
          </h3>
        </div>
        {/* <span
          className={`plan-view-hero__badge plan-view-hero__badge--${plan.status === 1 || plan.status === "1" ? "active" : "inactive"}`}
        >
          {plan.status === 1 || plan.status === "1" ? "Active" : "Inactive"}
        </span> */}
      </div>

      <ViewSection
        title="Plan Info"
        // subtitle="Core billing configuration."
      >
        <div className="plan-view-tiles">
          <InfoTile
            label="Plan Type"
            value={formatPlanType(values.plan_type)}
          />
          {!free && (
            <InfoTile
              label="Duration"
              value={formatDuration(values.duration)}
            />
          )}
          {!free && (
            <InfoTile
              label="Price"
              value={`$${Number(plan.price ?? 0).toLocaleString()}`}
            />
          )}
          {!free && (
            <InfoTile
              label="Trial Period"
              value={toFormFlag(plan.has_trial) ? "Enabled" : "Disabled"}
              highlight={toFormFlag(plan.has_trial) ? "success" : "muted"}
            />
          )}
          {free && <InfoTile label="Price" value="Free" highlight="success" />}
        </div>
      </ViewSection>

      <ViewSection
        title="Feature Toggles"
        subtitle="Included benefits for this plan tier."
      >
        <div className="plan-feature-grid">
          {FEATURE_TOGGLES.map((toggle) => (
            <FeatureStatusCard
              key={toggle.id}
              label={toggle.label}
              included={getToggleIncluded(toggle)}
              locked={toggle.alwaysIncluded}
            />
          ))}
        </div>
      </ViewSection>

      {!free && (
        <ViewSection
          title="Numeric Benefits"
          subtitle={`Session and points allowances ${periodLabel}.`}
        >
          <div className="plan-view-tiles">
            {NUMERIC_BENEFIT_FIELDS.map((field) => (
              <InfoTile
                key={field.name}
                label={field.label}
                value={values[field.name] ?? 0}
              />
            ))}
          </div>
        </ViewSection>
      )}

      <ViewSection
        title="Plan Summary"
        subtitle="Full feature breakdown as subscribers will see it."
      >
        <PlanPreviewCard values={values} eyebrow="Included features" />
      </ViewSection>
    </div>
  );
};

export default PlanViewDetails;
