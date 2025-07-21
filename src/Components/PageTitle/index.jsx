import React from 'react'
import './styles.css'

const PageTitle = (props) => {
  return (
    <section className="user-page-title">
        <div className="container">
            <div className="row">
                <div className="col-12 col-md-10 col-lg-8 col-xl-6 mx-auto text-center">
                    <h2 className='fw-bold mb-2 mb-md-3'>{props.pageHeading}</h2>
                    {props.pageText && (
                      <p className='text-white mb-0'>{props.pageText}</p>
                    )}
                </div>
            </div>
        </div>
    </section>
  )
}

export default PageTitle