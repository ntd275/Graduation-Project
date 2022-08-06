import { Alert } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Api from "../api/Api";
import Loading from "../components/loading/Loading";
import Register from "../components/register/Register";
import "./Login.scss";
import jwt_decode from "jwt-decode";
import { updateAuthState } from "../reduxs/slices/authSlice";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [registerOpen, setRegisterOpen] = useState(false);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            navigate("/");
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const login = async () => {
        setIsLoading(true);
        try {
            const res = await Api.login(email, password);
            console.log(res);
            localStorage.setItem("accessToken", res.data.accessToken);
            const decoded = jwt_decode(res.data.accessToken);
            dispatch(updateAuthState({...decoded, needUpdate: true}));
            setIsLoading(false);
            navigate("/");
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            setError(err?.response?.data?.message || "Có lỗi xảy ra khi đăng nhập. Xin vui lòng thử lại.")
        };
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="intro">
                    <div className="logo">hola</div>
                    <div className="text">
                        Hola giúp bạn kết nối và chia sẻ với mọi người trong
                        cuộc sống của bạn.
                    </div>
                </div>
                <div className="login-form">
                    <div className="username input">
                        <input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="password input">
                        <input
                            placeholder="Mật khẩu"
                            type={"password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error !== "" && <Alert severity="error" className="mt-8" onClose={() => setError("")}>{error}</Alert>}
                    <div className="btn-login" onClick={() => login()}>
                        Đăng nhập
                    </div>
                    <div className="forget-password" onClick={() => navigate("/forgot-password")}>Quên mật khẩu</div>
                    <div className="divider"></div>
                    <div className="create-account" onClick={() => setRegisterOpen(true)}>Tạo tài khoản mới</div>
                </div>
            </div>
            {registerOpen && <Register open={registerOpen} onClose={() => {setRegisterOpen(false)}}/>}
            <Loading open={isLoading}/>
        </div>
    );
}

export default Login;
