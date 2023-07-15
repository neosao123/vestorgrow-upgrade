import React, { useContext, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './fbreactionstyles.css';
import PostService from "../services/postService";
import GlobalContext from '../context/GlobalContext';

const FBReactions = ({ ...props }) => {

    const { postId, postReaction, updatePostAfterReaction } = props;

    const likeImage = "/images/icons/thumbs-up.svg";
    const loveImage = "/images/icons/heart.svg";
    const insightImage = "/images/icons/insightfull.svg";
    const noreactionImage = "/images/icons/no-reaction.svg";

    const postServ = new PostService();
    const hideTimeoutRef = useRef(null);
    const globalCtx = useContext(GlobalContext);
    const [user, setUser] = globalCtx.user;
    const [btnClicked, setBtnCLicked] = useState(false);
    const [activeReaction, setActiveReaction] = useState("Love");
    const [reactionImage, setReactionImage] = useState(loveImage);

    const list = {
        visible: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
        },
        hidden: {
            display: "none",
            top: "60px",
        }
    };

    const postUniqueReactions = async () => {
        const reactions = await postServ.getPostUniqueReactions({ "postId": postId });
        if (reactions.data) {
            return reactions.data;
        } else {
            return [];
        }
    }

    const addReaction = async (reaction) => {
        try {
            if (reaction === "like" || reaction === "love" || reaction === "insight") {
                let resp = await postServ.likePost({ postId: postId, type: reaction });
                if (resp.data) {
                    if (reaction === "like") {
                        setReactionImage(likeImage);
                        setActiveReaction("Liked");
                    } else if (reaction === "love") {
                        setReactionImage(loveImage);
                        setActiveReaction("Loved");
                    } else {
                        setReactionImage(insightImage);
                        setActiveReaction("Insightful");
                    }

                    const reactionOfPost = await postUniqueReactions();

                    setTimeout(() => {
                        const data = resp.data;
                        updatePostAfterReaction("inc", postId, data, reactionOfPost);
                    }, 800);
                    setBtnCLicked(false);
                }
            }
        } catch (err) {
            console.log(err);
            setBtnCLicked(false);
        }
    }

    const removeReaction = async (postId) => {
        try {
            let resp = await postServ.dislikePost(postId);
            if (resp.message) {

                const reactionOfPost = await postUniqueReactions();

                setTimeout(() => {
                    updatePostAfterReaction("dec", postId, {}, reactionOfPost);
                    setReactionImage(noreactionImage);
                    setActiveReaction("Like");
                }, 800);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleReactionClick = (action) => {
        addReaction(action);
    }

    const handleLikeButton = (e) => {
        e.preventDefault();
        if (postReaction !== null) {
            removeReaction(postId);
        } else {
            //just open the popup
            setBtnCLicked(true);
        }
    }

    const handleMouseLeave = (e) => {
        e.preventDefault();
        if (btnClicked === true) {
            hideTimeoutRef.current = setTimeout(() => {
                setBtnCLicked(false);
            }, 3000);
        }
    }

    const handleMouseOver = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }
    };

    useEffect(() => {
        if (postReaction !== null) {
            const reactionType = postReaction?.type;
            switch (reactionType) {
                case "like":
                    setReactionImage(likeImage);
                    setActiveReaction("Liked");
                    break;
                case "love":
                    setReactionImage(loveImage);
                    setActiveReaction("Loved");
                    break;
                case "insight":
                    setReactionImage(insightImage);
                    setActiveReaction("Insightful");
                    break;
                default:
                    setReactionImage(noreactionImage);
                    setActiveReaction("Like");
                    break;
            }
        } else {
            setReactionImage(noreactionImage);
            setActiveReaction("Like")
        }
    }, [postReaction]);

    return (
        <motion.div className='parent-div' onClick={() => btnClicked === true && setBtnCLicked(false)}>
            <motion.div onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} whileInView={{ top: "-60px" }} className='reactions-holder' variants={list} animate={btnClicked ? "visible" : "hidden"}>
                <motion.span whileHover={{ scale: 1.3 }}><motion.img src={likeImage} alt="liked-image" onClick={() => handleReactionClick('like')} /></motion.span>
                <motion.span whileHover={{ scale: 1.3 }}><motion.img src={loveImage} alt="loved-image" onClick={() => handleReactionClick('love')} /></motion.span>
                <motion.span whileHover={{ scale: 1.3 }}><motion.img src={insightImage} alt="insight-image" onClick={() => handleReactionClick('insight')} /></motion.span>
            </motion.div>
            <button className='like-btn' onClick={(e) => handleLikeButton(e)}>
                <img src={reactionImage} alt={activeReaction + "-img"} width="24px" />
                <span>{activeReaction.charAt(0).toUpperCase() + activeReaction.slice(1)}</span>
            </button>
        </motion.div>
    )
}

export default FBReactions;