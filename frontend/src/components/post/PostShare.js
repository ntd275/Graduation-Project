import { Avatar } from "@mui/material";
import React, { useState, useEffect } from "react";
import { baseUrl } from "../../api/Api";
import Images from "../../Images/Images";
import { getTimeStr } from "../../utils/TimeUtils";
import PreviewGrid from "../previewGrid/PreviewGrid";
import "./Post.scss";


function PostShare(props) {
    const [files, setFiles] = useState([]);
    useEffect(() => {
        try {
            if (props.files) {
                setFiles(JSON.parse(props.files));
            }
        } catch (err) {
            console.log(props.files)
            console.log(err);
        }
    }, [props.files]);

    const getAttack = () => {
        if (!files.length) {
            return <></>;
        }
        return <PreviewGrid files={files} isView />;
    };

    return (
        <div className ={`post-container ${!props.isView ? "zoom-out-07": "zoom-out-09"}`}>
            <div className="post-header">
                <Avatar src={props.avatar ? `${baseUrl}/${props.avatar}` :Images.defaultAvatar} />
                <div className="post-info">
                    <div className="user-name">{props.name}</div>
                    <div className="time">
                        {getTimeStr(new Date(props.createdTime))}
                    </div>
                </div>
            </div>
            <div className="post-content">{props.content}</div>
            {getAttack()}
        </div>
    );
}

export default PostShare;
