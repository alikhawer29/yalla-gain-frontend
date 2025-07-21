import { useNavigate } from "react-router";
import "./style.css";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import CustomButton from "../../../Components/CustomButton";
import { useAuth } from "../../../Hooks/useAuth";
import { fullName, getCountryFlag } from "../../../Utils/helper";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <DashboardLayout pageTitle="My Profile">
        <div className="dashCard">
          <div className="row ">
            <div className="col-12">
              <h2 className="mainTitle">My Profile</h2>
            </div>
          </div>
          <div className="row mb-3">
            {user ? (
              <div className="col-12">
                <div className="mx-width">
                  <div className="row text-xl-center mb-sm-5 mb-4">
                    <div className="col-12">
                      <div className="adminProfileImage">
                        <img src={user?.["photo-path"]} alt="User" />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-3 col-lg-6 mb-3">
                      <div className="detail-box">
                        <h6 className="">First Name</h6>
                        <p className="">{user?.first_name}</p>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-6 mb-3">
                      <div className="detail-box">
                        <h6 className="">Last Name</h6>
                        <p className="">{user?.last_name}</p>
                      </div>
                    </div>

                    <div className="col-xl-3 col-lg-6 mb-3">
                      <div className="detail-box">
                        <h6 className="">Email Address</h6>
                        <p className="">{user?.email}</p>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-6 mb-3">
                      <div className="detail-box">
                        <h6 className="">Phone No</h6>
                        <p className="d-flex align-items-center gap-2">
                          <span>{getCountryFlag(user.phone)}</span>
                          <span>{user?.phone}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-3 flex-wrap">
                    <CustomButton
                      type="button"
                      variant="btn btn-primary"
                      className="min-width-190"
                      text="Edit Profile"
                      onClick={() => {
                        navigate("/admin/edit-profile");
                      }}
                    />
                    <CustomButton
                      type="button"
                      className="btn btn-outline-primary min-width-190"
                      text="Change Password"
                      onClick={() => {
                        navigate("/admin/change-password");
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Profile;
