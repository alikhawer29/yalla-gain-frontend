import { useNavigate } from "react-router";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const BackButton2 = ({ url = "", className }) => {
  const navigate = useNavigate();

  const goBack = () => {
    if (url) {
      navigate(url);
    } else {
      navigate(-1);
    }
  };

  return (
    <button className={`back-button ${className || ""}`} onClick={goBack}>
      {/* <FontAwesomeIcon icon={faArrowLeft} /> */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 38 28"
        fill="none"
      >
        <path
          d="M13.8541 1L1 13.8541L13.8541 26.7082"
          stroke="#15355E"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M37.0002 13.8543H1.36035"
          stroke="#15355E"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default BackButton2;
