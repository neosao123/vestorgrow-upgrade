import React, { useState, useContext } from 'react';
import GlobalContext from "../context/GlobalContext";
import ChatService from "../services/chatService";
import UserService from "../services/UserService";
import ProfileImage from '../shared/ProfileImage';
import Select from "react-select";

const isImage = ["gif", "jpg", "jpeg", "png", "svg", "HEIC", "heic", "webp", "jfif", "pjpeg", "pjp", "avif", "apng"];

const NewChat = ({ ...props }) => {

    const { userList } = props;

    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;
    const serv = new ChatService();
    const userServ = new UserService();
    const [compUserList, setCompUserList] = useState([]);
    const [searchUserText, setSearchUserText] = useState("");
    const [loadingState, setLoadingState] = useState(false);
    const [showEmoji,setShowEmoji] = useState(false);
    const [msg, setMsg] = useState({
        content: "",
        file: "",
        sender: user._id,
    });

    const sendNewMessage = async () => {
        const formData = new FormData();
        formData.append("content", msg.content);
        formData.append("sender", msg.sender);
        formData.append("users", compUserList);
        if (Array.isArray(msg.file)) {
            msg.file.forEach((element) => {
                formData.append("file", element);
            });
        }
        try {
            await serv.composeMsg(formData).then((resp) => {
                if (resp.data) {
                    //set message to all users...
                } else {
                    console.log(resp);
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleCompUserList = (item, type) => {
        if (type === "add") {
            setCompUserList([...compUserList, item]);
            setSearchUserText("");
        } else {
            setCompUserList([]);
        }
    };

    const handleKeypress = (e) => {
        if (e.keyCode === 13 && e.shiftKey) {
            sendNewMessage();
        }
    };

    const formatOptionLabel = ({ value, label, full_name, banner }, { context }) => {
        if (context === "value") {
            return label;
        } else {
            return (
                <div className="search-resultCustom-div">
                    <div className="search-resultCustom-image">
                        <ProfileImage url={banner} style={{ borderRadius: "30px" }} />
                    </div>
                    <div className="search-resultCustom-udata">
                        <h4>
                            {label?.length > 25 ? label?.slice(0, 25) + "..." : label}{" "}
                        </h4>
                        <p>{full_name}</p>
                    </div>
                </div>
            );
        }
    };


    return (
        <div className="messageRightHeader">
            <div className="messageHeading">
                <h4>New Message</h4>
            </div>
            <div className="composeSearching">
                <div className="compose_Searchbar">
                    <img src="/images/icons/search.svg" alt="search" className="img-fluid search_Icon" />
                    <Select
                        isMulti
                        isClearable={false}
                        name="search"
                        options={userList.map((i) => {
                            return {
                                value: i.userId._id,
                                label: i.userId.user_name,
                                full_name: `${i.userId.first_name} ${i.userId.last_name}`,
                                banner: i.userId.profile_img,
                                ...i.userId,
                            };
                        })}
                        styles={{
                            control: (baseStyles, state) => ({
                                background: "#E7E7E7",
                                borderRadius: "0 35px 35px 0",

                            }),
                        }}
                        onChange={(e) => setCompUserList([...compUserList, ...e])}
                        className="w-100 basic-multi-select"
                        classNamePrefix="Search"
                        formatOptionLabel={formatOptionLabel}
                        components={{
                            IndicatorSeparator: () => null,
                            DropdownIndicator: () => null,
                        }}
                        placeholder="Type a name"
                    />
                </div>
                {searchUserText && (
                    <div className="searchListFlow">
                        <div className="search_dataList search_dataList-custom">
                            <div className="overflow_searchList followListsInner">
                                {userList.filter((i) => {
                                    return i.userId?.user_name?.toLowerCase().includes(searchUserText.toLowerCase());
                                }).length > 0 ? (
                                    userList
                                        .filter((i) => {
                                            return i.userId?.user_name?.toLowerCase().includes(searchUserText.toLowerCase());
                                        })
                                        .map((item) => {
                                            return (
                                                <div className="search_userCompose">
                                                    <div
                                                        onClick={() => handleCompUserList(item.userId, "add")}
                                                    >
                                                        <div className="followOtherUser">
                                                            <div className="followOtherUserPic">
                                                                <ProfileImage url={item.userId.profile_img} />
                                                            </div>
                                                            <div className="followOtherUserName">
                                                                <h5 className="mb-0">{item.userId?.user_name}</h5>
                                                                <p className="mb-0">{item.userId?.title}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                ) : (
                                    <p class="px-3 noData_found">Sorry, no user found with this name</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="chatInputBox chatInputBoxCustom">
                <div className="chatInput">
                    <div className="input-group" id="emojiPickerMessage-id-Custom">
                        <textarea
                            rows={msg.content.length > 70 ? 2 : 1}
                            type="text"
                            style={{ height: "unset" }}
                            className="form-control allFeedUser resizeNone"
                            onChange={(e) => setMsg({ ...msg, content: e.target.value })}
                            value={msg.content}
                            onKeyDown={handleKeypress}
                            placeholder="Write your message..."
                        />
                        <input
                            style={{ display: "none" }}
                            type="file"
                            name="images"
                            id="images"
                            accept="image/*,video/mp4,video/x-m4v,video/*"
                            multiple={true}
                            onChange={(event) => {
                                setMsg({ ...msg, file: [...msg.file, ...event.currentTarget.files] });
                                event.target.value = null;
                            }}
                        />

                        <span
                            className="input-group-text bg-white emoji emoji-picker-customMobile"
                            id="emojiPicker-btn-id-Custom"
                        >
                            <a href="javascript:void(0);" onClick={() => setShowEmoji(!showEmoji)}>
                                <img src="/images/icons/bw-emoji.svg" alt className="img-fluid " />
                            </a>
                        </span>
                        <span className="input-group-text bg-white file-upload file-upload-customMobile">
                            <a href="javascript:void(0);">
                                <label htmlFor="images">
                                    <img src="/images/icons/file-upload.svg" alt="file-upload" className="img-fluid" />
                                </label>
                            </a>
                        </span>
                    </div>
                </div>
                <div className="sendBtn">
                    <button type="button" onClick={sendNewMessage} className="btn" disabled={loadingState}>
                        {loadingState ? (
                            <i className="fa-solid fa-spinner"></i>
                        ) : (
                            <img src="/images/icons/send.svg" alt="send" className="img-fluid" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NewChat