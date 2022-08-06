import React, { useRef, useState, useEffect, useContext } from "react";
import "./CallWindow.scss";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { IconClose2, IconImage, IconVideo } from "../Icon/Icons";
import { Avatar, Button } from "@mui/material";
import Images from "../../Images/Images";
import TextField from "@mui/material/TextField";
import PreviewGrid from "../previewGrid/PreviewGrid";
import Api, { baseUrl } from "../../api/Api";
import { useSnackbar } from "notistack";
import Loading from "../loading/Loading";
import { useSelector, useDispatch } from "react-redux";
import { updateChatState } from "../../reduxs/slices/chatSlice";
import { v4 as uuidv4 } from "uuid";
import { Peer } from "peerjs";
import { ChatContext } from "../../App";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';

function CallWindow(props) {
    const [isLoading, setIsLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const auth = useSelector((state) => state.auth);
    const chat = useSelector((state) => state.chat);
    const myStream = useRef();
    const dispatch = useDispatch();
    const [peerId, setPeerId] = useState(uuidv4());
    const [peer, setPeer] = useState(new Peer(peerId));
    const socket = useContext(ChatContext);

    const opponentVideoRef = useRef();
    const myVideoRef = useRef();
    const [accountInfo, setAccountInfo] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const isConnectedRef = useRef(false)
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(chat.isVideoOff);
    const [isShowAction, setIsShowAction] = useState(chat.callMode === "call");
    const [isRefuse, setIsRefuse] = useState(false);
    const isRefuseRef = useRef(false);
    const beginTime = useRef();

    useEffect(() => {
        openMyCamera().then(() => {
            myStream.current.getVideoTracks()[0].enabled = !isVideoOff;
            myStream.current.getAudioTracks()[0].enabled = !isMuted;
            if (chat.callMode === "call") {
                peer.on("call", (call) => {
                    call.answer(myStream.current);
                    call.on("stream", (opponentStream) => {
                        showVideo(
                            opponentStream,
                            opponentVideoRef.current,
                            false
                        );
                        setIsConnected(true);
                        isConnectedRef.current = true;
                        beginTime.current = new Date();
                    });
                });
                socket.emit("callTo", {
                    accountId: chat.opponentId,
                    peerId: peerId,
                    caller: auth.accountId,
                });
            }
            socket.on("refuseCall", () => {
                setIsRefuse(true);
                isRefuseRef.current = true;
            });
            socket.on("endCall", () => {
                dispatch(
                    updateChatState({
                        isCallOpen: false,
                    })
                );
                enqueueSnackbar("Cuộc gọi đã kết thúc", {variant:"info"})
            });
        });
        getAccountInfo();
        return () => {
            stopMyStream();
            socket.off("refuseCall");
            socket.off("endCall");
            if (isConnectedRef.current || (!isConnectedRef.current && chat.callMode === "call")) {
                socket.emit("endCall", {
                    accountId: chat.opponentId,
                });
            }

            if (chat.callMode === "receive" && !isConnectedRef.current) {
                socket.emit("refuseCall", {
                    accountId: chat.opponentId,
                });
            }
            
            if (chat.callMode === "call" && isConnectedRef.current) {
                const second =
                    (new Date().getTime() - beginTime.current.getTime()) / 1000;
                Api.createMessageCall(chat.conversationId, Math.trunc(second));
                dispatch(updateChatState({
                    needUpdateChatList: [...chat.needUpdateChatList, chat.conversationId],
                }))
            }
        };
    }, []);

    useEffect(() => {
        if (myStream.current) {
            myStream.current.getVideoTracks()[0].enabled = !isVideoOff;
            myStream.current.getAudioTracks()[0].enabled = !isMuted;
        }
    }, [isVideoOff, isMuted]);

    const answerCall = () => {
        const call = peer.call(chat.opponentPeerId, myStream.current);
        call.on("stream", (opponentStream) => {
            console.log(opponentStream);
            showVideo(opponentStream, opponentVideoRef.current, false);
            setIsConnected(true);
            isConnectedRef.current = true;
            setIsShowAction(true);
        });
    };

    const getAccountInfo = async () => {
        try {
            const res = await Api.getAccount(chat.opponentId);
            setAccountInfo(res.data.result);
        } catch (err) {
            console.log(err);
        }
    };

    const showVideo = (stream, video, isMuted) => {
        video.srcObject = stream;
        video.volume = isMuted ? 0 : 1;
        video.onloadedmetadata = () => video.play();
    };

    const closeDialog = (_e, reason) => {
        if (reason === "backdropClick") {
            return;
        }
        dispatch(
            updateChatState({
                isCallOpen: false,
            })
        );
    };

    const getTitle = () => {
        if (chat.callMode === "call" && !isConnected) {
            return "Đang gọi";
        }
        if (chat.callMode === "receive" && !isConnected) {
            return "Bạn có cuộc gọi";
        }
        return "Đã kết nối";
    };

    const openMyCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        showVideo(stream, myVideoRef.current, true);
        myStream.current = stream;
    };

    const stopMyStream = () => {
        myStream.current?.getTracks().forEach(function (track) {
            track.stop();
        });
    };

    const refuseCall = () => {
        socket.emit("refuseCall", {
            accountId: chat.opponentId,
        });
        dispatch(
            updateChatState({
                isCallOpen: false,
            })
        );
    };

    return (
        <Dialog
            open={chat.isCallOpen}
            onClose={closeDialog}
            maxWidth={"1000px"}
        >
            <DialogTitle>
                <div className="post-modal-title">
                    <div className="title-text">{getTitle()}</div>
                    <div className="btn-close" onClick={() => closeDialog()}>
                        <IconClose2 />
                    </div>
                </div>
            </DialogTitle>
            <Loading open={isLoading} />
            <div className="call-window">
                <video
                    className="opponent-video"
                    ref={opponentVideoRef}
                ></video>
                <video className="my-video" ref={myVideoRef}></video>
                <div className="action-call">
                    {(!isConnected || !isShowAction) && (
                        <div className="avatar">
                            <Avatar
                                src={
                                    accountInfo.avatar
                                        ? `${baseUrl}/${accountInfo.avatar}`
                                        : Images.defaultAvatar
                                }
                                sx={{ height: 100, width: 100 }}
                            />
                            <div
                                style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    color: "#f1f1f1",
                                }}
                            >
                                {accountInfo.name}
                            </div>
                            {isRefuse && <div style={{ fontSize: 20, color: "#f1f1f1"}}>Người dùng bận</div>}
                            {!isShowAction && (
                                <div className="answer">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        style={{ marginRight: 30 }}
                                        onClick={() => answerCall()}
                                    >
                                        Trả lời
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => refuseCall()}
                                    >
                                        Từ chối
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                    {isShowAction && (
                        <div className="action">
                            <div
                                className="btn"
                                onClick={() => setIsMuted(!isMuted)}
                            >
                                {isMuted ? <MicIcon/> : <MicOffIcon/>}
                            </div>
                            <div
                                className="btn"
                                onClick={() => setIsVideoOff(!isVideoOff)}
                            >
                                {isVideoOff ? <VideocamIcon/> : <VideocamOffIcon />}
                            </div>
                            <div
                                className="btn"
                                style={{ backgroundColor: "#ff000099" }}
                                onClick={() => {
                                    dispatch(
                                        updateChatState({
                                            isCallOpen: false,
                                        })
                                    );
                                }}
                            >
                                <CallEndIcon />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Dialog>
    );
}

export default CallWindow;
