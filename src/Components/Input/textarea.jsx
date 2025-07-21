import React from 'react'

const SiteTextarea = ({ error, ...props }) => {
  return (
    <>
      <textarea
        name={props.name}
        rows={props.rows}
        placeholder={props.placeholder}
        className={`site-input ${props.className ? props.className : ''}`}
        onChange={props?.onChange} value={props?.value}>
      </textarea>
      {error && <div className="error-message red-text">{error}</div>}

    </>
  )
}
export default SiteTextarea;