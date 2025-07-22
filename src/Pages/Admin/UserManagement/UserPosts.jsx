import BackButton2 from "../../../Components/BackButton/BackButton2";
import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import { postData } from "../../../Components/SocialMediaPost/PostData";
import SocialMediaPost from "../../../Components/SocialMediaPost/SocialMediaPost";
import { usePageTitle } from "../../../Utils/helper";
import "./style.css";

const UserPosts = () => {
  usePageTitle("User Post");
  //   const { id, orderid } = useParams();
  //   const [userOrderData, setUserOrderData] = useState({});

  //   useEffect(() => {
  //     const getUser = async () => {
  //       // Find the correct order based on id and orderid
  //       const response = userOrderLogsData.detail.data.find((e) => e.orderid === orderid);
  //       if (response) {
  //         setUserOrderData(response);
  //       }
  //     };
  //     getUser();
  //   }, [id, orderid]);

  return (
    <DashboardLayout pageTitle="Post">
      <div className="container-fluid dashCard">
        <div className="row my-4">
          <div className="col-12 d-flex">
            <BackButton2 />
            <h2 className="mainTitle mb-0">User Post</h2>
          </div>
        </div>
        <div style={{ borderBottom: "2px solid #fff" }}>
          <SocialMediaPost postData={postData} />
        </div>
        <div style={{ borderBottom: "2px solid #fff" }}>
          <SocialMediaPost postData={postData} />
        </div>
        <div style={{ borderBottom: "2px solid #fff" }}>
          <SocialMediaPost postData={postData} />
        </div>
        <div style={{ borderBottom: "2px solid #fff" }}>
          <SocialMediaPost postData={postData} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserPosts;
