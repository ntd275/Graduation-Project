import React, { useEffect, useState } from "react";
import Api, { baseUrl } from "../api/Api";
import Header from "../components/header/Header";
import {
    IconAllFriend,
    IconFriend,
    IconInviteFriend,
    IconPeople,
    IconSuggestFriend,
} from "../components/Icon/Icons";
import Images from "../Images/Images";
import "./Search.scss";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateFriendRequestState } from "../reduxs/slices/friendRequestSlice";
import { Avatar } from "@mui/material";
import Post from "../components/post/Post";
import PostDetail from "../components/postDetail/PostDetail";

function Search() {
    const [peopleList, setPeopleList] = useState([]);
    const [postList, setPostList] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState("people");
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const search = useSelector((state) => state.search);
    const postRedux = useSelector((state) => state.post);

    useEffect(() => {
        getPostList();
        getPeopleList();
    }, [search.searchValue]);

    const getPostList = async () => {
        try {
            const res = await Api.searchPost(search.searchValue);
            setPostList(res.data.result.data);
        } catch (err) {
            console.log(err);
        }
    };

    const getPeopleList = async () => {
        try {
            const res = await Api.searchPeople(search.searchValue);
            setPeopleList(res.data.result.data);
        } catch (err) {
            console.log(err);
        }
    };

    const renderPeople = () => {
        if (selectedMenu === "people") {
            return (
                <div className="request-friend">
                    <div className="title">Mọi người</div>
                    <div className="request-container">
                        {peopleList.map((e) => (
                            <div className="item" key={e.accountId}>
                                <Avatar
                                    className="avatar"
                                    src={
                                        e.avatar
                                            ? `${baseUrl}/${e.avatar}`
                                            : Images.defaultAvatar
                                    }
                                    onClick={() =>
                                        navigate(`/profile/${e.accountId}`)
                                    }
                                    sx={{ width: 60, height: 60 }}
                                />
                                <div style={{ marginLeft: 10 }}>
                                    <div
                                        className="username"
                                        onClick={() =>
                                            navigate(`/profile/${e.accountId}`)
                                        }
                                    >
                                        {e.name}
                                    </div>
                                    <div className="gender">
                                        Giới tính:{" "}
                                        {e.gender === 1 ? "Nam" : "Nữ"}
                                    </div>
                                    {!!e.address && (
                                        <div className="address">
                                            Sống tại {e.address ?? "không rõ"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return <></>;
    };

    const redenPost = () => {
        if (selectedMenu === "post") {
            return (
                <div className="request-friend">
                    <div className="title">Bài đăng</div>
                    <div className="request-container">
                        {postList.map((post) => 
                            <Post
                                key={post.postId}
                                refreshPost={getPostList}
                                {...post}
                            />
                        )}
                    </div>
                </div>
            );
        }
        return <></>;
    };

    return (
        <div className="search-page">
            <Header />
            <div className="container">
                <div className="left-page">
                    <div className="title">Kết quả tìm kiếm</div>
                    <div
                        className={`item ${
                            selectedMenu === "people" ? "act" : ""
                        }`}
                        onClick={() => setSelectedMenu("people")}
                    >
                        <div className="icon">
                            <IconFriend />
                        </div>
                        <div className="value">Mọi người</div>
                    </div>
                    <div
                        className={`item ${
                            selectedMenu === "post" ? "act" : ""
                        }`}
                        onClick={() => setSelectedMenu("post")}
                    >
                        <div className="icon">
                            <IconPeople />
                        </div>
                        <div className="value">Bài viết</div>
                    </div>
                </div>
                <div className="right-page">
                    {renderPeople()}
                    {redenPost()}
                </div>
                {postRedux.isOpenPostDetail && (
                <PostDetail
                    postId={postRedux.postDetailId}
                    refreshPost={getPostList}
                />
            )}
            </div>
        </div>
    );
}

export default Search;
