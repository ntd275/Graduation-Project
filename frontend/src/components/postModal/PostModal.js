import React, { useRef, useState, useEffect } from "react";
import "./PostModal.scss";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { IconClose2, IconImage, IconVideo } from "../Icon/Icons";
import { Avatar } from "@mui/material";
import Images from "../../Images/Images";
import TextField from "@mui/material/TextField";
import PreviewGrid from "../previewGrid/PreviewGrid";
import Api, { baseUrl } from "../../api/Api";
import { useSnackbar } from 'notistack';
import Loading from "../loading/Loading";
import { useSelector, useDispatch } from 'react-redux'
import PostShare from "../post/PostShare";

function PostModal({ open, onClose, mode, onCreated, onEdited, onShared, post, postShare }) {
    const [files, setFiles] = useState([]);
    const inputImage = useRef(null);
    const inputVideo = useRef(null);
    const [content, setContent] = useState("")
    const [isLoading, setIsLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        if (mode === "edit") {
            try {
                setFiles(JSON.parse(post.files));
                setContent(post.content);
            } catch (err) {
                console.log(err);
            }
        }
    }, [])

    const closeDialog = (_e, reason) => {
        if (reason === "backdropClick") {
            return;
        }
        onClose();
    };

    const attachImage = () => {
        inputImage.current.click();
    };

    const addImage = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFiles([...files, {type: "image", content: event.target.files[0]}]);
        }
    };

    const attachVideo = () => {
        inputVideo.current.click();
    };

    const addVideo = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFiles([...files, {type: "video", content: event.target.files[0]}]);
        }
    };

    const savePost = async() => {
        setIsLoading(true);
        try {
            const attackList = await Promise.all(files.map(async (file) => {
                if (typeof file.content !== "string") {
                    let res;
                    if (file.type === "video") {
                        res = await Api.uploadVideo(file.content)
                    } else {
                        res = await Api.uploadImage(file.content)
                    }
                    file.content = res.data.result;
                    return file;
                }
                return file;
            }))
            if (mode === "create") {
                await Api.createPost({content: content, files: JSON.stringify(attackList)})
                enqueueSnackbar("Đăng bài thành công", {variant: "success"})
                setIsLoading(false);
                onCreated();
                onClose();
                return;
            }
            if (mode === "edit") {
                await Api.editPost(post.postId,{content: content, files: JSON.stringify(attackList)})
                enqueueSnackbar("Sửa bài thành công", {variant: "success"})
                setIsLoading(false);
                onEdited();
                onClose();
                return;
            }

            if (mode === "share") {
                await Api.createPost({content: content, isShare: true, sharePostId: postShare.postId, files: "[]"})
                enqueueSnackbar("Chia sẻ bài thành công", {variant: "success"})
                setIsLoading(false);
                onShared();
                onClose();
                return;
            }

        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    }

    const getTitle = () => {
        if (mode === "create") {
            return "Tạo bài viết";
        }
        if (mode === "edit") {
            return "Sửa bài viết"
        }
        if (mode === "share") {
            return "Chia sẻ bài viết"
        }
        return "Tạo bài viết"
    }

    const getButtonTitle = () => {
        if (mode === "create") {
            return "Đăng";
        }
        if (mode === "edit") {
            return "Lưu"
        }
        if (mode === "share") {
            return "Đăng"
        }
        return "Đăng"
    }

    return (
        <Dialog open={open} onClose={closeDialog}>
            <DialogTitle>
                <div className="post-modal-title">
                    <div className="title-text">{getTitle()}</div>
                    <div className="btn-close" onClick={() => onClose()}>
                        <IconClose2 />
                    </div>
                </div>
            </DialogTitle>
            <Loading open={isLoading} />
            <div className="post-modal">
                <div style={{ maxHeight: 400, overflow: "auto" }}>
                    <div className="info">
                        <Avatar src={auth.avatar ? `${baseUrl}/${auth.avatar}` : Images.defaultAvatar} />
                        <div className="username">{auth.name}</div>
                    </div>
                    <div className="input-container">
                        <TextField
                            multiline
                            fullWidth
                            className="input-content"
                            placeholder="Bạn đang nghĩ gì?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    {files.length !== 0 && (
                        <div className="attach-container">
                            <PreviewGrid
                                files={files}
                                setFiles={setFiles}
                            />
                        </div>
                    )}
                    {(mode === "share" || (mode === "edit" && !!post.isShare)) && <PostShare {...postShare} />}
                </div>
                {( (mode === "edit" && !post.isShare)  || mode === "create") && <div className="attach">
                    <div className="title">Thêm vào bài viết</div>
                    <div className="img" onClick={() => attachImage()}>
                        <IconImage />
                    </div>
                    <div className="video" onClick={() => attachVideo()}>
                        <IconVideo />
                    </div>
                    <input
                        type={"file"}
                        style={{ display: "none" }}
                        ref={inputImage}
                        value={""}
                        onChange={addImage}
                        accept="image/png, image/jpeg, image/jpg"
                    />
                    <input
                        type={"file"}
                        style={{ display: "none" }}
                        ref={inputVideo}
                        value={""}
                        onChange={addVideo}
                        accept="video/mp4,video/*"
                    />
                </div>}
                <div className="btn-save" onClick={() => savePost()}>{getButtonTitle()}</div>
            </div>
        </Dialog>
    );
}

export default PostModal;
