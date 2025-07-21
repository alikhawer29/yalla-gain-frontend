import { DashboardLayout } from "../../../Components/Layouts/AdminLayout/DashboardLayout";
import BackButton from "../../../Components/BackButton";
import { postData } from "../../../Components/SocialMediaPost/PostData";
import SocialMediaPost from "../../../Components/SocialMediaPost/SocialMediaPost";
import "./style.css";

const UserPosts = () => {
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
      <div className="container-fluid">
        <div className="row my-4">
          <div className="col-12 d-flex">
            <BackButton />
            <h2 className="mainTitle mb-0">Post</h2>
          </div>
        </div>
        <SocialMediaPost postData={postData} />
        <SocialMediaPost postData={postData} />
        <SocialMediaPost postData={postData} />
        <SocialMediaPost postData={postData} />
      </div>
    </DashboardLayout>
  );
};

export default UserPosts;
