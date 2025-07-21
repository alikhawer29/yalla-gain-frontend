const Summary = (props) => {
  return (
    <div className="row">
      <div className="col-xl-12 col-md-3 mb-3">
        <div className="row">
          <div className="col-xl-12 col-md-12 mb-3">
            <h3 className="fw-semibold">Order Summary</h3>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12 col-md-12">
            <div className="align-content-center align-items-center d-flex justify-content-between mb-3">
              <h4 className="secondaryTextAD fw-normal mb-0">Sub Total</h4>
              <p className="secondaryTextAD fw-normal mb-0">
                {props?.data?.sub_total}
              </p>
            </div>
            <div className="align-content-center align-items-center d-flex justify-content-between mb-3">
              <h4 className="secondaryTextAD fw-normal mb-0">
                Voucher Discount
              </h4>
              <p className="secondaryTextAD fw-normal mb-0">
                - {props?.data?.voucher_discount} AED
              </p>
            </div>
            <div className="align-content-center align-items-center d-flex justify-content-between mb-3">
              <h4 className="secondaryTextAD fw-normal mb-0">
                Loyalty Discount
              </h4>
              <p className="secondaryTextAD fw-normal mb-0">
                - {props?.data?.loyalty_discount} AED
              </p>
            </div>
            <div className="align-content-center align-items-center d-flex justify-content-between mb-3">
              <h4 className="secondaryTextAD fw-normal mb-0">Total</h4>
              <p className="secondaryTextAD fw-normal mb-0">
                {props?.data?.total_price} AED
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
