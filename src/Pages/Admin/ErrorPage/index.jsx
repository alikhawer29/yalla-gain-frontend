import React from 'react'
// import { error } from '../../assets'
// import SiteButton from '../../../components/SiteButton/SiteButton'
import { Outlet, useNavigate } from 'react-router-dom'
import MainLayout from '../../../Components/Layouts/UserLayout/MainLayout';

const AdminErrorPage = () => {
    const navigate = useNavigate();
    return (
        <MainLayout>
        <section className="py-5">
            <div className="container">
                <div className="row">
                    <div className="col-12 text-center">
                        {/* <img src={error} alt="" className="img-fluid" /> */}
                        <div className="mt-4">
                            <button className='btn btn-primary' onClick={() => navigate('/')}>Back To Homepage</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </MainLayout>
    )
}

export default AdminErrorPage
