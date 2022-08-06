import { Avatar, AvatarGroup, Tabs, Tab, MenuItem, Badge } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Api, { baseUrl } from "../api/Api";
import Header from "../components/header/Header";
import {
    IconAddFriend,
    IconEdit,
    IconImage,
    IconNewChat,
    IconVideo,
} from "../components/Icon/Icons";
import Post from "../components/post/Post";
import Images from "../Images/Images";
import "./Profile.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { formatDate } from "../utils/TimeUtils";
import PostModal from "../components/postModal/PostModal";
import Loading from "../components/loading/Loading";
import { updateFriendRequestState } from "../reduxs/slices/friendRequestSlice";
import PostDetail from "../components/postDetail/PostDetail";
import StyledMenu from "../components/styledMenu/StyledMenu";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "notistack";
import { updateAuthState } from "../reduxs/slices/authSlice";
import { updateChatState } from "../reduxs/slices/chatSlice";

function Profile() {
    const [tabIndex, setTabIndex] = useState(0);
    const [postList, setPostList] = useState([]);
    const [isOpenPostModal, setIsOpenPostModal] = useState(false);
    const { id } = useParams();
    const [account, setAccount] = useState({});
    const [friendList, setFriendList] = useState([]);
    const auth = useSelector((state) => state.auth);
    const friendRequest = useSelector((state) => state.friendRequest);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const postRedux = useSelector((state) => state.post);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const btnRef = useRef();
    const coverImageInputRef = useRef();
    const avatarImageInputRef = useRef();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const chat = useSelector((state) => state.chat);

    const [isChangeCoverImageMenuOpen, setIsChangeCoverImageMenuOpen] =
        useState(false);
    const [isChangeAvatarImageMenuOpen, setIsChangeAvatarImageMenuOpen] =
        useState(false);
    const [coverImageMenuPos, setCoverImageMenuPos] = useState(null);

    const getPosts = async () => {
        try {
            const res = await Api.getPostInProfile(id);
            setPostList(res.data.result);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    };

    const getAccount = async () => {
        try {
            const res = await Api.getAccount(id);
            setAccount(res.data.result);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    };

    const getFriend = async () => {
        try {
            const res = await Api.getFriendList(id);
            setFriendList(res.data.result);
            console.log(res);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getPosts();
        getAccount();
        getFriend();
    }, [id, auth.needUpdate]);

    const openCreatePostModal = () => {
        setIsOpenPostModal(true);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const unfriend = async () => {
        try {
            await Api.unFriend(account.accountId);
            getFriend();
        } catch (err) {
            console.log(err);
        }
    };

    const getAction = () => {
        if (account.accountId === auth.accountId) {
            return (
                <div
                    className="btn btn-edit"
                    onClick={() => navigate(`/account`)}
                >
                    <IconEdit />
                    <div className="btn-text">Chỉnh sửa trang cá nhân</div>
                </div>
            );
        }
        if (
            friendList.findIndex((e) => e.accountId === auth.accountId) !== -1
        ) {
            return (
                <>
                    <div
                        ref={btnRef}
                        className="btn btn-edit"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <IconEdit />
                        <div className="btn-text">Bạn bè</div>
                    </div>
                    <div
                        className="btn btn-chat"
                        onClick={() => openChat(account.accountId)}
                    >
                        <img
                            src={Images.messenger}
                            alt=""
                            style={{ height: 16 }}
                        />
                        <div className="btn-text">Nhắn tin</div>
                    </div>
                    <StyledMenu
                        anchorEl={btnRef.current}
                        open={isMenuOpen}
                        onClose={closeMenu}
                        disableScrollLock={true}
                    >
                        <MenuItem
                            key="placeholder"
                            style={{ display: "none" }}
                        />
                        <MenuItem
                            onClick={() => {
                                unfriend();
                                closeMenu();
                            }}
                        >
                            <DeleteIcon />
                            Hủy kết bạn
                        </MenuItem>
                    </StyledMenu>
                </>
            );
        }
        if (
            friendRequest.sendFriendRequestList.findIndex(
                (e) => e.receiver === account.accountId
            ) !== -1
        ) {
            return (
                <>
                    <div
                        className="btn btn-edit"
                        onClick={() => cancelFriendRequest()}
                    >
                        <div className="btn-text">Hủy lời mời kết bạn</div>
                    </div>
                    <div
                        className="btn btn-chat"
                        onClick={() => openChat(account.accountId)}
                    >
                        <img
                            src={Images.messenger}
                            alt=""
                            style={{ height: 20 }}
                        />
                        <div className="btn-text">Nhắn tin</div>
                    </div>
                </>
            );
        }
        return (
            <>
                <div
                    className="btn btn-add-friend"
                    onClick={() => sendFriendRequest()}
                >
                    <IconAddFriend />
                    <div className="btn-text">Gửi kết bạn</div>
                </div>
                <div
                    className="btn btn-chat"
                    onClick={() => openChat(account.accountId)}
                >
                    <img src={Images.messenger} alt="" style={{ height: 20 }} />
                    <div className="btn-text">Nhắn tin</div>
                </div>
            </>
        );
    };

    const sendFriendRequest = async () => {
        setIsLoading(true);
        try {
            await Api.sendFriendRequest(account.accountId);
            const res = await Api.getSendFriendRequestList();
            dispatch(
                updateFriendRequestState({
                    sendFriendRequestList: res.data.result,
                })
            );
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    const cancelFriendRequest = async () => {
        setIsLoading(true);
        try {
            await Api.cancelFriendRequest(account.accountId);
            const res = await Api.getSendFriendRequestList();
            dispatch(
                updateFriendRequestState({
                    sendFriendRequestList: res.data.result,
                })
            );
            setIsLoading(false);
        } catch (err) {
            console.log(err);
            setIsLoading(false);
        }
    };

    const openChangeCoverImage = (e) => {
        if (account.accountId !== auth.accountId) {
            return;
        }
        setCoverImageMenuPos(e.target);
        setIsChangeCoverImageMenuOpen(true);
    };

    const openChangeAvatarImage = (e) => {
        if (account.accountId !== auth.accountId) {
            return;
        }
        setCoverImageMenuPos(e.target);
        setIsChangeAvatarImageMenuOpen(true);
    };

    const changeCoverImage = async (e) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const res = await Api.uploadImage(e.target.files[0]);
                await Api.editAccount(auth.accountId, {
                    coverImage: res.data.result,
                });
                enqueueSnackbar("Đổi ảnh bìa thành công", {
                    variant: "success",
                });
                getAccount();
            } catch (err) {
                console.log(err);
            }
        }
    };

    const changeAvatar = async (e) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const res = await Api.uploadImage(e.target.files[0]);
                await Api.editAccount(auth.accountId, {
                    avatar: res.data.result,
                });
                const res2 = await Api.refreshToken();
                localStorage.setItem("accessToken", res2.data.accessToken);
                dispatch(
                    updateAuthState({
                        needUpdate: !auth.needUpdate,
                    })
                );
                enqueueSnackbar("Đổi avatar thành công", {
                    variant: "success",
                });
                getAccount();
                await Api;
            } catch (err) {
                console.log(err);
            }
        }
    };

    const openChat = async (accountId) => {
        try {
            const res = await Api.createConversation(accountId);
            dispatch(
                updateChatState({
                    chatList: [
                        ...chat.chatList.filter(
                            (i) =>
                                i.conversationId !==
                                res.data.conversation.conversationId
                        ),
                        res.data.conversation,
                    ],
                    chatMinimumList: chat.chatMinimumList.filter(
                        (i) =>
                            i.conversationId !==
                            res.data.conversation.conversationId
                    ),
                })
            );
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="profile">
            <Header />
            <div className="top-profile">
                <div className="cover-image-container">
                    <img
                        onClick={(e) => {
                            openChangeCoverImage(e);
                        }}
                        className="cover-image"
                        src={
                            account.coverImage
                                ? `${baseUrl}/${account.coverImage}`
                                : Images.defaultCoverImage
                        }
                        alt=""
                    />
                    <StyledMenu
                        anchorEl={coverImageMenuPos}
                        open={isChangeCoverImageMenuOpen}
                        onClose={() => setIsChangeCoverImageMenuOpen(false)}
                        disableScrollLock={true}
                    >
                        <MenuItem
                            key="placeholder"
                            style={{ display: "none" }}
                        />
                        <MenuItem
                            onClick={() => {
                                coverImageInputRef.current.click();
                                setIsChangeCoverImageMenuOpen(false);
                            }}
                        >
                            <EditIcon />
                            Đổi ảnh bìa
                        </MenuItem>
                    </StyledMenu>
                    <input
                        type="file"
                        value={""}
                        onChange={changeCoverImage}
                        ref={coverImageInputRef}
                        style={{ display: "none" }}
                        accept="image/png, image/jpeg, image/jpg"
                    />
                </div>
                <div className="info-container">
                    <div className="info">
                        <div className="avatar-container">
                            <Badge
                                variant="dot"
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "right",
                                }}
                                overlap="circular"
                                color="success"
                                sx={{
                                    "& .MuiBadge-badge": {
                                        backgroundColor:
                                            chat.activateUser.includes(
                                                account.accountId
                                            )
                                                ? "#44b700"
                                                : "#00000000",
                                        height: 16,
                                        width: 16,
                                        borderRadius: "50%",
                                        border: "1px solid #fff",
                                    },
                                }}
                            >
                                <Avatar
                                    onClick={(e) => openChangeAvatarImage(e)}
                                    src={
                                        account.avatar
                                            ? `${baseUrl}/${account.avatar}`
                                            : Images.defaultAvatar
                                    }
                                    sx={{
                                        width: 168,
                                        height: 168,
                                        border: "solid 4px #fff",
                                    }}
                                />
                            </Badge>

                            <StyledMenu
                                anchorEl={coverImageMenuPos}
                                open={isChangeAvatarImageMenuOpen}
                                onClose={() =>
                                    setIsChangeAvatarImageMenuOpen(false)
                                }
                                disableScrollLock={true}
                            >
                                <MenuItem
                                    key="placeholder"
                                    style={{ display: "none" }}
                                />
                                <MenuItem
                                    onClick={() => {
                                        avatarImageInputRef.current.click();
                                        setIsChangeAvatarImageMenuOpen(false);
                                    }}
                                >
                                    <EditIcon />
                                    Đổi avatar
                                </MenuItem>
                            </StyledMenu>
                            <input
                                type="file"
                                value={""}
                                onChange={changeAvatar}
                                ref={avatarImageInputRef}
                                style={{ display: "none" }}
                                accept="image/png, image/jpeg, image/jpg"
                            />
                        </div>
                        <div className="username-container">
                            <div className="username">{account.name}</div>
                            <div className="total-friend">
                                {friendList.length} Bạn bè
                            </div>
                            <div className="group">
                                <AvatarGroup max={4}>
                                    {friendList.map((e) => (
                                        <Avatar
                                            key={e.accountId}
                                            src={
                                                e.avatar
                                                    ? `${baseUrl}/${e.avatar}`
                                                    : Images.defaultAvatar
                                            }
                                            sx={{ width: 32, height: 32 }}
                                        />
                                    ))}
                                </AvatarGroup>
                            </div>
                        </div>
                        <div className="action-container">{getAction()}</div>
                    </div>
                </div>
                <div className="tab-container">
                    <div className="tab">
                        <Tabs
                            value={tabIndex}
                            onChange={(e, v) => setTabIndex(v)}
                        >
                            <Tab label="Bài viết" />
                            <Tab label="Ảnh" />
                            <Tab label="Video" />
                            <Tab label="Bạn bè" />
                        </Tabs>
                    </div>
                </div>
            </div>
            <div className="profile-content">
                <div className="main-content">
                    <div className="col-1">
                        <div className="intro">
                            <div className="title">Giới thiệu</div>
                            <div className="description">
                                <div className="row">
                                    <div className="name">Sống tại</div>
                                    <div className="value">
                                        {account.address || "Không rõ"}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="name">Sinh nhật</div>
                                    <div className="value">
                                        {account.dateOfBirth &&
                                            formatDate(
                                                new Date(account.dateOfBirth)
                                            )}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="name">Giới tính</div>
                                    <div className="value">
                                        {!!account.gender ? "Nam" : "Nữ"}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="image-container">
                            <div className="title">Ảnh</div>
                            <div className="row">
                                <div className="image">
                                    <img src={Images.user} alt="" />
                                </div>
                                <div className="image">
                                    <img src={Images.user} alt="" />
                                </div>
                                <div className="image">
                                    <img src={Images.user} alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="friend-container">
                            <div className="title">Bạn bè</div>
                            <div className="row">
                                <div className="image">
                                    <img src={Images.user} alt="" />
                                    <div className="username">
                                        Nguyễn Thế Đức
                                    </div>
                                </div>
                                <div className="image">
                                    <img src={Images.user} alt="" />
                                    <div className="username">
                                        Nguyễn Thế Đức
                                    </div>
                                </div>
                                <div className="image">
                                    <img src={Images.user} alt="" />
                                    <div className="username">
                                        Nguyễn Thế Đức
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="posts">
                            <div className="container">
                                {auth.accountId === account.accountId && (
                                    <div className="create-post">
                                        <div className="top">
                                            <Avatar
                                                src={
                                                    auth.avatar
                                                        ? `${baseUrl}/${auth.avatar}`
                                                        : Images.defaultAvatar
                                                }
                                            ></Avatar>
                                            <div
                                                className="input"
                                                onClick={() =>
                                                    openCreatePostModal()
                                                }
                                            >
                                                Bạn đang nghĩ gì?
                                            </div>
                                        </div>
                                        <div className="bottom">
                                            <div
                                                className="button"
                                                onClick={() =>
                                                    openCreatePostModal()
                                                }
                                            >
                                                <IconImage />
                                                <div>Ảnh</div>
                                            </div>
                                            <div
                                                className="button"
                                                onClick={() =>
                                                    openCreatePostModal()
                                                }
                                            >
                                                <IconVideo />
                                                <div>Video</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="post-list">
                                    {postList.map((post) => (
                                        <Post
                                            key={post.postId}
                                            refreshPost={getPosts}
                                            {...post}
                                        />
                                    ))}
                                    <div
                                        style={{
                                            height:
                                                postList.length === 0
                                                    ? 600
                                                    : 200,
                                            display: "flex",
                                            justifyContent: "center",
                                            paddingTop: 20,
                                            maxHeight: "auto",
                                        }}
                                    >
                                        {postList.length === 0 &&
                                            "Không có bài đăng nào"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {isOpenPostModal && (
                        <PostModal
                            open={isOpenPostModal}
                            mode="create"
                            onClose={() => setIsOpenPostModal(false)}
                            onCreated={() => getPosts()}
                        />
                    )}
                    <Loading open={isLoading} />
                    {postRedux.isOpenPostDetail && (
                        <PostDetail
                            postId={postRedux.postDetailId}
                            refreshPost={getPosts}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
