import React, { useState, useEffect, useRef, useContext } from 'react';
import '../assets/previewprofile.css';
import GlobalContext from '../context/GlobalContext';
import { Link } from 'react-router-dom';
import Unfollow from '../popups/unfollow/Unfollow';
import UserFollowerService from '../services/userFollowerService';
import UserService from '../services/UserService';

const ProfilePreview = ({ ...props }) => {
    const { userId, profile_img, section } = props;

    const userServ = new UserService();
    const globalCtx = useContext(GlobalContext);
    const hideTimeoutRef = useRef(null);
    let hoverTimeout;
    const [open, setOpen] = useState();
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState(0);
    const [mediaFiles, setMediaFiles] = useState([]);
    const [loginUser, setUser] = globalCtx.user;
    const [followingStatus, setFollowingStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const getUserDataPreview = async () => {
        const result = await userServ.getUserDataPreview({ userId: userId });
        if (result.user) {
            setUserData(result.user);
            setPosts(result.postsCount);
            setMediaFiles(result.postsMediaFiles);
            setFollowingStatus(result.followingStatus);
            setTimeout(() => {
                setIsLoading(false);
            }, 1500);
        } else {
            setIsLoading(false);
        }
    }

    const handleLeave = (e) => {
        e.preventDefault();
        if (open) {
            setOpen(false);
            clearTimeout(hoverTimeout);
        }
    }

    const handleHover = async (e) => {
        e.preventDefault();
        if (loginUser._id !== userId) {
            setIsLoading(true);
            setOpen(true);
            getUserDataPreview();
        }
    }

    const handleSectionLeave = (e) => {
        e.preventDefault();
        if (open) {
            hideTimeoutRef.current = setTimeout(() => {
                setOpen(false);
            }, 1800);
        }
    }

    const handleSectionOver = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }
    }

    const followUser = () => {

    }

    const Loading = () => {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ height: "100%" }}>
                <i className="fa fa-2x fa-circle-o-notch fa-spin vs-color"></i>
            </div>
        );
    }

    const handleClose = () => {

    }

    return (
        <div style={{ position: "relative" }}>
            <div>
                <img
                    alt=""
                    src={
                        profile_img ??
                        "./images/icons/profile.svg"
                    }
                    className="prf-pic rounded-circle border border-white border-3"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={handleHover}
                />
            </div>
            {
                open && (
                    <>
                        <div className={"hover-profile-container shadow p-2 " + section} onMouseOver={handleSectionOver} onMouseLeave={handleSectionLeave}>
                            {isLoading ? (
                                <Loading />
                            ) : (
                                <div>
                                    <span className='fa fa-times text-dark float-end' style={{ background: "#525356", width: "20px", height: "20px", padding: "5px" }} onClick={handleClose}></span>
                                    <div className='user-section'>
                                        <div className="d-flex align-items-start">
                                            <img
                                                src={userData?.profile_img ?? "./images/icons/profile.svg"}
                                                className="card-img-top hoverProfile"
                                                alt="Profile"
                                                style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "8px" }}
                                            />
                                            <div className=''>
                                                <div>{userData?.user_name}</div>
                                                <div>{userData?.first_name + " " + userData?.last_name}</div>
                                            </div>
                                        </div>
                                        <div className='my-3'>
                                            <div className="d-flex justify-content-around">
                                                <div className='text-center ms-2'>
                                                    <span className='count'>{posts}</span>
                                                    <br />
                                                    <span className='sb-title'>posts</span>
                                                </div>
                                                <div className='text-center ms-4'>
                                                    <span className='count'>{userData?.followers}</span>
                                                    <br />
                                                    <span className='sb-title'>followers</span>
                                                </div>
                                                <div className='text-center'>
                                                    <span className='count'>{userData?.following}</span>
                                                    <br />
                                                    <span className='sb-title'>following</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-around">
                                            {
                                                mediaFiles && mediaFiles?.map((data, index) => {
                                                    return <div key={index} className="square" style={{ width: "80px", height: "80px" }}>
                                                        <img src={data} alt="" style={{ width: "80px", height: "80px" }} />
                                                    </div>
                                                })
                                            }
                                        </div>
                                        <div className='mt-2'>
                                            {
                                                followingStatus && (
                                                    (followingStatus === "" || followingStatus === "notfollowing") ? (
                                                        <Link onClick={followUser} className="btn btnColor w-100">
                                                            Follow
                                                        </Link>
                                                    ) : followingStatus === "requested" ? (
                                                        <Link className="btn btnColor bg-dark w-100">
                                                            Requested
                                                        </Link>
                                                    ) : (
                                                        <Link className="btn btnColor w-100">
                                                            Following
                                                        </Link>
                                                    )
                                                )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )
            }
        </div >

    )
}

export default ProfilePreview