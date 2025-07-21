const PickupMethod = (props) => {
  return (
    <div className="row mb-3">
      <div className="col-md-12">
        <div className="row">
          <div className="col-xl-12 col-md-12 mb-3">
            <h3 className="fw-semibold">Pickup Method</h3>
          </div>
          <div className="col-xl-3 col-md-6 mb-3">
            <h4 className="secondaryLabel">Pickup</h4>
            <p className="secondaryText text-secondary">
              {props?.data?.delivery_type === "vehicle" ? (
                <>
                  <li>{props?.data?.vehicle?.car_name}</li>
                  <li>{props?.data?.vehicle?.car_number}</li>
                  <li>{props?.data?.vehicle?.car_color}</li>
                </>
              ) : (
                "Walk-In Customer"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PickupMethod;
