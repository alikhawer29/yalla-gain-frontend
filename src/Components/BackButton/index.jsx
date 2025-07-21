import { useNavigate } from "react-router";
import "./style.css";
import BackIcon from "../../Assets/images/svg/backIcon.svg?react";

const BackButton = ({ url = "" }) => {
  const navigate = useNavigate();

  const goBack = () => {
    if (url) {
      navigate(url);
    } else {
      navigate(-1);
    }
  };

  return (
    <button className="backButton" onClick={goBack}>
      <BackIcon />
    </button>
  );
};

export default BackButton;
