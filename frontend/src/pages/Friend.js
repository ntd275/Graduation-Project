import React, { useEffect, useState } from "react";
import Api, { baseUrl } from "../api/Api";
import Header from "../components/header/Header";
import {
    IconAllFriend,
    IconFriend,
    IconInviteFriend,
    IconSuggestFriend,
} from "../components/Icon/Icons";
import Images from "../Images/Images";
import "./Friend.scss";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateFriendRequestState } from "../reduxs/slices/friendRequestSlice";

function Friend() {
    const [friendRequestList, setFriendRequestList] = useState([]);
    const [suggestFriendList, setSuggestFriendList] = useState([]);
    const [friendList, setFriendList] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState("home");
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const friendRequest = useSelector((state) => state.friendRequest);

    useEffect(() => {
        getFriendRequestList();
        getSuggestFriendList();
        getFriendList();
    }, [auth]);

    const getFriendRequestList = async () => {
        try {
            const res = await Api.getFriendRequestList();
            setFriendRequestList(res.data.result);
        } catch (err) {
            console.log(err);
        }
    };

    const getSuggestFriendList = async () => {
        try {
            const res = await Api.getSuggestFriend();
            setSuggestFriendList(res.data.result);
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

    const acceptFriendRequest = async (accountId) => {
        try {
            await Api.acceptFriendRequest(accountId);
            getFriendRequestList();
            getFriendList();
        } catch (err) {
            console.log(err);
        }
    };

    const refuseFriendRequest = async (accountId) => {
        try {
            await Api.refuseFriendRequest(accountId);
            getFriendRequestList();
        } catch (err) {
            console.log(err);
        }
    };

    const renderRequestFriend = () => {
        if (selectedMenu === "home" || selectedMenu === "request") {
            return (
                <div className="request-friend">
                    <div className="title">Lời mời kết bạn</div>
                    <div className="request-container">
                        {friendRequestList.map((e) => (
                            <div className="item" key={e.accountId}>
                                <div className="avatar" onClick={() => navigate(`/profile/${e.accountId}`)}>
                                    <img
                                        src={e.avatar ? `${baseUrl}/${e.avatar}` : Images.defaultAvatar}
                                        alt=""
                                    />
                                </div>
                                <div className="username" onClick={() => navigate(`/profile/${e.accountId}`)}>{e.name}</div>
                                <div className="friend">
                                    {e.mutualFriend} bạn chung
                                </div>
                                <div
                                    className="btn btn-accept"
                                    onClick={() =>
                                        acceptFriendRequest(e.accountId)
                                    }
                                >
                                    Đồng ý
                                </div>
                                <div
                                    className="btn btn-refuse"
                                    onClick={() =>
                                        refuseFriendRequest(e.accountId)
                                    }
                                >
                                    Từ chối
                                </div>
                            </div>
                        ))}
                        {friendRequestList.length === 0 && <div>Không có lời mời kết bạn nào</div>}
                    </div>
                </div>
            );
        }
        return <></>;
    };

    const sendFriendRequest = async (accountId) => {
        try {
            await Api.sendFriendRequest(accountId);
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

    const cancelFriendRequest = async (accountId) => {
        try {
            await Api.cancelFriendRequest(accountId);
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

    const renderSuggestFriend = () => {
        if (selectedMenu === "home" || selectedMenu === "suggest") {
            return (
                <div className="request-friend">
                    <div className="title">Những người bạn có thể biết</div>
                    <div className="request-container">
                        {suggestFriendList.map((e) => {
                            const isSend =
                                friendRequest.sendFriendRequestList.findIndex(
                                    (x) => x.receiver === e.accountId
                                ) !== -1;
                            return (
                                <div className="item">
                                    <div className="avatar" onClick={() => navigate(`/profile/${e.accountId}`)}>
                                        <img
                                            src={
                                                e.avatar ? `${baseUrl}/${e.avatar}` :Images.defaultAvatar
                                            }
                                            alt=""
                                        />
                                    </div>
                                    <div className="username" onClick={() => navigate(`/profile/${e.accountId}`)}>{e.name}</div>
                                    <div className="friend">
                                        {e.mutualFriend} bạn chung
                                    </div>
                                    {!isSend ? (
                                        <div
                                            className="btn btn-add"
                                            onClick={() =>
                                                sendFriendRequest(e.accountId)
                                            }
                                        >
                                            Thêm bạn bè
                                        </div>
                                    ) : (
                                        <div
                                            className="btn btn-add"
                                            onClick={() =>
                                                cancelFriendRequest(e.accountId)
                                            }
                                        >
                                            Hủy lời mời
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {suggestFriendList.length === 0 && <div>Không có gợi ý kết bạn nào</div>}
                    </div>
                </div>
            );
        }
        return <></>;
    };

    const renderFriendList = () => {
        if (selectedMenu === "all") {
            return (
                <div className="request-friend">
                    <div className="title">Tất cả bạn bè</div>
                    <div className="request-container">
                        {friendList.map((e) => (
                            <div className="item">
                                <div className="avatar" onClick={() => navigate(`/profile/${e.accountId}`)}>
                                    <img
                                        src={e.avatar ? `${baseUrl}/${e.avatar}` : Images.defaultAvatar}
                                        alt=""
                                    />
                                </div>
                                <div className="username" onClick={() => navigate(`/profile/${e.accountId}`)}>{e.name}</div>
                                <div className="friend">
                                    {e.mutualFriend} bạn chung
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="friend-page">
            <Header />
            <div className="container">
                <div className="left-page">
                    <div className="title">Bạn bè</div>
                    <div
                        className={`item ${
                            selectedMenu === "home" ? "act" : ""
                        }`}
                        onClick={() => setSelectedMenu("home")}
                    >
                        <div className="icon">
                            <IconFriend />
                        </div>
                        <div className="value">Trang chủ</div>
                    </div>
                    <div
                        className={`item ${
                            selectedMenu === "request" ? "act" : ""
                        }`}
                        onClick={() => setSelectedMenu("request")}
                    >
                        <div className="icon">
                            <IconInviteFriend />
                        </div>
                        <div className="value">Lời mời kết bạn</div>
                    </div>
                    <div
                        className={`item ${
                            selectedMenu === "suggest" ? "act" : ""
                        }`}
                        onClick={() => setSelectedMenu("suggest")}
                    >
                        <div className="icon">
                            <IconSuggestFriend />
                        </div>
                        <div className="value">Gợi ý</div>
                    </div>
                    <div
                        className={`item ${
                            selectedMenu === "all" ? "act" : ""
                        }`}
                        onClick={() => setSelectedMenu("all")}
                    >
                        <div className="icon">
                            <IconAllFriend />
                        </div>
                        <div className="value">Tất cả bạn bè</div>
                    </div>
                </div>
                <div className="right-page">
                    {renderRequestFriend()}
                    {renderSuggestFriend()}
                    {renderFriendList()}
                </div>
            </div>
        </div>
    );
}

export default Friend;
