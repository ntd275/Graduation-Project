import { Avatar, MenuItem } from "@mui/material";
import React, { useState, useEffect, useRef, useContext } from "react";
import Api, { baseUrl } from "../../api/Api";
import Images from "../../Images/Images";
import {
    IconClose3,
    IconComment,
    IconLike,
    IconLike2,
    IconLikeActive,
    IconNext,
    IconPrev,
    IconShare,
    IconThreeDot,
} from "../Icon/Icons";
import "./PostDetail.scss";
import { useSelector, useDispatch } from "react-redux";
import { updatePostState } from "../../reduxs/slices/postSlice";
import { getTimeStr } from "../../utils/TimeUtils";
import { useSnackbar } from "notistack";
import StyledMenu from "../styledMenu/StyledMenu";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteAlert from "../deleteAlert/DeleteAlert";
import PostModal from "../postModal/PostModal";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../../App";

function PostDetail({ postId, refreshPost }) {
    const [post, setPost] = useState({});
    const [likes, setLikes] = useState([]);
    const [files, setFiles] = useState([]);
    const [comments, setComments] = useState([]);
    const [shares, setShares] = useState([]);
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const postRedux = useSelector((state) => state.post);
    const createCommentRef = useRef();
    const [commentValue, setCommentValue] = useState("");
    const [commentArchor, setCommentArchor] = useState();
    const [isCommentMenuOpen, setIsCommentMenuOpen] = useState(false);
    const [currentCommentId, setCurrentCommentId] = useState();
    const [isOpenCommentDeleteAlert, setIsOpenCommentDeleteAlert] =
        useState(false);
    const [editCommentValue, setEditCommentValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [isOpenShare, setIsOpenShare] = useState(false);
    const [currentFileIndex, setCurrentFileIndex] = useState(0);
    const navigate = useNavigate();
    const socket = useContext(ChatContext);

    useEffect(() => {
        getPost();
    }, []);

    const getPost = async () => {
        try {
            const res = await Api.getPostById(postId);
            setPost(res.data.result);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        try {
            setFiles(JSON.parse(post.files));
        } catch (err) {
            console.log(err);
        }
    }, [post.files]);

    useEffect(() => {
        getLikes();
    }, []);

    const getLikes = async () => {
        try {
            const res = await Api.getLikes(postId);
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
            const res = await Api.getCommentByPostId(postId);
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
            const res = await Api.getShareByPostId(postId);
            setShares(res.data.result);
        } catch (err) {
            console.log(err);
        }
    };

    const isLike =
        likes.findIndex((like) => like.accountId === auth.accountId) !== -1;

    const like = async () => {
        try {
            if (isLike) {
                await Api.unLike(postId);
            } else {
                await Api.like(postId);
            }
            dispatch(
                updatePostState({
                    needRefreshPost: [
                        ...postRedux.needRefreshPost,
                        { postId: postId, type: "like" },
                    ],
                })
            );
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const temp = postRedux.needRefreshPost.find((e) => e.postId === postId);
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

    const openComment = () => {
        createCommentRef.current.focus();
    };

    const createComment = async (e) => {
        if (e.key === "Enter" && commentValue) {
            const temp = commentValue;
            setCommentValue("");
            try {
                await Api.createComment(postId, temp);
                dispatch(
                    updatePostState({
                        needRefreshPost: [
                            ...postRedux.needRefreshPost,
                            { postId: postId, type: "comment" },
                        ],
                    })
                );
                socket.emit("comment", {
                    accountId: post.author,
                    postId: postId,
                })
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
            dispatch(
                updatePostState({
                    needRefreshPost: [
                        ...postRedux.needRefreshPost,
                        { postId: postId, type: "comment" },
                    ],
                })
            );
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
                dispatch(
                    updatePostState({
                        needRefreshPost: [
                            ...postRedux.needRefreshPost,
                            { postId: postId, type: "comment" },
                        ],
                    })
                );
            } catch (err) {
                console.log(err);
            }
        }
        if (e.key === "Escape") {
            getComments();
        }
    };

    const openShare = () => {
        setIsOpenShare(true);
    };

    const getViewContent = () => {
        const url = baseUrl + "/" + files[currentFileIndex]?.content;
        const type = files[currentFileIndex]?.type;
        if (type === "image") {
            return <img src={url} alt="" />;
        }
        if (type === "video") {
            return (
                <video className="video" controls>
                    <source src={url} />
                </video>
            );
        }
    };

    return (
        <div className="post-detail-container">
            <div className="image-container">
                {getViewContent()}
                <div
                    className="btn-close"
                    onClick={() =>
                        dispatch(updatePostState({ isOpenPostDetail: false }))
                    }
                >
                    <IconClose3 />
                </div>
                <div className="logo">
                    <img src={Images.logo} alt="logo" className="logo-img" />
                </div>
                {currentFileIndex !== 0 && (
                    <div
                        className="btn-prev"
                        onClick={() =>
                            setCurrentFileIndex(currentFileIndex - 1)
                        }
                    >
                        <IconPrev />
                    </div>
                )}
                {currentFileIndex < files.length - 1 && (
                    <div
                        className="btn-next"
                        onClick={() =>
                            setCurrentFileIndex(currentFileIndex + 1)
                        }
                    >
                        <IconNext />
                    </div>
                )}
            </div>
            <div className="post-detail-right">
                <div className="header-container">
                    <div
                        className="avatar"
                        onClick={() => {
                            navigate(`/profile/${post.author}`);
                            dispatch(
                                updatePostState({ isOpenPostDetail: false })
                            );
                        }}
                    >
                        <Avatar src={post.avatar ? `${baseUrl}/${post.avatar}`: Images.defaultAvatar} />
                    </div>
                    <div className="info">
                        <div
                            className="username"
                            onClick={() => {
                                navigate(`/profile/${post.author}`);
                                dispatch(
                                    updatePostState({ isOpenPostDetail: false })
                                );
                            }}
                        >
                            {post.name}
                        </div>
                        <div className="time">
                            {getTimeStr(new Date(post.createdTime))}
                        </div>
                    </div>
                </div>
                <div className="post-content">{post.content}</div>
                <div className="post-reactions">
                    <IconLike />
                    <div className="number-like">{likes.length}</div>
                    <div className="number-comment">
                        {comments.length} bình luận
                    </div>
                    <div className="number-share">
                        {shares.length} lượt chia sẻ
                    </div>
                </div>
                <div className="post-actions">
                    <div className="like button" onClick={() => like()}>
                        {isLike ? <IconLikeActive /> : <IconLike2 />}
                        <div style={isLike ? { color: "#2078f4" } : {}}>
                            Thích
                        </div>
                    </div>
                    <div
                        className="comment button"
                        onClick={() => openComment()}
                    >
                        <IconComment />
                        <div>Bình luận</div>
                    </div>
                    <div className="share button" onClick={() => openShare()}>
                        <IconShare />
                        <div>Chia sẻ</div>
                    </div>
                </div>
                <div className="comment-container">
                    <div className="h-ruler"></div>
                    <div style={{ overflow: "auto", maxHeight: "500px" }}>
                        {renderComments()}
                    </div>
                    <StyledMenu
                        anchorEl={commentArchor}
                        open={isCommentMenuOpen}
                        onClose={closeCommentMenu}
                        disableScrollLock={true}
                    >
                        <MenuItem
                            key="placeholder"
                            style={{ display: "none" }}
                        />
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
                    <DeleteAlert
                        title="Xác nhận xóa bình luận?"
                        open={isOpenCommentDeleteAlert}
                        onClose={() => setIsOpenCommentDeleteAlert(false)}
                        onConfirm={() => deleteComment()}
                    />
                </div>
                <PostModal
                    open={isOpenShare}
                    mode="share"
                    postShare={post}
                    onClose={() => setIsOpenShare(false)}
                    onShared={() => {
                        refreshPost();
                        dispatch(
                            updatePostState({
                                needRefreshPost: [
                                    ...postRedux.needRefreshPost,
                                    { postId: postId, type: "share" },
                                ],
                            })
                        );
                    }}
                />
            </div>
        </div>
    );
}

export default PostDetail;
