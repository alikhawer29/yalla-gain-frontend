// import React from 'react'

const SiteInput = (props) => {
  return (
    <>
      <input type={props.type}
        readOnly={props?.readOnly}
        placeholder={props.placeholder}
        value={props?.value}
        onChange={props?.onChange}
        {...props}
        className={`site-input ${props.className ? props.className : ''}`}
      />
      {props?.errors && props?.touched ?
        (
          < small className='text-danger ms-2'>{props?.errors}</small >
        ) : null
      }
      {
        props?.inputError ? (
          <small className='text-danger ms-2'>{props?.inputError[0]}</small>
        ) : null
      }
      {props?.error ?
        (
          < small className='text-danger ms-2'>{props?.error}</small >
        ) : null
      }
    </>
  )
}
export default SiteInput;



