import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import BackButton from "../../../Components/BackButton";
// import { getDetails } from "../../../Services/Api";
import { userOrderLogsData } from "../../../Config/data";
import { dateFormat, getCountryFlag, isNullOrEmpty, statusClassMap2 } from "../../../Utils/helper";
import "./style.css";

const UserOrderDetails = () => {
  const { orderid } = useParams();
  const [userOrderData, setUserOrderData] = useState({});

  useEffect(() => {
    const getUser = async () => {
      // Find the correct order based on id and orderid
      const response = userOrderLogsData.detail.data.find((e) => e.orderid === orderid);
      if (response) {
        setUserOrderData(response);
      }
    };
    getUser();
  }, [orderid]);

  const {
    shop_name,
    order_iD,
    date,
    status,
    cancellation_reason,
    productlogs = [],
    customerInfo,
    sub_total,
    delivery_charges,
    shippingAddress,
    billingAddress
  } = userOrderData;

  return (
    <DashboardLayout pageTitle="Order Details">
      <div className="row my-3">
        <div className="col-12">
          <h2 className="mainTitle">
            <BackButton />
            Order Details
          </h2>
        </div>
      </div>
      <div className="dashCard">
        <div className="row">
          <div className="col-12">
            <div className="col-12 d-flex flex-column flex-sm-row mb-4 col-12 gap-3">
              <div className="flex-grow-1 d-flex justify-content-start justify-content-sm-end">
                <div className="profile-status d-flex align-items-end flex-column gap-3">
                  <div className="status-action">
                    <div className="status-primary">
                      <label className="blackColor font-medium">Status : </label>
                      <span className={`ms-1 fw-bold ${statusClassMap2[status]}`}>{status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-10 col-lg-8">
                <div className="row">
                  {[
                    { label: "Shop Name", value: shop_name },
                    { label: "Order ID", value: order_iD },
                    { label: "Order Date", value: dateFormat(date) }
                  ].map(({ label, value }) => (
                    <div className="col-lg-6 col-xl-4 mb-3" key={label}>
                      <h4 className="secondaryLabel">{label}</h4>
                      <p className="secondaryText wrapText mb-0">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="table-responsive my-2 customTable position-relative">
              <table className="p-0">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {productlogs.length > 0 ? (
                    productlogs?.map((item) => (
                      <tr key={item.sNo}>
                        <td>{item.sNo}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2 over-flow-x">
                            <div className="productThumbnail flex-shrink-0">
                              <img src={item.image} alt={item.productName} />
                            </div>
                            <div className="tableProductWidth flex-grow-1">
                              <h6 className="blackColor mb-0">{item.productName}</h6>
                              <p className="mb-0 grayColor">{item.productDescription}</p>
                            </div>
                          </div>
                        </td>
                        <td>{item.price}</td>
                        <td>{item.quantity}</td>
                        <td>{item.total}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center">
                        No Products available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="dashCard my-3">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="order-summmery-card">
              <div className="card-body text-center p-4">
                <h4 className="card-title fw-bold mb-4">Order Summary</h4>
                <div className="d-flex justify-content-between my-2">
                  <h6 className="text-start blackColor">Sub Total</h6>
                  <div className="text-end blackColor fw-medium">{sub_total}</div>
                </div>
                <div className="d-flex justify-content-between  my-2">
                  <h6 className="text-start blackColor">Delivery Charges</h6>
                  <div className="text-end blackColor fw-medium ">{delivery_charges}</div>
                </div>
                <hr />
                <div className="d-flex justify-content-between my-2">
                  <h6 className="text-start fw-medium blackColor">Total</h6>
                  <div className="text-end fw-medium ">$160.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="dashCard my-3">
        <div className="row">
          <div className="col-md-10 col-xl-11 col-xxl-8">
            <div className="my-3">
              <h4 className="secondaryTitle">Contact Information </h4>
            </div>
            <div className="row">
              {[
                { label: "User Name", value: customerInfo?.name },
                { label: "Email Address", value: customerInfo?.email },
                { label: "Phone no", value: customerInfo?.phone }
              ].map(({ label, value }) => (
                <div className="col-lg-6 col-xl-4 mb-3" key={label}>
                  <h4 className="secondaryLabel">{label}</h4>
                  <p className="secondaryText wrapText mb-0">{value}</p>
                </div>
              ))}
            </div>
            <div className="my-3">
              <h4 className="secondaryTitle">Shipping Address</h4>
            </div>
            <div className="row">
              {[
                { label: "User Name", value: shippingAddress?.name },
                { label: "Phone No", value: shippingAddress?.phone },
                { label: "Country", value: shippingAddress?.country },
                { label: "state", value: shippingAddress?.state },
                { label: "city", value: shippingAddress?.city },
                { label: "zipCode", value: shippingAddress?.zipCode },
                { label: "address", value: shippingAddress?.address }
              ].map(({ label, value }) => (
                <div className={`col-lg-6 col-xl-4 mb-3 ${label == "address" && "col-md-8 col-lg-6"}`} key={label}>
                  <h4 className="secondaryLabel">{label}</h4>
                  <p className="secondaryText wrapText mb-0">
                    {label === "Phone No" && <span>{getCountryFlag(value)}</span>} {value}
                  </p>
                </div>
              ))}
            </div>
            <div className="my-3">
              <h4 className="secondaryTitle">billing Address</h4>
            </div>
            <div className="row">
              {[
                { label: "User Name", value: billingAddress?.name },
                { label: "Phone No", value: billingAddress?.phone },
                { label: "Country", value: billingAddress?.country },
                { label: "state", value: billingAddress?.state },
                { label: "city", value: billingAddress?.city },
                { label: "zipCode", value: billingAddress?.zipCode },
                { label: "address", value: billingAddress?.address },
              ].map(({ label, value }) => (
                <div className={`col-lg-6 col-xl-4 mb-3 ${label == "address" && "col-md-8 col-lg-6"}`} key={label}>
                  <h4 className="secondaryLabel">{label}</h4>
                  <p className="secondaryText wrapText mb-0">
                    {label === "Phone No" && <span>{getCountryFlag(value)}</span>} {value}
                  </p>
                </div>
              ))}
            </div>
            {status === "Cancelled" && !isNullOrEmpty(cancellation_reason) && (
              <div className="row mt-2">
                <div className="col-md-10 col-lg-8">
                  <h4 className="secondaryLabel fw-bold">Cancellation Reason</h4>
                  <p className="secondaryText mb-0">{cancellation_reason}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserOrderDetails;
