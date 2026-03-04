import { faArrowDownLong, faArrowUpLong, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./style.css";
import { images } from "../../Assets";
import { Graph } from "../Graph";

const StatsCard = (props) => {
  const Icon = props.item.image;
  return (
    <>
      <div className="stats_card px-xxl-4 px-3 px-sm-4 px-lg-2" style={{ background: props.item.backgroundColor }}>
        <div className="statsData ">
          <div className="d-flex justify-content-between align-items-end">
            <div>
              <div className={`statsIcons flex-shrink-0 statsImg-${props.index}`}>
                <Icon />
              </div>
              <div className="mt-xl-3 mt-1">
                <div>
                  <h3 className="statsNumber">
                    {" "}
                    {console.log(props.item.text, "Sdf")}
                    {props.item.text == "total earning" && <FontAwesomeIcon icon={faDollarSign} />} {props.item.change}
                  </h3>
                </div>
              </div>
            </div>
            <div className="statsGraph">
              <images.Graph />
            </div>
          </div>

        </div>
        <p className="statsText text-white">{props.item.text}</p>
      </div>
    </>
  );
};

export default StatsCard;

{
  /* <>
                {props?.item.arrowIcon && (
                  <p className="mb-0">
                    {props.item.increase ? (
                      <FontAwesomeIcon size="2x" color="#15355E" icon={faArrowUpLong} className=""/>
                    ) : (
                      <FontAwesomeIcon size="2x" color="#15355E" icon={faArrowDownLong} className="" />
                      
                    )}
                  </p>
                )}
              </> */
}
