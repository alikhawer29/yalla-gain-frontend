import React from "react";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faEllipsisV, faEye, faGear, faPencil, faTrash, faUserGear } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const TableDropdownUser = ({
  itemId,
  linkPath,
  onStatusChange,
  statusDetail,
  view,
  edit,
  onDelete,
  align = "end", // Default value is "start"
  className, 
  customLink,
  customLinkText,
  customLinkPath,
  showModal
}) => {
  const handleStatus = () => {
    onStatusChange(itemId, statusDetail);
  };
  const handleModal = () => {
    showModal(itemId, statusDetail);
  };

  return (
    <Dropdown className={className} align={align}>
      <Dropdown.Toggle
        variant=""
        className=""
      >
        <FontAwesomeIcon icon={faEllipsisV} />
      </Dropdown.Toggle>
      <Dropdown.Menu className="tableDropdownMenu">
        {view && (
          <Dropdown.Item
              as={Link}
              to={`${linkPath}/${itemId}`}
          >
              <FontAwesomeIcon icon={faEye} />
              View
          </Dropdown.Item>
        )}
        {edit && (
          <Dropdown.Item
            as={Link}
            to={`${linkPath}/edit/${itemId}`}
          >
            <FontAwesomeIcon icon={faPencil} />
            Edit
          </Dropdown.Item>
        )}
        {onDelete && (
          <Dropdown.Item
            as={Link}
            onClick={handleModal}
          >
            <FontAwesomeIcon icon={faTrash} />
            Delete
          </Dropdown.Item>
        )}
        {customLink && (
          <Dropdown.Item
            as={Link}
            to={`${customLinkPath}`}
          >
            <FontAwesomeIcon icon={faGear} />
            {customLinkText}
          </Dropdown.Item>
        )}

        {onStatusChange && (
          <Dropdown.Item
            as={Link}
            onClick={handleStatus}
          >
            <FontAwesomeIcon icon={faCheck} />
            {statusDetail === "Inactive" ? "Activate" : "Inactivate"}
          </Dropdown.Item>

          // <button onClick={handleStatus} className="table-action">
          //   {statusDetail === "Inactive" ? "Activate" : "Inactivate"}
          // </button>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

TableDropdownUser.propTypes = {
  itemId: PropTypes.number.isRequired,
  linkPath: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func,
  statusDetail: PropTypes.string,
  view: PropTypes.bool,
  edit: PropTypes.bool,
  onDelete: PropTypes.bool,
  align: PropTypes.string, // Add align as a prop type
  className: PropTypes.string,
  customLink: PropTypes.string,
};

export default React.memo(TableDropdownUser);

