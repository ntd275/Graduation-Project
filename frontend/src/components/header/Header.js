import React, { useRef, useState } from "react";
import Images from "../../Images/Images";
import "./header.scss";
import { Search } from "@mui/icons-material";
import { Avatar, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import StyledMenu from "../styledMenu/StyledMenu";
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import Api, { baseUrl } from "../../api/Api";
import ChangePasswordModal from "../changePassword/ChangePassword";
import LockIcon from '@mui/icons-material/Lock';

function Header() {
    const navigate = useNavigate();
    const auth = useSelector(state => state.auth);
    const arrowDownRef = useRef();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    const closeMenu = () => {
        setIsMenuOpen(false);
    }

    const logOut = () => {
        Api.logout();
        localStorage.removeItem("accessToken");
        navigate("/login");
    }

    return (
        <div className="header">
            <div className="logo">
                <img src={Images.logo} alt="logo" className="logo-img" onClick={() => navigate("/")} />
            </div>
            <div className="search">
                <div className="search-icon">
                    <Search color="action" />
                </div>
                <input
                    className="search-input"
                    placeholder="Tìm kiếm trên Hola"
                />
            </div>
            <div className="right-menu">
                <Avatar src={auth.avatar ? `${baseUrl}/${auth.avatar}` : Images.defaultAvatar} onClick={() => navigate(`/profile/${auth.accountId}`)}/>
                <div className="user-name"  onClick={() => navigate(`/profile/${auth.accountId}`)}>{auth.name}</div>
                <Avatar
                    sx={{ bgcolor: "#e4e6eb" }}
                    style={{ marginLeft: "20px" }}
                >
                    <img
                        alt=""
                        src={Images.messenger}
                        style={{ width: "24px", height: "auto" }}
                    />
                </Avatar>
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
                    onClick={() => {setIsMenuOpen(true)}}
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
                            navigate("/account")
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
                    <MenuItem onClick={() => {
                        closeMenu();
                        logOut();
                    }}>
                        <LogoutIcon />
                        Đăng xuất
                    </MenuItem>
                </StyledMenu>
                {isChangePasswordOpen && <ChangePasswordModal open={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)}/>}
            </div>
        </div>
    );
}

export default Header;
