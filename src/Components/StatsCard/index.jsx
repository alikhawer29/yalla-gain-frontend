import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./style.css";
import { images } from "../../Assets";

const StatsCard = (props) => {
  const Icon = props.item.image;
  const isImageUrl = typeof Icon === "string";
  const isEarning = String(props.item.text || "")
    .toLowerCase()
    .includes("earning");

  return (
    <div
      className="stats_card px-xxl-4 px-3 px-sm-4 px-lg-2"
      style={{ background: props.item.backgroundColor }}
    >
      <div className="statsData">
        {props.item.arrowIcon && (
          <div className="statsChange">
            {props.item.increase ? <images.ArrowUp /> : <images.ArrowDown />}
          </div>
        )}

        <div className="statsMain">
          <div className={`statsIcons flex-shrink-0 statsImg-${props.index}`}>
            {isImageUrl ? (
              <img src={Icon} alt="" className="stats-icon-img" />
            ) : (
              <Icon />
            )}
          </div>
          <h3 className="statsNumber mb-0">
            {/* {isEarning && <FontAwesomeIcon icon={faDollarSign} className="me-1" />} */}
            {props.item.number ?? props.item.change ?? "0"} {props.item.otherText ? " " : ""}
            {props.item.otherText && (
              <span
                className="text-white"
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  textTransform: "capitalize",
                }}
              >
                {props.item.otherText}
              </span>
            )}
          </h3>
        </div>

        <div className="statsGraph">
          {props.item.increase ? <images.Graph /> : <images.GraphOpposite />}
        </div>
      </div>

      <p className="statsText text-white mb-0">{props.item.text}</p>
    </div>
  );
};

export default StatsCard;
