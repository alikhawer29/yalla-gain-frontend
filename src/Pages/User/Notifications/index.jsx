import { Col, Container, Row } from "react-bootstrap";
import ConsolidatedNotifications from "../../../Components/ConsolidatedNotifications";
import { usePageTitle } from "../../../Utils/helper";
import "./style.css";

const UserNotifications = () => {
  usePageTitle("Notifications", true);
  const apiEndpoint = `/admin-api/notifications`;
  return (
    <section className="page-content p-0 notification-page">
      <Container fluid>
        <Row>
          <Col xs={12} className="">
            <ConsolidatedNotifications apiEndpoint={apiEndpoint} />
          </Col>
        </Row>
      </Container>
    </section>
  )
};

export default UserNotifications;
