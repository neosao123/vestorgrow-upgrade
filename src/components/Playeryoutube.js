import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';

const Playeryoutube = ({ url, height, corners }) => {
    const opts = {
        height: height ?? '350px',
        width: '100%',
        borderTopLeftRadius: (corners === true) ? '10px' : '0px',
        borderTopRightRadius: (corners === true) ? '10px' : '0px',
        playerVars: {
            autoplay: -1,
        },
    };

    const _onReady = (event) => {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    }
    const [videoId, setVideoId] = useState();
    useEffect(() => {
        if (url) {
            try {
                var video_id = url.split("v=")[1].split("&")[0];
                setVideoId(video_id)
            } catch (err) {
                setVideoId("")
            }
        }
    }, [url])


    return (
        <YouTube videoId={videoId} opts={opts} onReady={_onReady} />
    );
}

export default Playeryoutube;