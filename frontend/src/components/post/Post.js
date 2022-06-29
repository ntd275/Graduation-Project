import { Avatar } from "@mui/material";
import React from "react";
import Images from "../../Images/Images";
import {
  IconComment,
  IconLike,
  IconLike2,
  IconShare,
  IconThreeDot,
} from "../Icon/Icons";
import "./Post.scss";

function Post() {
  return (
    <div className="post-container">
      <div className="post-header">
        <Avatar src={Images.user}></Avatar>
        <div className="post-info">
          <div className="user-name">Nguyễn Thế Đức</div>
          <div className="time">1 giờ</div>
        </div>
        <div className="options">
          <IconThreeDot />
        </div>
      </div>
      <div className="post-content">Happy Birthday</div>
      <div className="post-reactions">
        <IconLike />
        <div className="number-like">100</div>
        <div className="number-comment">100 bình luận</div>
        <div className="number-share">100 lượt chia sẻ</div>
      </div>
      <div className="post-actions">
        <div className="like button">
          <IconLike2 />
          <div>Thích</div>
        </div>
        <div className="comment button">
          <IconComment />
          <div>Bình luận</div>
        </div>
        <div className="share button">
          <IconShare />
          <div>Chia sẻ</div>
        </div>
      </div>
      <div className="comment-container">
        <div className="h-ruler"></div>
        <div className="comment">
          <Avatar sx={{ width: 32, height: 32 }} src={Images.user}></Avatar>
          <div className="comment-content">
            <div className="user-name">Nguyễn Thế Đức</div>
            <div className="comment-message">Hello</div>
          </div>
          <div className="options">
            <IconThreeDot/>
          </div>
        </div>
        <div className="add-comment">
          <Avatar sx={{ width: 32, height: 32 }} src={Images.user}></Avatar>
          <input className="comment-input" placeholder='Viết bình luận...'></input>
        </div>
      </div>
    </div>
  );
}

export default Post;
