const UserInformation = (props) => {
  return (
    <div className="row mb-3">
      <div className="col-md-12">
        <div className="row">
          <div className="col-xl-12 col-md-12 mb-3">
            <h3 className="fw-semibold">User Information</h3>
          </div>
          <div className="col-xl-3 col-md-6 mb-3">
            <h4 className="secondaryLabel">User Name:</h4>
            <p className="secondaryText text-secondary">
              {props?.data?.first_name} {props?.data?.last_name}
            </p>
          </div>
          <div className="col-xl-3 col-md-6 mb-3">
            <h4 className="secondaryLabel">Phone Number:</h4>
            <p className="secondaryText text-secondary">
              {props?.data?.phone_number}
            </p>
          </div>
          <div className="col-xl-3 col-md-6 mb-3">
            <h4 className="secondaryLabel">Email:</h4>
            <p className="secondaryText text-secondary">{props?.data?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInformation;
