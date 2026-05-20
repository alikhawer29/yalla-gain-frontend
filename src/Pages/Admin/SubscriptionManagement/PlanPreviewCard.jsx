import { useTranslation } from "react-i18next";
import { buildPlanPreview } from "./planFormHelpers";

const PlanPreviewCard = ({ values, eyebrow = "Plan features" }) => {
  const preview = buildPlanPreview(values);

  return (
    <div className="plan-preview-card">
      <p className="plan-preview-card__eyebrow">{eyebrow}</p>
      <h4 className="plan-preview-card__title">{preview.title}</h4>
      <ul className="plan-preview-card__list">
        {preview.items.map((item) => (
          <li
            key={item.text}
            className={`plan-preview-card__item plan-preview-card__item--${item.type}`}
          >
            <span className="plan-preview-card__icon" aria-hidden="true">
              {item.type === "included" && "✅"}
              {item.type === "excluded" && "❌"}
              {item.type === "limited" && "◐"}
              {item.type === "bonus" && "🎁"}
            </span>
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlanPreviewCard;
