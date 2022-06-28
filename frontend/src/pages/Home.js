import { Avatar } from "@mui/material";
import React from "react";
import Header from "../components/header/Header";
import { IconImage, IconVideo } from "../components/Icon/Icons";
import Post from "../components/post/Post";
import Images from "../Images/Images";
import "./Home.scss";

function Home() {
  return (
    <div className="home">
      <Header />
      <div className="content">
        <div className="left-side-bar">
          <div className="item">
            <Avatar
              sx={{ width: 36, height: 36 }}
              src={Images.user}
              style={{ marginLeft: "5px" }}
            ></Avatar>
            <div className="text">Nguyễn Thế Đức</div>
          </div>
          <div className="item">
            <img
              src={Images.friend}
              alt=""
              style={{ width: "36px", height: "auto", marginLeft: "5px" }}
            ></img>
            <div className="text">Bạn bè</div>
          </div>
          <div className="item">
            <img
              src={Images.messenger2}
              alt=""
              style={{ width: "36px", height: "auto", marginLeft: "5px" }}
            ></img>
            <div className="text">Tin nhắn</div>
          </div>
        </div>
        <div className="right-side-bar">
          <div className="contact">Người liên hệ</div>
          <div className="item">
            <Avatar
              sx={{ width: 36, height: 36 }}
              src={Images.user}
              style={{ marginLeft: "5px" }}
            ></Avatar>
            <div className="text">Nguyễn Thế Đức</div>
          </div>
          <div className="item">
            <Avatar
              sx={{ width: 36, height: 36 }}
              src={Images.user}
              style={{ marginLeft: "5px" }}
            ></Avatar>
            <div className="text">Nguyễn Thế Đức</div>
          </div>
          <div className="item">
            <Avatar
              sx={{ width: 36, height: 36 }}
              src={Images.user}
              style={{ marginLeft: "5px" }}
            ></Avatar>
            <div className="text">Nguyễn Thế Đức</div>
          </div>
          <div className="item">
            <Avatar
              sx={{ width: 36, height: 36 }}
              src={Images.user}
              style={{ marginLeft: "5px" }}
            ></Avatar>
            <div className="text">Nguyễn Thế Đức</div>
          </div>
          <div className="item">
            <Avatar
              sx={{ width: 36, height: 36 }}
              src={Images.user}
              style={{ marginLeft: "5px" }}
            ></Avatar>
            <div className="text">Nguyễn Thế Đức</div>
          </div>
        </div>
        <div className="posts">
          <div className="container">
            <div className="create-post">
              <div className="top">
                <Avatar src={Images.user}></Avatar>
                <div className="input">Nguyễn ơi, bạn đang nghĩ gì thế?</div>
              </div>
              <div className="bottom">
                <div className="button">
                  <IconImage />
                  <div>Ảnh</div>
                </div>
                <div className="button">
                  <IconVideo />
                  <div>Video</div>
                </div>
              </div>
            </div>
            <div className="post-list">
              <Post/>
              <Post/>
              <Post/>
              <Post/>
              <Post/>
              <Post/>
              <Post/>
              <Post/>
              <Post/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
