import { Card } from "react-bootstrap";
import { images } from "../../Assets";
import React from 'react'
import CustomButton from "../CustomButton";
import "./style.css"
import { Link } from "react-router-dom";

const Subscriptionscard = ({ data }) => {
  const {
    id,
    title,
    subTitle,
    duration,
    price,
    onClick,
    featuresList,
  } = data; 

  return (
    <Card className="subscriptions-card">
      <Card.Header className="bg-transparent p-0 border-0">
        <div className="package-name mb-3 mb-lg-3 mb-xl-4">
          <h2 className="fw-semibold">{title}</h2>
          <p className="mb-0 fw-light">{subTitle}</p>
        </div>
        {price && (
          <div className="package-price pb-4">
            <h3 className="fw-bold mb-0">
              ${price} {duration && <span className="fw-light">/Per {duration}</span>} 
            </h3>
          </div>
        )}
        <CustomButton
          className="btn btn-primary w-100"
          onClick={() => onClick(id)}
        >
          Choose Plan
        </CustomButton>
      </Card.Header>
      <Card.Body className="position-relative px-0 mt-3">
        <h4 className="fw-semibold mb-3">This plan includes:</h4>
        {featuresList && (
          <ul className="package-feature m-0 p-0">
            {featuresList.map((item, index) => (
              <li className="d-flex" key={index}>
                <div className="flex-shrink-0">
                  <images.CaretRight className="me-2" />
                </div>
                <div className="flex-grow-1">{item.item}</div>
              </li>
            ))}
          </ul>
        )}
      </Card.Body>
    </Card>
  )
}

export default Subscriptionscard