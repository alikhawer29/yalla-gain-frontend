import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FaEye } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";

const TableDropdown = ({ itemId, linkPath, view, edit, add }) => {
  const { t } = useTranslation();
  return (
    <Dropdown className="tableDropdown">
      <Dropdown.Toggle
        variant="transparent"
        className="notButton classicToggle"
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </Dropdown.Toggle>
      <Dropdown.Menu align="end" className="tableDropdownMenu">
        {view && (
          <Link to={`${linkPath}/${itemId}`} className="dropdown-item">
            <FaEye />
            {t("table_ui.view")}
          </Link>
        )}
        {edit && (
          <Link to={`${linkPath}/edit/${itemId}`} className="dropdown-item">
            {t("table_ui.edit")}
          </Link>
        )}
        {add && (
          <Link to={`${linkPath}`} className="dropdown-item">
            <FaCirclePlus />
            {t("table_ui.add")}
          </Link>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

TableDropdown.propTypes = {
  itemId: PropTypes.number.isRequired,
  linkPath: PropTypes.string.isRequired,
  view: PropTypes.bool,
  edit: PropTypes.bool,
};

export default React.memo(TableDropdown);
