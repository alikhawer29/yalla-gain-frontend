import { useState } from "react";
import { Link } from "react-router-dom";
import { images } from "../../../Assets";
import CustomModal from "../../../Components/CustomModal";
import { useAuth } from "../../../Hooks/useAuth";
import { usePageTitleUser } from "../../../Utils/helper";
import "./style.css";
const Home = () => {
  usePageTitleUser("Home");
  const { token } = useAuth();
  const [loginModal, setLoginModal] = useState(false);

  const handleProtectedClick = () => {
    if (!token) {
      setLoginModal(true);
    }
  };

  const servicesCardData = [
    {
      id: 1,
      title: "Services Name",
      category: "abc",
      quick: false,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit",
      chat: "$30.00",
      call: "$30.00",
      video_call: "$30.00",
      price: "$200.00",
      rating: 4.0,
      image: images.serviceImg1,
      isWishListed: true,
      provider_name: "ABC Service Provider Name",
      reviews: {
        count: 1000,
        comments: [
          {
            user: {
              name: "D. David",
              "photo-path":
                "https://media.istockphoto.com/id/1347005975/photo/portrait-of-a-serious-muslim-young-man-looking-at-camera.jpg?s=612x612&w=0&k=20&c=mxRUDCuwDD3ML6-vMaUlTY7Ghqlj2R_LOhWWCB5CTXE=",
            },
            comment:
              "Excellent product for digestive relief! DigestAid worked wonders for my bloating and indigestion. After using it for just a week, I feel so much better. Highly recommend it for anyone with digestive discomfort",
            rating: 2,
            timestamp: "Jul 14, 2023",
          },
          {
            user: {
              name: "Ai Boi",
              "photo-path": "https://www.profilebakery.com/wp-content/uploads/2024/05/Profile-picture-created-with-ai.jpeg",
            },
            comment:
              "Great for maintaining gut health. I've been using DigestAid regularly, and I've noticed a significant improvement in my overall digestive health. It's a great supplement to keep my gut in check.",
            rating: 4,
            timestamp: "Jul 14, 2023",
          },
          {
            user: {
              name: "Athalia Putri",
              "photo-path": "https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8",
            },
            comment:
              "Gentle and effective. I have a sensitive stomach, and DigestAid has been the perfect solution. It’s gentle on my system while effectively easing discomfort after meals.",
            rating: 5,
            timestamp: "Jul 14, 2023",
          },
          {
            user: {
              name: "Athalia Putri",
              "photo-path": "https://newprofilepicapp.com/wp-content/uploads/2024/02/New-Profile-Pic-App.webp",
            },
            comment:
              "Versatile digestive support. Whether I’m feeling gassy, bloated, or just need help digesting heavy meals, DigestAid always comes through. I like that it targets various digestive issues in one product",
            rating: 4,
            timestamp: "Dec 14, 2023",
          },
          {
            user: {
              name: "Athalia Putri",
              "photo-path":
                "https://shotkit.com/wp-content/uploads/bb-plugin/cache/cool-profile-pic-matheus-ferrero-landscape-6cbeea07ce870fc53bedd94909941a4b-zybravgx2q47.jpeg",
            },
            comment:
              "A must-have for gut health enthusiasts. DigestAid has become a staple in my daily routine. It's helped me stay regular and feel lighter throughout the day. It’s a comprehensive solution for anyone focused on gut health",
            rating: 3,
            timestamp: "Feb 16, 2024",
          },
        ],
      },
    },
    {
      id: 2,
      title: "Services Name",
      category: "abc",
      quick: true,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit",
      chat: "$30.00",
      call: "$30.00",
      video_call: "$30.00",
      price: "$50.00",
      rating: 4.8,
      reviews: "890 reviews",
      image: images.serviceImg2,
      isWishListed: false,
      provider_name: "ABC Service Provider Name",
      reviews: {
        count: 157,
        comments: [
          {
            user: {
              name: "D. David",
              "photo-path":
                "https://media.istockphoto.com/id/1347005975/photo/portrait-of-a-serious-muslim-young-man-looking-at-camera.jpg?s=612x612&w=0&k=20&c=mxRUDCuwDD3ML6-vMaUlTY7Ghqlj2R_LOhWWCB5CTXE=",
            },
            comment:
              "Excellent product for digestive relief! DigestAid worked wonders for my bloating and indigestion. After using it for just a week, I feel so much better. Highly recommend it for anyone with digestive discomfort",
            rating: 2,
            timestamp: "Jul 14, 2023",
          },
          {
            user: {
              name: "Ai Boi",
              "photo-path": "https://www.profilebakery.com/wp-content/uploads/2024/05/Profile-picture-created-with-ai.jpeg",
            },
            comment:
              "Great for maintaining gut health. I've been using DigestAid regularly, and I've noticed a significant improvement in my overall digestive health. It's a great supplement to keep my gut in check.",
            rating: 4,
            timestamp: "Jul 14, 2023",
          },
          {
            user: {
              name: "Athalia Putri",
              "photo-path": "https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8",
            },
            comment:
              "Gentle and effective. I have a sensitive stomach, and DigestAid has been the perfect solution. It’s gentle on my system while effectively easing discomfort after meals.",
            rating: 5,
            timestamp: "Jul 14, 2023",
          },
          {
            user: {
              name: "Athalia Putri",
              "photo-path": "https://newprofilepicapp.com/wp-content/uploads/2024/02/New-Profile-Pic-App.webp",
            },
            comment:
              "Versatile digestive support. Whether I’m feeling gassy, bloated, or just need help digesting heavy meals, DigestAid always comes through. I like that it targets various digestive issues in one product",
            rating: 4,
            timestamp: "Dec 14, 2023",
          },
          {
            user: {
              name: "Athalia Putri",
              "photo-path":
                "https://shotkit.com/wp-content/uploads/bb-plugin/cache/cool-profile-pic-matheus-ferrero-landscape-6cbeea07ce870fc53bedd94909941a4b-zybravgx2q47.jpeg",
            },
            comment:
              "A must-have for gut health enthusiasts. DigestAid has become a staple in my daily routine. It's helped me stay regular and feel lighter throughout the day. It’s a comprehensive solution for anyone focused on gut health",
            rating: 3,
            timestamp: "Feb 16, 2024",
          },
        ],
      },
    },
    {
      id: 3,
      title: "Services Name",
      category: "abc",
      quick: false,
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit",
      chat: "$30.00",
      call: "$30.00",
      video_call: "$30.00",
      price: "$30.00",
      rating: 4.9,
      reviews: "720 reviews",
      image: images.serviceImg3,
      isWishListed: true,
      provider_name: "ABC Service Provider Name",

      reviews: {
        count: 157,
        comments: [
          {
            user: {
              name: "D. David",
              "photo-path":
                "https://media.istockphoto.com/id/1347005975/photo/portrait-of-a-serious-muslim-young-man-looking-at-camera.jpg?s=612x612&w=0&k=20&c=mxRUDCuwDD3ML6-vMaUlTY7Ghqlj2R_LOhWWCB5CTXE=",
            },
            comment:
              "Excellent product for digestive relief! DigestAid worked wonders for my bloating and indigestion. After using it for just a week, I feel so much better. Highly recommend it for anyone with digestive discomfort",
            rating: 2,
            timestamp: "Jul 14, 2023",
          },
          {
            user: {
              name: "Ai Boi",
              "photo-path": "https://www.profilebakery.com/wp-content/uploads/2024/05/Profile-picture-created-with-ai.jpeg",
            },
            comment:
              "Great for maintaining gut health. I've been using DigestAid regularly, and I've noticed a significant improvement in my overall digestive health. It's a great supplement to keep my gut in check.",
            rating: 4,
            timestamp: "Jul 14, 2023",
          },
          {
            user: {
              name: "Athalia Putri",
              "photo-path": "https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8",
            },
            comment:
              "Gentle and effective. I have a sensitive stomach, and DigestAid has been the perfect solution. It’s gentle on my system while effectively easing discomfort after meals.",
            rating: 5,
            timestamp: "Jul 14, 2023",
          },
          {
            user: {
              name: "Athalia Putri",
              "photo-path": "https://newprofilepicapp.com/wp-content/uploads/2024/02/New-Profile-Pic-App.webp",
            },
            comment:
              "Versatile digestive support. Whether I’m feeling gassy, bloated, or just need help digesting heavy meals, DigestAid always comes through. I like that it targets various digestive issues in one product",
            rating: 4,
            timestamp: "Dec 14, 2023",
          },
          {
            user: {
              name: "Athalia Putri",
              "photo-path":
                "https://shotkit.com/wp-content/uploads/bb-plugin/cache/cool-profile-pic-matheus-ferrero-landscape-6cbeea07ce870fc53bedd94909941a4b-zybravgx2q47.jpeg",
            },
            comment:
              "A must-have for gut health enthusiasts. DigestAid has become a staple in my daily routine. It's helped me stay regular and feel lighter throughout the day. It’s a comprehensive solution for anyone focused on gut health",
            rating: 3,
            timestamp: "Feb 16, 2024",
          },
        ],
      },
    },
  ];
  return (
    <>
      {/* <section className="hero-banner">
        <div className="header-slide position-relative">
          <img className="img-fluid banner-image" src={images.BannerImg} alt="Hero Banner" />
          <div className="slide-content-wrap container-fluid">
            <div className="slide-content">
              <h2 className="section-title fw-bold mt-5 text-capitalize">Consult. Grow. Succeed – Book Your Session Now!</h2>
            </div>
          </div>
        </div>
      </section> */}
      {!token && (
        <>
          {/* <section className="why_we pt-sm-5 pt-3 text-center">
            <div className="container-fluid">
              <h2 className="fw-bold">Why We?</h2>
              <p className="mb-0" style={{ color: "#666764" }}>
                How to be a consultant. 1. You sign up as a consultant, add the necessary details and implement a form. There are 3 screening phases. 2. Once
                form submitted you will wait for approval. 3. Post approval you have finished the first screening step of the 3 phase screening. 4. Next it
                would be the 2nd screening, the video verification 10 minute Q and A. Where 5 common questions are asked and consultant has 2 minutes to answer
                each. 3. Once approved, an email sent to schedule a meeting with the admins for the next screening process. 4. The meeting date chosen and once
                meeting takes place, the admins ask the consultant necessary questions to judge the consultant whether he is competent or not. Here they can
                also discuss about commissions, pricings, dates of availability. 5. Once approved, there will be an email sent about approval. Where they will
                take him to a page where they will be able to see tutorials about how to operate. Somewhat like a probation period. A simple tutorial, a reading
                of rules and regulations and a quiz will take place to assess the consultant finally. Why the quiz? to make sure he knows his things, and later
                doesn't say I didn't know. AND he will not consult and be approved a 100% unless he passes the probation period of learning and tutorials and
                quiz and reading the rules
              </p>
            </div>
          </section> */}
          {/* <section className="how_to_be pt-sm-5 pt-3">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <h2 className="fw-bold">How To be a Consultant</h2>
                  <p style={{ color: "#666764" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et
                    viverra justo commodo. Proin sodales pulvinar tempor.{" "}
                  </p>
                  <div>
                    <button className="button_1" onClick={handleProtectedClick}>
                      <images.ArrowVector /> Video Verification
                    </button>
                    <button className="button_2" onClick={handleProtectedClick}>
                      <images.ArrowVector /> Meeting With Admin
                    </button>
                    <button className="button_3" onClick={handleProtectedClick}>
                      <images.ArrowVector /> Rules & Regulation
                    </button>
                    <button className="button_4" onClick={handleProtectedClick}>
                      <images.ArrowVector /> Tutorials
                    </button>
                    <button className="button_5" onClick={handleProtectedClick}>
                      <images.ArrowVector /> Final Approval
                    </button>
                    <button className="button_6" onClick={handleProtectedClick}>
                      <images.ArrowVector /> Wait for Result
                    </button>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="how_to_be_img">
                    <img src={images.newServiceImg} alt="our-aim" className="" />
                  </div>
                </div>
              </div>
            </div>
          </section> */}
          {/* <section className="our_aim pt-sm-5 pb-sm-5 pt-3">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="our_aim_img">
                    <img src={images.OurAim} alt="our-aim" className="w-100" />
                  </div>
                </div>
                <div className="col-lg-6">
                  <h2 className="fw-bold">Our Aim?</h2>
                  <p style={{ color: "#666764" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et
                    viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                    Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Aenean euismod bibendum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
                    laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus
                    et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed
                    rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
                  </p>
                </div>
              </div>
            </div>
          </section> */}
        </>
      )}
      {token && (
        <>
          {/* <section className="why_we pt-sm-5 pt-3">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-4">
                    <h2 className="fw-bold mb-0">Our Services</h2>
                    <Link to={`/services`} className="btn btn-primary">
                      View All
                    </Link>
                  </div>
                  <div className="row">
                    {servicesCardData?.map((item) => (
                      <div className="col-12 col-xl-6 col-xxl-4 mb-xk-0 mb-3">
                        <GeneralCard data={item} serviceCard={true} linkPath="/services/"/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section> */}
          {/* <section className="how_to_be pt-sm-5 pt-3">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <h2 className="fw-bold">About Us</h2>
                  <p className="lh-base" style={{ color: "#666764" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et
                    viverra justo commodo. Proin sodales pulvinar tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
                    laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin
                    sodales pulvinar tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit
                    amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                    euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Lorem ipsum
                    dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo
                    commodo. Proin sodales pulvinar tempor.
                     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et
                    viverra justo commodo. Proin sodales pulvinar tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
                    laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin
                    sodales pulvinar tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit
                    amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                    euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Lorem ipsum
                    dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo
                    commodo. Proin sodales pulvinar tempor.
                  </p>
                </div>
                <div className="col-lg-6">
                  <div className="how_to_be_img">
                    <img src={images.newServiceImg} alt="our-aim" className="" />
                  </div>
                </div>
              </div>
            </div>
          </section> */}
          {/* <section className="our_aim pt-sm-5 pb-sm-5 pt-3">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="our_aim_img">
                    <img src={images.OurAim} alt="our-aim" className="w-100" />
                  </div>
                </div>
                <div className="col-lg-6">
                  <h2 className="fw-bold">Our Aim?</h2>
                  <p style={{ color: "#666764" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et
                    viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                    Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Aenean euismod bibendum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
                    laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus
                    et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed
                    rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}

                     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et
                    viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
                    Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Aenean euismod bibendum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum
                    laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus
                    et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed
                    rhoncus sapien nunc eget odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit.{" "}
                  </p>
                </div>
              </div>
            </div>
          </section> */}
        </>
      )}
      <CustomModal show={loginModal} close={() => setLoginModal(false)} para="You need to login or signup first">
        <div className="text-center">
          <img src={images.Question} alt="check" className="modalImage" />
          <p className="modalPara text-capitalize">You need to login or signup first</p>
          <div className="d-flex gap-2 justify-content-center">
            <Link to="/login" className="btn btn-primary min-width-150">
              Login
            </Link>
            <Link to="/signup" className="btn btn-secondary min-width-150">
              Signup
            </Link>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default Home;
