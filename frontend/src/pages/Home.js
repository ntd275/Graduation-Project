import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import Api, { baseUrl } from "../api/Api";
import Header from "../components/header/Header";
import { IconImage, IconVideo } from "../components/Icon/Icons";
import Post from "../components/post/Post";
import PostDetail from "../components/postDetail/PostDetail";
import PostModal from "../components/postModal/PostModal";
import Images from "../Images/Images";
import "./Home.scss";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateChatState } from "../reduxs/slices/chatSlice";

function Home() {
    const [postList, setPostList] = useState([]);
    const [isOpenPostModal, setIsOpenPostModal] = useState(false);
    const [postModalMode, setPostModalMode] = useState("create");
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const postRedux = useSelector((state) => state.post);
    const [friendList, setFriendList] = useState([]);
    const dispatch = useDispatch();
    const chat = useSelector((state) => state.chat);

    const getPosts = async () => {
        try {
            const res = await Api.getPostsInNewFeed();
            setPostList(res.data.result);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    };

    const getFriendList = async () => {
        try {
            const res = await Api.getFriendList(auth.accountId);
            setFriendList(res.data.result);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getPosts();
        getFriendList();
    }, [auth]);

    const openCreatePostModal = () => {
        setPostModalMode("create");
        setIsOpenPostModal(true);
    };

    const openChat = async (accountId) => {
        try {
            const res = await Api.createConversation(accountId);
                dispatch(updateChatState({ chatList: [...chat.chatList, res.data.conversation]
            }))
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div className="home">
            <Header />
            <div className="content">
                <div className="left-side-bar">
                    <div
                        className="item"
                        onClick={() => navigate(`/profile/${auth.accountId}`)}
                    >
                        <Avatar
                            sx={{ width: 36, height: 36 }}
                            src={auth.avatar ? `${baseUrl}/${auth.avatar}` : Images.defaultAvatar}
                            style={{ marginLeft: "5px" }}
                        ></Avatar>
                        <div className="text">{auth.name}</div>
                    </div>
                    <div className="item" onClick={() => navigate("/friend")}>
                        <img
                            src={Images.friend}
                            alt=""
                            style={{
                                width: "36px",
                                height: "auto",
                                marginLeft: "5px",
                            }}
                        ></img>
                        <div className="text">Bạn bè</div>
                    </div>
                    <div className="item" onClick={() => {}}>
                        <img
                            src={Images.messenger2}
                            alt=""
                            style={{
                                width: "36px",
                                height: "auto",
                                marginLeft: "5px",
                            }}
                        ></img>
                        <div className="text">Tin nhắn</div>
                    </div>
                </div>
                <div className="right-side-bar">
                    <div className="contact">Người liên hệ</div>
                    {friendList.map((e) => (
                        <div className="item" key={e.accountId} onClick={() => openChat(e.accountId)}>
                            <Avatar
                                sx={{ width: 36, height: 36 }}
                                src={e.avatar ? `${baseUrl}/${e.avatar}` :Images.defaultAvatar}
                                style={{ marginLeft: "5px" }}
                            ></Avatar>
                            <div className="text">{e.name}</div>
                        </div>
                    ))}
                </div>
                <div className="posts">
                    <div className="container">
                        <div className="create-post">
                            <div className="top">
                                <Avatar
                                    src={auth.avatar ? `${baseUrl}/${auth.avatar}` : Images.defaultAvatar}
                                ></Avatar>
                                <div
                                    className="input"
                                    onClick={() => openCreatePostModal()}
                                >
                                    Nguyễn ơi, bạn đang nghĩ gì thế?
                                </div>
                            </div>
                            <div className="bottom">
                                <div
                                    className="button"
                                    onClick={() => openCreatePostModal()}
                                >
                                    <IconImage />
                                    <div>Ảnh</div>
                                </div>
                                <div
                                    className="button"
                                    onClick={() => openCreatePostModal()}
                                >
                                    <IconVideo />
                                    <div>Video</div>
                                </div>
                            </div>
                        </div>
                        <div className="post-list">
                            {postList.map((post, index) => (
                                <Post
                                    key={post.postId}
                                    refreshPost={getPosts}
                                    {...post}
                                />
                            ))}
                        </div>
                        <div style={{ height: 200 }}></div>
                    </div>
                </div>
            </div>
            {isOpenPostModal && (
                <PostModal
                    open={isOpenPostModal}
                    mode={postModalMode}
                    onClose={() => setIsOpenPostModal(false)}
                    onCreated={() => getPosts()}
                />
            )}
            {postRedux.isOpenPostDetail && (
                <PostDetail
                    postId={postRedux.postDetailId}
                    refreshPost={getPosts}
                />
            )}
        </div>
    );
}

export default Home;
