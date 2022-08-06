import React, { useEffect, useRef, useState } from "react";
import Images from "../../Images/Images";
import "./header.scss";
import { Search } from "@mui/icons-material";
import { Avatar, MenuItem, Popover } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import StyledMenu from "../styledMenu/StyledMenu";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import Api, { baseUrl } from "../../api/Api";
import ChangePasswordModal from "../changePassword/ChangePassword";
import LockIcon from "@mui/icons-material/Lock";
import { updateSearchState } from "../../reduxs/slices/searchSlice";
import { updateChatState } from "../../reduxs/slices/chatSlice";
import { IconLike3, IconThreeDot } from "../Icon/Icons";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteAlert from "../deleteAlert/DeleteAlert";

function Header() {
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const arrowDownRef = useRef();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const search = useSelector((state) => state.search);
    const messengerRef = useRef();
    const dispatch = useDispatch();
    const [isConversationOpen, setIsConversationOpen] = useState(false);
    const chat = useSelector((state) => state.chat);
    const [archor, setArchor] = useState();
    const [isConversationMenuOpen, setIsConversationMenuOpen] = useState(false);
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState();

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const logOut = () => {
        Api.logout();
        localStorage.removeItem("accessToken");
        navigate("/login");
    };

    const getConversationList = async () => {
        try {
            const res = await Api.getConversationList();
            dispatch(
                updateChatState({
                    conversationList: res.data.result,
                })
            );
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getConversationList();
    }, [chat.needUpdateChatList, chat.needUpdateConversationList]);

    useEffect(() => {

    }, [chat.openConversationList])

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

    const renderMessage = (mess) => {
        if (mess.isRecall) {
            return (
                <div className="message">
                    <i style={{opacity: 0.7}}>Tin nhắn đã được thu hồi</i>
                </div>
            );
        }

        if (mess.isCall) {
            return (
                <div className="message">
                    <i style={{opacity: 0.7}}>Cuộc gọi</i>
                </div>
            );
        }
        try {
            const message = JSON.parse(mess.message);
            if (message.type === "text") {
                return <div className="message">{message.content}</div>;
            }
            if (message.type === "image") {
                return (
                    <div className="message">
                    <i style={{opacity: 0.7}}>Hình ảnh</i>
                </div>
                );
            }
            if (message.type === "like") {
                return <IconLike3 />;
            }
        } catch (e) {
            console.log(e);
            return "";
        }
        return "";
    };

    const renderConversations = () => {
        return (
            <Popover
                open={chat.openConversationList}
                anchorEl={messengerRef.current}
                onClose={() => dispatch(updateChatState({
                    openConversationList: false,
                }))}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                disableScrollLock={true}
            >
                <div className="conversation-list-container">
                    <div className="title">Chat</div>
                    {chat.conversationList
                        .filter((i) => !!i.lastMessage)
                        .map((item) => (
                            <div
                                key={item.conversationId}
                                className="conversation"
                                onClick={() => {
                                    openChat(item.opponent.accountId);
                                    dispatch(updateChatState({
                                        openConversationList: false,
                                    }))
                                }}
                            >
                                <Avatar
                                    src={
                                        item.opponent.avatar
                                            ? `${baseUrl}/${item.opponent.avatar}`
                                            : Images.defaultAvatar
                                    }
                                ></Avatar>
                                <div className="info">
                                    <div className="name">
                                        {item.opponent.name}
                                    </div>
                                    {renderMessage(item.lastMessage)}
                                </div>
                                <div
                                    className="options"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setArchor(e.target);
                                        setIsConversationMenuOpen(true);
                                    }}
                                >
                                    <IconThreeDot />
                                </div>
                                <StyledMenu
                                    anchorEl={archor}
                                    open={isConversationMenuOpen}
                                    onClose={() => {
                                        setIsConversationMenuOpen(false);
                                    }}
                                    disableScrollLock={true}
                                >
                                    <MenuItem
                                        key="placeholder"
                                        style={{ display: "none" }}
                                    />
                                    <MenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedConversation(item.conversationId)
                                            setIsDeleteAlertOpen(true);
                                            setIsConversationMenuOpen(false);
                                            
                                        }}
                                    >
                                        <DeleteIcon />
                                        Xóa cuộc trò chuyện
                                    </MenuItem>
                                </StyledMenu>
                            </div>
                        ))}
                        {chat.conversationList
                        .filter((i) => !!i.lastMessage).length === 0 && <div className="conversation">Không có cuộc trò chuyện</div>}
                </div>
                <DeleteAlert
                    title="Xác nhận xóa cuộc trò chuyện?"
                    open={isDeleteAlertOpen}
                    onClose={() => setIsDeleteAlertOpen(false)}
                    onConfirm={() => deletePost()}
                />
            </Popover>
        );
    };

    const deletePost = async () => {
        try {
            await Api.deleteConversation(selectedConversation)
            setIsDeleteAlertOpen(false)
            getConversationList();
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="header">
            <div className="logo">
                <img
                    src={Images.logo}
                    alt="logo"
                    className="logo-img"
                    onClick={() => navigate("/")}
                />
            </div>
            <div className="search">
                <div className="search-icon">
                    <Search color="action" />
                </div>
                <input
                    className="search-input"
                    placeholder="Tìm kiếm trên Hola"
                    value={search.searchValue}
                    onChange={(e) => {
                        dispatch(
                            updateSearchState({ searchValue: e.target.value })
                        );
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && search.searchValue) {
                            navigate("/search");
                        }
                    }}
                />
            </div>
            <div className="right-menu">
                <Avatar
                    src={
                        auth.avatar
                            ? `${baseUrl}/${auth.avatar}`
                            : Images.defaultAvatar
                    }
                    onClick={() => navigate(`/profile/${auth.accountId}`)}
                />
                <div
                    className="user-name"
                    onClick={() => navigate(`/profile/${auth.accountId}`)}
                >
                    {auth.name}
                </div>
                <Avatar
                    sx={{ bgcolor: "#e4e6eb" }}
                    style={{ marginLeft: "20px" }}
                    ref={messengerRef}
                    onClick={() => dispatch(updateChatState({
                        openConversationList: true,
                    }))}
                >
                    <img
                        alt=""
                        src={Images.messenger}
                        style={{ width: "24px", height: "auto" }}
                    />
                </Avatar>
                {renderConversations()}
                <Avatar
                    sx={{ bgcolor: "#e4e6eb" }}
                    style={{ marginLeft: "10px" }}
                >
                    <img
                        alt=""
                        src={Images.notification}
                        style={{ width: "24px", height: "auto" }}
                    />
                </Avatar>
                <Avatar
                    sx={{ bgcolor: "#e4e6eb" }}
                    style={{ marginLeft: "10px", marginRight: "20px" }}
                    onClick={() => {
                        setIsMenuOpen(true);
                    }}
                    ref={arrowDownRef}
                >
                    <img
                        alt=""
                        src={Images.arrowDown}
                        style={{
                            width: "20px",
                            height: "auto",
                            marginTop: "3px",
                        }}
                    />
                </Avatar>
                <StyledMenu
                    anchorEl={arrowDownRef.current}
                    open={isMenuOpen}
                    onClose={closeMenu}
                    disableScrollLock={true}
                >
                    <MenuItem key="placeholder" style={{ display: "none" }} />
                    <MenuItem
                        onClick={() => {
                            navigate("/account");
                            closeMenu();
                        }}
                    >
                        <EditIcon />
                        Chỉnh sửa thông tin cá nhân
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            setIsChangePasswordOpen(true);
                            closeMenu();
                        }}
                    >
                        <LockIcon />
                        Đổi mật khẩu
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            closeMenu();
                            logOut();
                        }}
                    >
                        <LogoutIcon />
                        Đăng xuất
                    </MenuItem>
                </StyledMenu>
                {isChangePasswordOpen && (
                    <ChangePasswordModal
                        open={isChangePasswordOpen}
                        onClose={() => setIsChangePasswordOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}

export default Header;
