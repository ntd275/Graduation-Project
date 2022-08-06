import "./App.scss";
import Home from "./pages/Home";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Profile from "./pages/Profile";
import Friend from "./pages/Friend";
import Login from "./pages/Login";
import { createContext, useEffect, useState } from "react";
import Api from "./api/Api";
import ForgotPassword from "./pages/ForgotPassword";
import jwt_decode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { updateAuthState } from "./reduxs/slices/authSlice";
import { updateFriendRequestState } from "./reduxs/slices/friendRequestSlice";
import Messenger from "./components/messenger/Messenger";
import io from "socket.io-client";
import { updateChatState } from "./reduxs/slices/chatSlice";
import CallWindow from "./components/callWindow/CallWindow";
import Account from "./pages/Account";
import Search from "./pages/Search";
import { updatePostState } from "./reduxs/slices/postSlice";

const ChatContext =  createContext({});
export {ChatContext}

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [socket, setSocket] = useState();
    const chat = useSelector((state) => state.chat)
    const [message, setMessage] = useState();
    const auth = useSelector((state) => state.auth);
    const postRedux = useSelector((state) => state.post);

    useEffect(() => {
        const checkLogin = async () => {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                try {
                    await Api.checkAuth();
                    const decoded = jwt_decode(accessToken);
                    dispatch(updateAuthState(decoded));
                } catch (err) {
                    console.log(err);
                    localStorage.removeItem("accessToken");
                    if (location.pathname !== "/login") {
                        navigate("/login");
                    }
                }
                return;
            }
            if (location.pathname !== "/login") {
                navigate("/login");
            }
        };
        checkLogin().then(() => {
            getFriendRequestList();
            const socket = io("http://localhost:3002", {
                transportOptions: {
                    polling: {
                        extraHeaders: {
                            token: localStorage.getItem("accessToken"),
                        },
                    },
                },
            });
            setSocket(socket);
            socket.on("message", (msg) => {
                setMessage(msg);
            })
            socket.on("callReceive", (msg) => {
                dispatch(updateChatState({
                    isCallOpen: true,
                    callMode: "receive",
                    opponentId: msg.caller,
                    opponentPeerId: msg.peerId
                }))
            })
            socket.on("activateUser", (ids) => {
                dispatch(updateChatState({
                    activateUser: ids,
                }))
            })
            socket.on("comment", (msg) => {
                dispatch(
                    updatePostState({
                        needRefreshPost: [
                            ...postRedux.needRefreshPost,
                            { postId: msg.postId, type: "comment" },
                        ],
                    })
                );
            })
        });
    }, [auth.needUpdate]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if(!message) {
            return;
        }
        if(chat.chatList.find(i => i.conversationId === message.conversationId) === undefined) {
            try {
                Api.createConversation(message.sender).then((res) => {
                    dispatch(updateChatState({
                        chatList: [...chat.chatList, res.data.conversation]
                    }))
                })
            } catch (err) {
                console.log(err)
            }
        } else {
            dispatch(updateChatState({
                needUpdateChatList: [...chat.needUpdateChatList, message.conversationId],
            }))
        }
    }, [message])

    const getFriendRequestList = async () => {
        try {
            const res = await Api.getSendFriendRequestList();
            dispatch(
                updateFriendRequestState({
                    sendFriendRequestList: res.data.result,
                })
            );
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <ChatContext.Provider value={socket}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/friend" element={<Friend />} />
                <Route path="/account" element={<Account />} />
                <Route path="/search" element={<Search />} />
            </Routes>
            {(chat.chatList.length > 0 || chat.chatMinimumList.length > 0)&& <Messenger />}
            {chat.isCallOpen && <CallWindow/>}
        </ChatContext.Provider>
    );
}

export default App;
