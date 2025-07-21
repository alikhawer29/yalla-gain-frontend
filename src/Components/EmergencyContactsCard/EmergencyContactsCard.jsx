import React from "react";
import Styles from "./styles.module.css";
import CustomButton from "../CustomButton";
import { FaEdit, FaTrash } from "react-icons/fa";
import { getCountryFlag } from "../../Utils/helper";
const EmergencyContactsCard = ({ contact, onDelete, onEdit }) => {
  return (
    <div className={`${Styles.emergencyCard}`}>
      <div className="card-buttons text-end">
        <CustomButton className="m-auto me-0 notButton" onClick={onEdit}>
          <span className="tooltip-toggle" aria-label="Edit">
            <FaEdit size={20} color="#1819ff" />
          </span>
        </CustomButton>
        <CustomButton className="m-auto me-0 notButton" onClick={onDelete}>
          <span className="tooltip-toggle" aria-label="Delete">
            <FaTrash size={20} className="text-danger" />
          </span>
        </CustomButton>
      </div>
      <div className="mb-3">
        <h4 className="secondaryLabel">Title</h4>
        <p className="secondaryText wrapText mb-0">{contact.name}</p>
      </div>
      <div className="my-3">
        <h4 className="secondaryLabel">Phone No</h4>
        <p className="secondaryText wrapText mb-0"><span>{getCountryFlag(contact.phone)}</span>{contact.phone}</p>
      </div>
    </div>
  );
};

export default EmergencyContactsCard;
