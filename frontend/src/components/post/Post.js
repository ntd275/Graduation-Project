import { Avatar } from "@mui/material";
import React, { useState, useEffect, useRef, useContext } from "react";
import Images from "../../Images/Images";
import { getTimeStr } from "../../utils/TimeUtils";
import {
    IconComment,
    IconLike,
    IconLike2,
    IconLikeActive,
    IconShare,
    IconThreeDot,
} from "../Icon/Icons";
import PreviewGrid from "../previewGrid/PreviewGrid";
import "./Post.scss";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector, useDispatch } from "react-redux";
import StyledMenu from "../styledMenu/StyledMenu";
import PostModal from "../postModal/PostModal";
import DeleteAlert from "../deleteAlert/DeleteAlert";
import Api, { baseUrl } from "../../api/Api";
import Loading from "../loading/Loading";
import { useSnackbar } from "notistack";
import PostShare from "./PostShare";
import { updatePostState } from "../../reduxs/slices/postSlice";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../App";

function Post(props) {
    const [likes, setLikes] = useState([]);
    const [files, setFiles] = useState([]);
    const [comments, setComments] = useState([]);
    const [shares, setShares] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const threeDotRef = useRef();
    const auth = useSelector((state) => state.auth);
    const [isOpenEdit, setIsOpenEdit] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const createCommentRef = useRef();
    const [isOpenShare, setIsOpenShare] = useState(false);
    const [postShare, setPostShare] = useState({});
    const [commentValue, setCommentValue] = useState("");
    const [commentArchor, setCommentArchor] = useState();
    const [isCommentMenuOpen, setIsCommentMenuOpen] = useState(false);
    const [currentCommentId, setCurrentCommentId] = useState();
    const [isOpenCommentDeleteAlert, setIsOpenCommentDeleteAlert] =
        useState(false);
    const [editCommentValue, setEditCommentValue] = useState("");
    const dispatch = useDispatch();
    const postRedux = useSelector((state) => state.post);
    const navigate = useNavigate();
    const socket = useContext(ChatContext);
    const bottomCommentRef = useRef();

    useEffect(() => {
        try {
            setFiles(JSON.parse(props.files));
        } catch (err) {
            console.log(props.files);
            console.log(err);
        }
    }, [props.files]);

    useEffect(() => {
        if (props.isShare) {
            getPostShare();
        }
    }, []);

    const getPostShare = async () => {
        try {
            const res = await Api.getPostById(props.sharePostId);
            setPostShare(res.data.result);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getLikes();
    }, []);

    const getLikes = async () => {
        try {
            const res = await Api.getLikes(props.postId);
            setLikes(res.data.result);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getComments();
    }, []);

    const getComments = async () => {
        try {
            const res = await Api.getCommentByPostId(props.postId);
            setComments(res.data.result);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getShares();
    }, []);

    const getShares = async () => {
        try {
            const res = await Api.getShareByPostId(props.postId);
            setShares(res.data.result);
        } catch (err) {
            console.log(err);
        }
    };

    const getAttack = () => {
        if (!files || !files.length) {
            return <></>;
        }
        return (
            <PreviewGrid
                files={files}
                isView
                onClick={() =>
                    dispatch(
                        updatePostState({
                            isOpenPostDetail: true,
                            postDetailId: props.postId,
                        })
                    )
                }
            />
        );
    };

    const getShareContent = () => {
        if (props.isShare) {
            return <PostShare isView={true} {...postShare} />;
        }
        return <></>;
    };

    const isLike =
        likes.findIndex((like) => like.accountId === auth.accountId) !== -1;

    const like = async () => {
        try {
            if (isLike) {
                await Api.unLike(props.postId);
            } else {
                await Api.like(props.postId);
            }
            getLikes();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const temp = postRedux.needRefreshPost.find(
            (e) => e.postId === props.postId
        );
        if (temp) {
            switch (temp.type) {
                case "like":
                    getLikes();
                    break;
                case "comment":
                    getComments();
                    break;
                case "share":
                    getShares();
                    break;
                default:
                    break;
            }
            dispatch(
                updatePostState({
                    needRefreshPost: [
                        ...postRedux.needRefreshPost.filter(
                            (e) =>
                                e.postId !== temp.postId || e.type !== temp.type
                        ),
                    ],
                })
            );
        }
    }, [postRedux.needRefreshPost]);

    const openComment = () => {
        createCommentRef.current.focus();
    };

    const openShare = () => {
        setIsOpenShare(true);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const openMenu = () => {
        setIsMenuOpen(true);
    };

    const editPost = () => {
        setIsOpenEdit(true);
    };

    const openDeleteAlert = () => {
        closeMenu();
        setIsDeleteAlertOpen(true);
    };

    const deletePost = async () => {
        setIsLoading(true);
        setIsDeleteAlertOpen(false);
        try {
            await Api.deletePost(props.postId);
            await props.refreshPost();
            enqueueSnackbar("Xóa bài thành công", { variant: "success" });
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    };

    const createComment = async (e) => {
        if (e.key === "Enter" && commentValue) {
            const temp = commentValue;
            setCommentValue("");
            try {
                await Api.createComment(props.postId, temp);
                socket.emit("comment", {
                    accountId: props.author,
                    postId: props.postId,
                })
                await getComments();
            } catch (err) {
                console.log(err);
            }
        }
    };

    const openCommentMenu = (e, commentId) => {
        setCommentArchor(e.target);
        setCurrentCommentId(commentId);
        setIsCommentMenuOpen(true);
    };

    const closeCommentMenu = () => {
        setIsCommentMenuOpen(false);
    };

    const openDeleteCommentAlert = () => {
        closeCommentMenu();
        setIsOpenCommentDeleteAlert(true);
    };

    const deleteComment = async () => {
        setIsLoading(true);
        setIsOpenCommentDeleteAlert(false);
        try {
            await Api.deleteComment(currentCommentId);
            await getComments();
            enqueueSnackbar("Xóa bình luận thành công", { variant: "success" });
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    };

    const openEditComment = () => {
        const temp = comments.map((e) => {
            if (e.commentId === currentCommentId) {
                setEditCommentValue(e.comment);
                return { ...e, editing: true };
            } else {
                return e;
            }
        });
        setComments(temp);
    };

    const editComment = async (e) => {
        if (e.key === "Enter" && editCommentValue) {
            try {
                await Api.editComment(currentCommentId, editCommentValue);
                getComments();
            } catch (err) {
                console.log(err);
            }
        }
        if (e.key === "Escape") {
            getComments();
        }
    };

    const renderComments = () => {
        return comments.map((comment) => (
            <div className="comment" key={comment.commentId}>
                <Avatar
                    sx={{ width: 32, height: 32 }}
                    src={comment.avatar ? `${baseUrl}/${comment.avatar}` :Images.defaultAvatar}
                    onClick={() => navigate(`/profile/${comment.accountId}`)}
                ></Avatar>
                {comment.editing ? (
                    <div className="edit-comment">
                        <input
                            className="comment-input"
                            placeholder="Viết bình luận..."
                            value={editCommentValue}
                            onChange={(e) =>
                                setEditCommentValue(e.target.value.trimStart())
                            }
                            onKeyDown={editComment}
                            autoFocus={true}
                        ></input>
                    </div>
                ) : (
                    <>
                        <div className="comment-content">
                            <div className="user-name">{comment.name}</div>
                            <div className="comment-message">
                                {comment.comment}
                            </div>
                        </div>
                        {comment.accountId === auth.accountId && (
                            <div
                                className="options"
                                onClick={(e) =>
                                    openCommentMenu(e, comment.commentId)
                                }
                            >
                                <IconThreeDot />
                            </div>
                        )}
                    </>
                )}
            </div>
        ));
    };

    useEffect(() => {
        bottomCommentRef.current.scrollTop= bottomCommentRef.current?.scrollHeight;
    }, [comments])

    return (
        <div className="post-container">
            <div className="post-header">
                <Avatar src={props.avatar ? `${baseUrl}/${props.avatar}` : Images.defaultAvatar} onClick={() => navigate(`/profile/${props.author}`)}/>
                <div className="post-info">
                    <div className="user-name" onClick={() => navigate(`/profile/${props.author}`)}>
                        {props.name}{" "}
                        {!!props.isShare ? (
                            <span style={{ fontWeight: "normal" }}>
                                đã chia sẻ một bài đăng
                            </span>
                        ) : (
                            ""
                        )}
                    </div>
                    <div className="time">
                        {getTimeStr(new Date(props.createdTime))}
                    </div>
                </div>
                {props.author === auth.accountId && (
                    <div
                        className="options"
                        ref={threeDotRef}
                        onClick={() => openMenu()}
                    >
                        <IconThreeDot />
                    </div>
                )}
                <StyledMenu
                    id="post-menu"
                    anchorEl={threeDotRef.current}
                    open={isMenuOpen}
                    onClose={closeMenu}
                    disableScrollLock={true}
                >
                    <MenuItem key="placeholder" style={{ display: "none" }} />
                    <MenuItem
                        onClick={() => {
                            closeMenu();
                            editPost();
                        }}
                    >
                        <EditIcon />
                        Sửa bài đăng
                    </MenuItem>
                    <MenuItem onClick={() => openDeleteAlert()}>
                        <DeleteIcon />
                        Xóa bài đăng
                    </MenuItem>
                </StyledMenu>
            </div>
            <div className="post-content">{props.content}</div>
            {getAttack()}
            {getShareContent()}
            <div className="post-reactions">
                <IconLike />
                <div className="number-like">{likes.length}</div>
                <div className="number-comment">
                    {comments.length} bình luận
                </div>
                {!props.isShare && (
                    <div className="number-share">
                        {shares.length} lượt chia sẻ
                    </div>
                )}
            </div>
            <div className="post-actions">
                <div className="like button" onClick={() => like()}>
                    {isLike ? <IconLikeActive /> : <IconLike2 />}
                    <div style={isLike ? { color: "#2078f4" } : {}}>Thích</div>
                </div>
                <div className="comment button" onClick={() => openComment()}>
                    <IconComment />
                    <div>Bình luận</div>
                </div>
                <div
                    className="share button"
                    style={{ display: props.isShare ? "none" : undefined }}
                    onClick={() => openShare()}
                >
                    <IconShare />
                    <div>Chia sẻ</div>
                </div>
            </div>
            <div className="comment-container">
                <div className="h-ruler"></div>
                <div ref={bottomCommentRef}  style={{overflow: "auto", maxHeight: 300}}>
                    {renderComments()}
                    <div style={{height: 1, opacity: 0}}></div>
                </div>
                <StyledMenu
                    anchorEl={commentArchor}
                    open={isCommentMenuOpen}
                    onClose={closeCommentMenu}
                    disableScrollLock={true}
                >
                    <MenuItem key="placeholder" style={{ display: "none" }} />
                    <MenuItem
                        onClick={() => {
                            closeCommentMenu();
                            openEditComment();
                        }}
                    >
                        <EditIcon />
                        Sửa bình luận
                    </MenuItem>
                    <MenuItem onClick={() => openDeleteCommentAlert()}>
                        <DeleteIcon />
                        Xóa bình luận
                    </MenuItem>
                </StyledMenu>
                <div className="add-comment">
                    <Avatar
                        sx={{ width: 32, height: 32 }}
                        src={auth.avatar ? `${baseUrl}/${auth.avatar}` : Images.defaultAvatar}
                    ></Avatar>
                    <input
                        ref={createCommentRef}
                        className="comment-input"
                        placeholder="Viết bình luận..."
                        value={commentValue}
                        onChange={(e) =>
                            setCommentValue(e.target.value.trimStart())
                        }
                        onKeyDown={createComment}
                    ></input>
                </div>
            </div>
            <Loading open={isLoading} />
            <PostModal
                open={isOpenEdit}
                mode="edit"
                post={props}
                postShare={postShare}
                onClose={() => setIsOpenEdit(false)}
                onEdited={() => {
                    props.refreshPost();
                }}
            />
            <PostModal
                open={isOpenShare}
                mode="share"
                postShare={props}
                onClose={() => setIsOpenShare(false)}
                onShared={() => {
                    props.refreshPost();
                }}
            />
            <DeleteAlert
                title="Xác nhận xóa bài đăng?"
                open={isDeleteAlertOpen}
                onClose={() => setIsDeleteAlertOpen(false)}
                onConfirm={() => deletePost()}
            />
            <DeleteAlert
                title="Xác nhận xóa bình luận?"
                open={isOpenCommentDeleteAlert}
                onClose={() => setIsOpenCommentDeleteAlert(false)}
                onConfirm={() => deleteComment()}
            />
        </div>
    );
}

export default Post;
