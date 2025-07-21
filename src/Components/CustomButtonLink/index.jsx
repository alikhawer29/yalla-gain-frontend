import React from 'react'
import { Link } from 'react-router-dom';
import "./style.css"

const CustomButtonLink = (props) => {
  return (
    <>
      <Link className={props?.className} to={props?.linkPath}>{props?.text}</Link>
    </>
  )
}
export default CustomButtonLink;
