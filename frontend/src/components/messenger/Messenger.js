import { Avatar, Badge, MenuItem } from "@mui/material";
import { height } from "@mui/system";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Api, { baseUrl } from "../../api/Api";
import { ChatContext } from "../../App";
import Images from "../../Images/Images";
import { updateChatState } from "../../reduxs/slices/chatSlice";
import {
    IconAddImage,
    IconCall,
    IconClose,
    IconLike3,
    IconMinimum,
    IconNewChat,
    IconOption,
    IconVideoCall,
} from "../Icon/Icons";
import StyledMenu from "../styledMenu/StyledMenu";
import "./Messenger.scss";

function ChatWindow(props) {
    const [messageList, setMessageList] = useState([]);
    const [accountInfo, setAccountInfo] = useState({});
    const auth = useSelector((state) => state.auth);
    const chat = useSelector((state) => state.chat);
    const [chatInput, setChatInput] = useState("");
    const dispatch = useDispatch();
    const socket = useContext(ChatContext);
    const bottomRef = useRef();
    const navigate = useNavigate();
    const [archor, setArchor] = useState();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState();
    const imageInputRef = useRef();

    useEffect(() => {
        getChatList();
        getAccount();
    }, []);

    useEffect(() => {
        if (
            chat.needUpdateChatList.find((i) => i === props.conversationId) !==
            undefined
        ) {
            getChatList();
            dispatch(
                updateChatState({
                    needUpdateChatList: chat.needUpdateChatList.filter(
                        (i) => i !== props.conversationId
                    ),
                })
            );
        }
    }, [chat.needUpdateChatList]);

    const getAccount = async () => {
        try {
            const id =
                props.account1 === auth.accountId
                    ? props.account2
                    : props.account1;
            const res = await Api.getAccount(id);
            setAccountInfo(res.data.result);
        } catch (err) {
            console.log(err);
        }
    };

    const getChatList = async () => {
        try {
            const res = await Api.getMessageList(props.conversationId);
            setMessageList(res.data.result);
        } catch (err) {
            console.log(err);
        }
    };

    const closeChat = () => {
        dispatch(
            updateChatState({
                chatList: chat.chatList.filter(
                    (e) => e.conversationId !== props.conversationId
                ),
            })
        );
    };

    const minimumChat = () => {
        dispatch(
            updateChatState({
                chatList: chat.chatList.filter(
                    (e) => e.conversationId !== props.conversationId
                ),
                chatMinimumList: [
                    ...chat.chatMinimumList,
                    {
                        ...chat.chatList.find(
                            (e) => e.conversationId === props.conversationId
                        ),
                        ...accountInfo,
                    },
                ],
            })
        );
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
            return <div className="message">
                    <i style={{opacity: 0.7}}>Cuộc gọi kết thúc sau {mess.callDuration} giây</i>
            </div>
        }
        try {
            const message = JSON.parse(mess.message);
            if (message.type === "text") {
                return <div className="message">{message.content}</div>;
            }
            if (message.type === "image") {
                return (
                    <img
                        src={`${baseUrl}/${message.content}`}
                        alt=""
                        className="send-image"
                        onClick={() => {
                            window.open(
                                `${baseUrl}/${message.content}`,
                                "_blank"
                            );
                        }}
                    />
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

    const recallMessage = async () => {
        try {
            await Api.recallMessage(selectedMessage);
            const receiver =
                props.account1 === auth.accountId
                    ? props.account2
                    : props.account1;
            socket.emit("chatmessage", {
                sender: auth.accountId,
                conversationId: props.conversationId,
                message: "",
                receiver: receiver,
            });
            getChatList();
            if (messageList.length >= 0) {
                dispatch(
                    updateChatState({
                        needUpdateConversationList:
                            !chat.needUpdateConversationList,
                    })
                );
            }
        } catch (err) {
            console.log(err);
        }
    };

    const renderChat = () => {
        const tempList = [];
        let current = [];
        messageList.forEach((message) => {
            if (current.length === 0 || current[0].sender === message.sender) {
                current.push(message);
            } else {
                tempList.push(current);
                current = [message];
            }
        });

        if (current.length > 0) {
            tempList.push(current);
        }

        return tempList.map((i) => {
            if (i[0].sender === auth.accountId) {
                return (
                    <div className="my-chat" key={i[0].messageId + "_chat"}>
                        <div className="chat-container">
                            {i.map((message) => (
                                <div
                                    className="user-chat"
                                    key={message.messageId}
                                >
                                    <div
                                        className="options"
                                        onClick={(e) => {
                                            setIsMenuOpen(true);
                                            setSelectedMessage(
                                                message.messageId
                                            );
                                            setArchor(e.target);
                                        }}
                                    >
                                        <IconOption />
                                    </div>

                                    {renderMessage(message)}

                                    <StyledMenu
                                        anchorEl={archor}
                                        open={isMenuOpen}
                                        onClose={() => {
                                            setIsMenuOpen(false);
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
                                                setIsMenuOpen(false);
                                                recallMessage();
                                            }}
                                        >
                                            Thu hồi
                                        </MenuItem>
                                    </StyledMenu>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            } else {
                return (
                    <div
                        className="opponent-chat"
                        key={i[0].messageId + "_chat"}
                    >
                        <div className="user-avatar">
                            <Avatar
                                sx={{ width: 28, height: 28 }}
                                src={
                                    accountInfo.avatar
                                        ? `${baseUrl}/${accountInfo.avatar}`
                                        : Images.defaultAvatar
                                }
                            ></Avatar>
                        </div>

                        <div className="chat-container">
                            {i.map((message) => (
                                <div
                                    className="user-chat"
                                    key={message.messageId}
                                >
                                    {renderMessage(message)}
                                    {/* <div className="options">
                                        <IconOption />
                                    </div> */}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
        });
    };

    const onKeyDown = async (e) => {
        if (e.key === "Enter" && chatInput) {
            const temp = JSON.stringify({
                type: "text",
                content: chatInput,
            });
            setChatInput("");
            try {
                await Api.createMessage(props.conversationId, temp);
                const receiver =
                    props.account1 === auth.accountId
                        ? props.account2
                        : props.account1;
                socket.emit("chatmessage", {
                    sender: auth.accountId,
                    conversationId: props.conversationId,
                    message: temp,
                    receiver: receiver,
                });
                if (messageList.length >= 0) {
                    dispatch(
                        updateChatState({
                            needUpdateConversationList:
                                !chat.needUpdateConversationList,
                        })
                    );
                }
                getChatList();
            } catch (err) {
                console.log(err);
            }
        }
    };

    const sendLike = async () => {
        const temp = JSON.stringify({
            type: "like",
            content: "",
        });
        try {
            await Api.createMessage(props.conversationId, temp);
            const receiver =
                props.account1 === auth.accountId
                    ? props.account2
                    : props.account1;
            socket.emit("chatmessage", {
                sender: auth.accountId,
                conversationId: props.conversationId,
                message: temp,
                receiver: receiver,
            });
            if (messageList.length >= 0) {
                dispatch(
                    updateChatState({
                        needUpdateConversationList:
                            !chat.needUpdateConversationList,
                    })
                );
            }
            getChatList();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messageList]);

    const openCall = () => {
        dispatch(
            updateChatState({
                isCallOpen: true,
                callMode: "call",
                opponentId: accountInfo.accountId,
                isVideoOff: true,
                conversationId: props.conversationId
            })
        );
    };

    const openVideoCall = () => {
        dispatch(
            updateChatState({
                isCallOpen: true,
                callMode: "call",
                opponentId: accountInfo.accountId,
                isVideoOff: false,
                conversationId: props.conversationId
            })
        );
    };

    const sendImage = async (event) => {
        if (event.target.files && event.target.files[0]) {
            try {
                const res = await Api.uploadImage(event.target.files[0]);
                const temp = JSON.stringify({
                    type: "image",
                    content: res.data.result,
                });
                await Api.createMessage(props.conversationId, temp);
                const receiver =
                    props.account1 === auth.accountId
                        ? props.account2
                        : props.account1;
                socket.emit("chatmessage", {
                    sender: auth.accountId,
                    conversationId: props.conversationId,
                    message: temp,
                    receiver: receiver,
                });
                if (messageList.length === 0) {
                    dispatch(
                        updateChatState({
                            needUpdateConversationList:
                                !chat.needUpdateConversationList,
                        })
                    );
                }
                getChatList();
            } catch (e) {
                console.log(e);
            }
        }
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
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
                            backgroundColor: chat.activateUser.includes(
                                accountInfo.accountId
                            )
                                ? "#44b700"
                                : "#00000000",
                        },
                    }}
                >
                    <Avatar
                        sx={{ width: 32, height: 32 }}
                        src={
                            accountInfo.avatar
                                ? `${baseUrl}/${accountInfo.avatar}`
                                : Images.defaultAvatar
                        }
                        onClick={() =>
                            navigate(`/profile/${accountInfo.accountId}`)
                        }
                    ></Avatar>
                </Badge>

                <div className="info">
                    <div className="user-name">{accountInfo.name}</div>
                    <div className="status">
                        {chat.activateUser.includes(accountInfo.accountId)
                            ? "Đang hoạt động"
                            : "Không hoạt động"}
                    </div>
                </div>
                <div className="btn-call btn" onClick={() => openCall()}>
                    <IconCall />
                </div>
                <div className="btn-video-call btn" onClick={() => openVideoCall()}>
                    <IconVideoCall />
                </div>
                <div className="btn-minimum btn" onClick={() => minimumChat()}>
                    <IconMinimum />
                </div>
                <div className="btn-close btn" onClick={() => closeChat()}>
                    <IconClose />
                </div>
            </div>
            <div className="chat-content">
                {renderChat()}
                <div ref={bottomRef} style={{ height: 1, opacity: 0 }}></div>
            </div>
            <div className="chat-footer">
                <input
                    type="file"
                    style={{ display: "none" }}
                    ref={imageInputRef}
                    value={""}
                    onChange={sendImage}
                    accept="image/png, image/jpeg, image/jpg"
                />
                <div
                    className="btn-add-image"
                    onClick={() => imageInputRef.current.click()}
                >
                    <IconAddImage />
                </div>
                <input
                    className="input-message"
                    type="text"
                    placeholder="Aa"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={onKeyDown}
                />
                <div className="btn-like" onClick={() => sendLike()}>
                    <IconLike3 />
                </div>
            </div>
        </div>
    );
}

function Messenger() {
    const chat = useSelector((state) => state.chat);
    const dispatch = useDispatch();
    const expandChat = (conversation) => {
        dispatch(
            updateChatState({
                chatMinimumList: chat.chatMinimumList.filter(
                    (e) => e.conversationId !== conversation.conversationId
                ),
                chatList: [
                    ...chat.chatList,
                    chat.chatMinimumList.find(
                        (e) => e.conversationId === conversation.conversationId
                    ),
                ],
            })
        );
    };
    return (
        <div className="messenger-container">
            {chat.chatList.slice(-4).map((i) => (
                <ChatWindow {...i} key={i.conversationId} />
            ))}

            <div className="minimum-container">
                <div className="new-chat-window">
                    <IconNewChat />
                </div>
                {chat.chatMinimumList.map((i) => (
                    <div
                        className="item"
                        onClick={() => expandChat(i)}
                        key={i.conversationId}
                    >
                        <Avatar
                            sx={{ width: 48, height: 48 }}
                            src={
                                i.avatar
                                    ? `${baseUrl}/${i.avatar}`
                                    : Images.defaultAvatar
                            }
                        ></Avatar>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Messenger;
