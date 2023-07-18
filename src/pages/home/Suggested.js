import React, { useEffect, useState } from "react";
import noProfile from "../../assets/images/noprofile.png";
import "../../assets/Suggested.css";
import SuggestedService from "../../services/suggestedService";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import UserFollowerService from "../../services/userFollowerService";
import Loader from "../../components/Loader";

function Suggested() {
  const suggestedServ = new SuggestedService();
  const followerServ = new UserFollowerService();
  const [modalShow, setModalShow] = useState(false);
  const [suggestedHome, setsuggestedHome] = useState([]);
  const [suggestedTab, setsuggestedTab] = useState([]);
  const [category, setCategory] = useState("trending_people");
  const [tabRequest, setTabRequest] = useState({
    searchText: "",
    tab: "trending_people",
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const suggestTabBtn = [
    { key: 1, tab: "trending_people", value: "Trending People" },
    { key: 2, tab: "you_may_know", value: "People You May Know" },
    { key: 3, tab: "new", value: "New to VestorGrow" },
  ];

  useEffect(() => {
    getSuggestedHome();
    getSuggestedTab();
  }, [category, search]);

  const getSuggestedHome = async () => {
    try {
      let res = await suggestedServ.suggestListHome();
      setsuggestedHome(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const getSuggestedTab = async () => {
    setLoading(true);
    try {
      let res = await suggestedServ.suggestListTab(tabRequest);
      setsuggestedTab(res.users);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteSuggestedHome = (id) => {
    const updatedItems = suggestedHome.filter((item) => item._id !== id);
    setsuggestedHome(updatedItems);
  };
  const deleteSuggested = (id) => {
    const updatedItems = suggestedTab.filter((item) => item._id !== id);
    setsuggestedTab(updatedItems);
  };

  const handleClick = async (newCategory) => {
    setCategory(newCategory);
    setTabRequest({ tab: newCategory });
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value);
  };
  const filteredSuggested = suggestedTab.filter((user) => {
    return user?.user_name.toString().toLowerCase().includes(search);
  });
  //for follow request
  const handleFollowRequest = async (id) => {
    try {
      let resp = await followerServ.sendFollowReq({ followingId: id });
      return resp.data;
    } catch (err) {}
  };

  return (
    <>
      <div className="suggestionBox">
        <div className="suggestionHead">
          <span>Suggested for You</span>
          <span
            onClick={() => {
              setModalShow(true);
              setSearch("");
            }}
          >
            See All
          </span>
        </div>
        <div className="suggestionBody">
          {suggestedHome?.slice(0, 2).map((user) => {
            return (
              <>
                <div className="profileBox">
                  <Link to={"/userprofile/" + user?._id}>
                    <img
                      src="/images/icons/close.svg"
                      className="suggestClose"
                      alt="close"
                      onClick={() => deleteSuggestedHome(user._id)}
                    />
                    <img
                      src={
                        user?.profile_img
                          ? user.profile_img
                          : "/images/profile/default-profile.png"
                      }
                      alt="profile"
                    />
                    <span className="name">
                      {user?.user_name?.length > 8
                        ? user?.user_name?.slice(0, 8) + "..."
                        : user.user_name}
                    </span>
                    <span className="title" style={{ whiteSpace: "pre-wrap" }}>
                      {user?.title ? (
                        user?.title?.length > 8 ? (
                          user?.title?.slice(0, 10) + "..."
                        ) : (
                          user.title
                        )
                      ) : (
                        <> </>
                      )}
                    </span>
                  </Link>
                  {user.isFollowing === "following" ? (
                    <button className="follow">Following</button>
                  ) : user.isFollowing === "requested" ? (
                    <button className="follow">Requested</button>
                  ) : (
                    <button
                      className="follow"
                      onClick={() => {
                        handleFollowRequest(user._id);
                      }}
                    >
                      Follow
                    </button>
                  )}
                </div>
                <div className="border" style={{ height: "130px" }}></div>
              </>
            );
          })}
        </div>
      </div>

      {/* MODAL FOR SUGGESTED USER */}
      <Modal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          setSearch("");
        }}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <h1 className="modal-title fs-5" id="exampleModalLabel">
            Suggestions
          </h1>
          <div className="suggestInputGroup">
            <img
              src="/images/icons/search.svg"
              alt="search-icon"
              className="img-fluid"
            />
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              name="search"
              onChange={handleSearch}
            />
          </div>
        </Modal.Header>
        <Modal.Header className="button-header" style={{ borderBottom: "0" }}>
          {suggestTabBtn.map((tab) => {
            return (
              <>
                <button
                  key={tab.key}
                  className={category === tab.tab ? "active-tab" : ""}
                  onClick={() => handleClick(tab.tab)}
                >
                  {tab.value}
                </button>
              </>
            );
          })}
        </Modal.Header>
        <Modal.Body>
          <div
            className="suggestionModalBody"
            style={{ overflowY: loading ? "hidden" : "scroll" }}
          >
            {loading ? (
              // Display loader while loading is true
              <div className="suggest-load">
                <Loader />
              </div>
            ) : filteredSuggested?.length === 0 ? (
              "No users Found"
            ) : (
              filteredSuggested?.map((user) => {
                return (
                  <>
                    <div className="profileBox">
                      <Link to={"/userprofile/" + user?._id}>
                        <div className="profile-image">
                          <img
                            src={
                              user?.profile_img
                                ? user.profile_img
                                : "/images/profile/default-profile.png"
                            }
                            alt="profile"
                          />
                        </div>
                        <div className="profile-content">
                          <span className="name">
                            {user?.user_name?.length > 18
                              ? user?.user_name?.slice(0, 18) + "..."
                              : user.user_name}
                          </span>
                          <span className="title">
                            {user?.title?.length > 18
                              ? user?.title?.slice(0, 18) + "..."
                              : user.title}
                          </span>
                          <span className="followers">
                            {user.followers} Followers
                          </span>
                        </div>
                      </Link>
                      <div className="suggst-btns">
                        <button
                          className="skip"
                          onClick={() => deleteSuggested(user._id)}
                        >
                          Skip
                        </button>
                        {user.isFollowing === "following" ? (
                          <button className="follow">Following</button>
                        ) : user.isFollowing === "requested" ? (
                          <button className="follow">Requested</button>
                        ) : (
                          <button
                            className="follow"
                            onClick={() => {
                              handleFollowRequest(user._id);
                            }}
                          >
                            Follow
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                );
              })
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Suggested;
