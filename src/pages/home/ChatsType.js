import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ChatService from "../../services/chatService";
import GlobalContext from "../../context/GlobalContext";
import CreateGroup from "../../popups/groupChat/CreateGroup";
import DeleteGroupChat from "../../popups/groupChat/deleteGroupChat";
import GroupCreateSuccess from "../../popups/groupChat/GroupCreateSuccess";
import GroupInfo from "../../popups/groupChat/GroupInfo";
import Chat from "./chatType/Chat";
import GlobalMessage from "./chatType/GlobalMessage";
import GroupChat from "./chatType/GroupChat";
import ImageCarousel from "../../popups/imageCarousel/ImageCarousel";
import SentMessage from "../../popups/message/SentMessage";
const serv = new ChatService();
function ChatsType() {
  const params = useParams();
  const globalCtx = useContext(GlobalContext);
  const [user, setUser] = globalCtx.user;
  const [isAuthentiCated, setIsAuthentiCated] = globalCtx.auth;
  const [unreadMsgCount, setUnreadMsgCount] = globalCtx.unreadMsgCount;
  const [activeChat, setActiveChat] = globalCtx.activeChat;
  const [premiumChat, setPremiumChat] = useState(0);
  const [groupChat, setGroupChat] = useState(0);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateGroupSuccess, setShowCreateGroupSuccess] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [showDeleteGroup, setShowDeleteGroup] = useState(false);
  const [groupChatRerender, setGroupChatRerender] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [showSentMsg, setShowSentMsg] = useState(false);
  useEffect(() => {
    if (
      isAuthentiCated &&
      window.location.pathname.includes("groupinvite") &&
      params?.id
    ) {
      sendInvitation();
    }
  }, [params]);
  const sendInvitation = async () => {
    try {
      let obj = {
        groupId: params.id,
      };
      await serv.acceptInvitationLink(obj).then((resp) => {
        if (resp.message) {
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const showSentMsgPopup = () => {
    setShowSentMsg(!showSentMsg);
  };
  return (
    <>
      <div className="feedChatBox stickyChatBox">
        <div className="feedChatHead feedChatHeadCustom">
          <div className="feedChatHeadInner">
            <ul className="feedChatHeadLeft nav">
              <li className="groupIcon groupIconCustom position-relative">
                <a
                  onClick={() => setActiveChat(1)}
                  className={
                    "groupfeed nav-link nav-link-Custom " +
                    (activeChat === 1 && "active")
                  }
                  data-bs-toggle="tab"
                  role="tab"
                  data-bs-target="#messageChat"
                >
                  {/* <img src="/images/icons/global-chat.svg" alt="group" className="img-fluid" /> */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 9C11.8022 9 11.6089 9.05865 11.4444 9.16853C11.28 9.27841 11.1518 9.43459 11.0761 9.61732C11.0004 9.80004 10.9806 10.0011 11.0192 10.1951C11.0578 10.3891 11.153 10.5673 11.2929 10.7071C11.4327 10.847 11.6109 10.9422 11.8049 10.9808C11.9989 11.0194 12.2 10.9996 12.3827 10.9239C12.5654 10.8482 12.7216 10.72 12.8315 10.5556C12.9414 10.3911 13 10.1978 13 10C13 9.73478 12.8946 9.48043 12.7071 9.29289C12.5196 9.10536 12.2652 9 12 9ZM19 2H5C4.20435 2 3.44129 2.31607 2.87868 2.87868C2.31607 3.44129 2 4.20435 2 5V15C2 15.7956 2.31607 16.5587 2.87868 17.1213C3.44129 17.6839 4.20435 18 5 18H16.59L20.29 21.71C20.3834 21.8027 20.4943 21.876 20.6161 21.9258C20.7379 21.9755 20.8684 22.0008 21 22C21.1312 22.0034 21.2613 21.976 21.38 21.92C21.5626 21.845 21.7189 21.7176 21.8293 21.5539C21.9396 21.3901 21.999 21.1974 22 21V5C22 4.20435 21.6839 3.44129 21.1213 2.87868C20.5587 2.31607 19.7956 2 19 2ZM20 18.59L17.71 16.29C17.6166 16.1973 17.5057 16.124 17.3839 16.0742C17.2621 16.0245 17.1316 15.9992 17 16H5C4.73478 16 4.48043 15.8946 4.29289 15.7071C4.10536 15.5196 4 15.2652 4 15V5C4 4.73478 4.10536 4.48043 4.29289 4.29289C4.48043 4.10536 4.73478 4 5 4H19C19.2652 4 19.5196 4.10536 19.7071 4.29289C19.8946 4.48043 20 4.73478 20 5V18.59ZM8 9C7.80222 9 7.60888 9.05865 7.44443 9.16853C7.27998 9.27841 7.15181 9.43459 7.07612 9.61732C7.00043 9.80004 6.98063 10.0011 7.01921 10.1951C7.0578 10.3891 7.15304 10.5673 7.29289 10.7071C7.43275 10.847 7.61093 10.9422 7.80491 10.9808C7.99889 11.0194 8.19996 10.9996 8.38268 10.9239C8.56541 10.8482 8.72159 10.72 8.83147 10.5556C8.94135 10.3911 9 10.1978 9 10C9 9.73478 8.89464 9.48043 8.70711 9.29289C8.51957 9.10536 8.26522 9 8 9V9ZM16 9C15.8022 9 15.6089 9.05865 15.4444 9.16853C15.28 9.27841 15.1518 9.43459 15.0761 9.61732C15.0004 9.80004 14.9806 10.0011 15.0192 10.1951C15.0578 10.3891 15.153 10.5673 15.2929 10.7071C15.4327 10.847 15.6109 10.9422 15.8049 10.9808C15.9989 11.0194 16.2 10.9996 16.3827 10.9239C16.5654 10.8482 16.7216 10.72 16.8315 10.5556C16.9414 10.3911 17 10.1978 17 10C17 9.73478 16.8946 9.48043 16.7071 9.29289C16.5196 9.10536 16.2652 9 16 9Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                {unreadMsgCount.messageChat !== 0 && (
                  <span className="badge rounded-pill bg-danger position-absolute">
                    {unreadMsgCount.messageChat}
                  </span>
                )}
              </li>
              <li className="groupIcon groupIconCustom position-relative">
                <a
                  onClick={() => setActiveChat(2)}
                  className="groupfeed nav-link nav-link-Custom"
                  role="tab"
                  data-bs-toggle="tab"
                  data-bs-target="#trendingTab"
                >
                  <svg
                    width="32"
                    height="24"
                    viewBox="0 0 32 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.3 12.22C17.8336 11.7581 18.2616 11.1869 18.5549 10.545C18.8482 9.90316 19 9.20571 19 8.5C19 7.17392 18.4732 5.90215 17.5355 4.96447C16.5979 4.02678 15.3261 3.5 14 3.5C12.6739 3.5 11.4021 4.02678 10.4645 4.96447C9.52678 5.90215 9 7.17392 9 8.5C8.99999 9.20571 9.1518 9.90316 9.44513 10.545C9.73845 11.1869 10.1664 11.7581 10.7 12.22C9.30014 12.8539 8.11247 13.8775 7.27898 15.1685C6.4455 16.4596 6.00147 17.9633 6 19.5C6 19.7652 6.10536 20.0196 6.29289 20.2071C6.48043 20.3946 6.73478 20.5 7 20.5C7.26522 20.5 7.51957 20.3946 7.70711 20.2071C7.89464 20.0196 8 19.7652 8 19.5C8 17.9087 8.63214 16.3826 9.75736 15.2574C10.8826 14.1321 12.4087 13.5 14 13.5C15.5913 13.5 17.1174 14.1321 18.2426 15.2574C19.3679 16.3826 20 17.9087 20 19.5C20 19.7652 20.1054 20.0196 20.2929 20.2071C20.4804 20.3946 20.7348 20.5 21 20.5C21.2652 20.5 21.5196 20.3946 21.7071 20.2071C21.8946 20.0196 22 19.7652 22 19.5C21.9985 17.9633 21.5545 16.4596 20.721 15.1685C19.8875 13.8775 18.6999 12.8539 17.3 12.22ZM14 11.5C13.4067 11.5 12.8266 11.3241 12.3333 10.9944C11.8399 10.6648 11.4554 10.1962 11.2284 9.64805C11.0013 9.09987 10.9419 8.49667 11.0576 7.91473C11.1734 7.33279 11.4591 6.79824 11.8787 6.37868C12.2982 5.95912 12.8328 5.6734 13.4147 5.55764C13.9967 5.44189 14.5999 5.5013 15.1481 5.72836C15.6962 5.95542 16.1648 6.33994 16.4944 6.83329C16.8241 7.32664 17 7.90666 17 8.5C17 9.29565 16.6839 10.0587 16.1213 10.6213C15.5587 11.1839 14.7956 11.5 14 11.5ZM23.74 11.82C24.38 11.0993 24.798 10.2091 24.9438 9.25634C25.0896 8.30362 24.9569 7.32907 24.5618 6.45C24.1666 5.57093 23.5258 4.8248 22.7165 4.30142C21.9071 3.77805 20.9638 3.49974 20 3.5C19.7348 3.5 19.4804 3.60536 19.2929 3.79289C19.1054 3.98043 19 4.23478 19 4.5C19 4.76522 19.1054 5.01957 19.2929 5.20711C19.4804 5.39464 19.7348 5.5 20 5.5C20.7956 5.5 21.5587 5.81607 22.1213 6.37868C22.6839 6.94129 23 7.70435 23 8.5C22.9986 9.02524 22.8593 9.5409 22.5961 9.99542C22.3328 10.4499 21.9549 10.8274 21.5 11.09C21.3517 11.1755 21.2279 11.2977 21.1404 11.4447C21.0528 11.5918 21.0045 11.7589 21 11.93C20.9958 12.0998 21.0349 12.2678 21.1137 12.4183C21.1924 12.5687 21.3081 12.6967 21.45 12.79L21.84 13.05L21.97 13.12C23.1754 13.6917 24.1923 14.596 24.901 15.7263C25.6096 16.8566 25.9805 18.1659 25.97 19.5C25.97 19.7652 26.0754 20.0196 26.2629 20.2071C26.4504 20.3946 26.7048 20.5 26.97 20.5C27.2352 20.5 27.4896 20.3946 27.6771 20.2071C27.8646 20.0196 27.97 19.7652 27.97 19.5C27.9782 17.9654 27.5938 16.4543 26.8535 15.1101C26.1131 13.7659 25.0413 12.6333 23.74 11.82Z"
                      fill="currentColor"
                    />
                    <path
                      d="M4.2307 11.82C3.59074 11.0993 3.17269 10.2091 3.0269 9.25634C2.88111 8.30362 3.01378 7.32907 3.40894 6.45C3.8041 5.57093 4.44491 4.8248 5.25423 4.30142C6.06356 3.77805 7.0069 3.49974 7.9707 3.5C8.23592 3.5 8.49027 3.60536 8.67781 3.79289C8.86535 3.98043 8.9707 4.23478 8.9707 4.5C8.9707 4.76522 8.86535 5.01957 8.67781 5.20711C8.49027 5.39464 8.23592 5.5 7.9707 5.5C7.17505 5.5 6.41199 5.81607 5.84938 6.37868C5.28677 6.94129 4.9707 7.70435 4.9707 8.5C4.97212 9.02524 5.11141 9.5409 5.37464 9.99542C5.63788 10.4499 6.01583 10.8274 6.4707 11.09C6.61897 11.1755 6.74279 11.2977 6.83034 11.4447C6.91788 11.5918 6.96621 11.7589 6.9707 11.93C6.97489 12.0998 6.93577 12.2678 6.85704 12.4183C6.77831 12.5687 6.66256 12.6967 6.5207 12.79L6.1307 13.05L6.0007 13.12C4.79531 13.6917 3.77839 14.596 3.06973 15.7263C2.36106 16.8566 1.99016 18.1659 2.0007 19.5C2.0007 19.7652 1.89535 20.0196 1.70781 20.2071C1.52027 20.3946 1.26592 20.5 1.0007 20.5C0.735487 20.5 0.481133 20.3946 0.293596 20.2071C0.10606 20.0196 0.000703812 19.7652 0.000703812 19.5C-0.00747108 17.9654 0.37688 16.4543 1.11724 15.1101C1.85759 13.7659 2.92936 12.6333 4.2307 11.82Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                {groupChat !== 0 && (
                  <span className="badge rounded-pill bg-danger position-absolute">
                    {groupChat}
                  </span>
                )}
              </li>
              {(user.role.includes("admin") ||
                user.role.includes("userPaid")) && (
                <li className="groupIcon groupIconCustom position-relative">
                  <a
                    onClick={() => setActiveChat(0)}
                    className={
                      "groupfeed nav-link nav-link-Custom " +
                      (activeChat === 0 && "active")
                    }
                    data-bs-toggle="tab"
                    role="tab"
                    data-bs-target="#globalMessage"
                  >
                    {/* <img src="/images/icons/globe.svg" alt="group" className="img-fluid" /> */}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M2 12H22"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </a>
                  {premiumChat !== 0 && (
                    <span className="badge rounded-pill bg-danger position-absolute">
                      {premiumChat}
                    </span>
                  )}
                </li>
              )}
            </ul>
            {/* <div className="feedChatHeadRight">
                <a data-bs-toggle="dropdown" href="javascript:void(0);">
                  <svg width="20" height="5" viewBox="0 0 20 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="2.30769" cy="2.5" rx="2.30769" ry="2.5" fill="#465D61" />
                    <ellipse cx="10.0001" cy="2.5" rx="2.30769" ry="2.5" fill="#465D61" />
                    <ellipse cx="17.6925" cy="2.5" rx="2.30769" ry="2.5" fill="#465D61" />
                  </svg>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Link 1
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Link 2
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Link 3
                    </a>
                  </li>
                </ul>
                <a href="javascript:void(0);" className="closeChatMob d-none">
                  <img src="/images/icons/close-white.svg" alt="close-chat-icon" className="img-fluid" />
                </a>
                <div className="chatCross_icon d-none">
                  <a href="javascript:void(0)">
                    <img src="/images/profile/multiply.svg" />
                  </a>
                </div>
              </div> */}
          </div>
        </div>
        <div className="tab-content">
          {(user.role.includes("admin") || user.role.includes("userPaid")) && (
            <div className={`tab-pane ${activeChat === 0 ? "active" : ""}`}>
              <GlobalMessage
                setPremiumChat={setPremiumChat}
                setMediaFiles={setMediaFiles}
              />
            </div>
          )}
          <div className={`tab-pane ${activeChat === 1 ? "active" : ""}`}>
            <Chat
              setMediaFiles={setMediaFiles}
              setShowSentMsg={showSentMsgPopup}
            />
          </div>
          <div className={`tab-pane ${activeChat === 2 ? "active" : ""}`}>
            <GroupChat
              groupChatRerendered={groupChatRerender}
              setShowDeleteGroup={setShowDeleteGroup}
              showCreateGroup={showCreateGroup}
              setShowCreateGroup={setShowCreateGroup}
              setShowGroupInfo={setShowGroupInfo}
              setMediaFiles={setMediaFiles}
              setGroupChat={setGroupChat}
              groupChat={groupChat}
            />
            {/* <div id="feedChat" className="feedChatUser">
              <div className="chatBoxGroupBottom">
                <div className="feedChatHeading">
                  <h5 className="mb-0">Trending</h5>
                </div>
                <div className="trending_newsHeight allFeedUser">
                  <div className="trending_news">
                    <a href="javascript:void(0)" className="d-block">
                      <div className="trendnews_box">
                        <div className="trendnewsImg">
                          <img src="/images/profile/trending1.png" className="img-fluid" />
                        </div>
                        <div className="trendnews_content">
                          <h5 className="mb-1 mt-2">This is the big move!</h5>
                          <p className="mb-0">#usd#kbp</p>
                        </div>
                      </div>
                    </a>
                    <a href="javascript:void(0)" className="d-block">
                      <div className="trendnews_box">
                        <div className="trendnewsImg">
                          <img src="/images/profile/trending1.png" className="img-fluid" />
                        </div>
                        <div className="trendnews_content">
                          <h5 className="mb-1 mt-2">This is the big move!</h5>
                          <p className="mb-0">#usd#kbp</p>
                        </div>
                      </div>
                    </a>
                    <a href="javascript:void(0)" className="d-block">
                      <div className="trendnews_box">
                        <div className="trendnewsImg">
                          <img src="/images/profile/trending1.png" className="img-fluid" />
                        </div>
                        <div className="trendnews_content">
                          <h5 className="mb-1 mt-2">This is the big move!</h5>
                          <p className="mb-0">#usd#kbp</p>
                        </div>
                      </div>
                    </a>
                    <a href="javascript:void(0)" className="d-block">
                      <div className="trendnews_box">
                        <div className="trendnewsImg">
                          <img src="/images/profile/trending1.png" className="img-fluid" />
                        </div>
                        <div className="trendnews_content">
                          <h5 className="mb-1 mt-2">This is the big move!</h5>
                          <p className="mb-0">#usd#kbp</p>
                        </div>
                      </div>
                    </a>
                    <a href="javascript:void(0)" className="d-block">
                      <div className="trendnews_box">
                        <div className="trendnewsImg">
                          <img src="/images/profile/trending1.png" className="img-fluid" />
                        </div>
                        <div className="trendnews_content">
                          <h5 className="mb-1 mt-2">This is the big move!</h5>
                          <p className="mb-0">#usd#kbp</p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {showCreateGroup && (
        <CreateGroup
          onClose={() => setShowCreateGroup(false)}
          onFinish={(type) => {
            setShowCreateGroup(false);
            setShowCreateGroupSuccess(type);
          }}
          groupId={showCreateGroup}
        />
      )}
      {showCreateGroupSuccess && (
        <GroupCreateSuccess
          onClose={() => {
            setShowCreateGroupSuccess(false);
            setGroupChatRerender(!groupChatRerender);
          }}
          type={showCreateGroupSuccess}
        />
      )}
      {showGroupInfo && (
        <GroupInfo
          onClose={() => setShowGroupInfo(false)}
          onFinish={() => {
            setShowGroupInfo(false);
            setGroupChatRerender(!groupChatRerender);
          }}
          onEdit={(id) => {
            setShowGroupInfo(false);
            setShowCreateGroup(id);
          }}
          groupId={showGroupInfo}
        />
      )}
      {showDeleteGroup && (
        <DeleteGroupChat
          chat={showDeleteGroup}
          onClose={() => setShowDeleteGroup(false)}
          onFinish={() => {
            // handleShowDeleteGroup(data);
            setGroupChatRerender(!groupChatRerender);
            setShowDeleteGroup(false);
          }}
        />
      )}
      {mediaFiles && mediaFiles.length > 0 && (
        <ImageCarousel
          onClose={() => setMediaFiles(null)}
          mediaFiles={mediaFiles}
          imageIdx={0}
        />
      )}
      {showSentMsg && (
        <SentMessage onClose={() => setShowSentMsg(!showSentMsg)} />
      )}
    </>
  );
}
export default ChatsType;
