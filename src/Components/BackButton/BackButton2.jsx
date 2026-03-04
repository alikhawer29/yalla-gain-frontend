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
      <svg xmlns="http://www.w3.org/2000/svg" width="52" height="26" viewBox="0 0 52 26" fill="none">
        <path
          d="M1.40811 14.4109H37.8093C38.584 14.4109 39.2178 13.7771 39.2178 13.0024C39.2178 12.2278 38.584 11.594 37.8093 11.594H1.40811C0.633465 11.594 -0.000335693 12.2278 -0.000335693 13.0024C-0.000335693 13.7771 0.633465 14.4109 1.40811 14.4109Z"
          fill="white"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M50.5916 11.594C49.8169 11.594 49.1831 12.2278 49.1831 13.0024C49.1831 13.7771 49.8169 14.4109 50.5916 14.4109C51.3662 14.4109 52 13.7771 52 13.0024C52 12.2278 51.3732 11.594 50.5916 11.594Z"
          fill="white"
        />
        <path
          d="M44.2 14.4109C43.4221 14.4109 42.7915 13.7803 42.7915 13.0024C42.7915 12.2246 43.4221 11.594 44.2 11.594C44.9778 11.594 45.6084 12.2246 45.6084 13.0024C45.6084 13.7803 44.9778 14.4109 44.2 14.4109Z"
          fill="white"
        />
        <path
          d="M10.7656 25.4108C11.0338 25.4085 11.2959 25.3299 11.5212 25.1843C11.7465 25.0387 11.9257 24.832 12.0379 24.5883C12.1502 24.3447 12.1908 24.0741 12.155 23.8083C12.1193 23.5424 12.0086 23.2922 11.836 23.0868L3.25859 13.0024L11.836 2.91088C12.343 2.31933 12.2656 1.43202 11.674 0.924976C11.0825 0.417936 10.1952 0.495403 9.68814 1.08695L0.336073 12.0869C-0.107587 12.6151 -0.107587 13.3827 0.336073 13.9108L9.68814 24.9178C9.96982 25.2488 10.3642 25.4108 10.7656 25.4108Z"
          fill="white"
        />
      </svg>
    </button>
  );
};

export default BackButton2;
