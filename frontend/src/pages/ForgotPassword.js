import { Alert } from "@mui/material";
import React, { useState } from "react";
import Loading from "../components/loading/Loading";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.scss";
import { useSnackbar } from 'notistack';
import Api from "../api/Api";
import { validatePassword } from "../utils/PasswordUtils";

function ForgotPassword() {
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [otpToken, setOtpToken] = useState("");
    const [otp, setOtp] = useState("");
    const [accessToken, setAccessToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordAgain, setNewPasswordAgain] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const searchEmail = async () => {
        setIsLoading(true);
        try {
            const res = await Api.sendOTP(email);
            console.log(res);
            setOtpToken(res.data.otpToken);
            setError("");
            setIsLoading(false);
            setStep(step + 1);
        } catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.message ||
                    "Có lỗi xảy ra khi tìm kiếm. Xin vui lòng thử lại."
            );
            setIsLoading(false);
        }
    };

    const checkOtp = async () => {
        setIsLoading(true);
        try {
            const res = await Api.checkOTP(otpToken, otp);
            console.log(res);
            setAccessToken(res.data.accessToken);
            setError("");
            setIsLoading(false);
            setStep(step + 1);
        } catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.message ||
                    "Có lỗi xảy ra khi kiểm tra OTP. Xin vui lòng thử lại."
            );
            setIsLoading(false);
        }
    };

    const changePassword = async () => {
        if (validatePassword(newPassword)) {
            setError(validatePassword(newPassword));
            return;
        }
        if (newPassword !== newPasswordAgain) {
            setError("Mật khẩu mới và nhập lại mật khẩu mới không giống nhau");
            return;
        }
        setIsLoading(true);
        try {
            const res = await Api.forgetPassword(accessToken, newPassword);
            console.log(res);
            setError("");
            setIsLoading(false);
            enqueueSnackbar("Đổi mật khẩu thành công", {variant: "success"})
            navigate("/login");
        } catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.message ||
                    "Có lỗi xảy ra khi đặt mật khẩu mới. Xin vui lòng thử lại."
            );
            setIsLoading(false);
        }
    }

    const getContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="forgot-password-form">
                        <div className="title">Tìm tài khoản của bạn</div>
                        <div className="divider"></div>
                        <div className="hint">
                            Vui lòng nhập email để tìm kiếm tài khoản của bạn
                        </div>
                        <div className="input">
                            <input
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {error !== "" && (
                            <Alert
                                severity="error"
                                className="mt-8"
                                onClose={() => setError("")}
                            >
                                {error}
                            </Alert>
                        )}
                        <div className="divider"></div>
                        <div className="action">
                            <div
                                className="btn btn-cancel"
                                onClick={() => navigate("/login")}
                            >
                                Hủy
                            </div>
                            <div
                                className="btn btn-next"
                                onClick={() => searchEmail()}
                            >
                                Tìm kiếm
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="forgot-password-form">
                        <div className="title">Nhập mã bảo mật</div>
                        <div className="divider"></div>
                        <div className="hint">
                            Vui lòng kiểm tra mã trong email của bạn
                        </div>
                        <div className="input">
                            <input
                                placeholder="Nhập mã"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        {error !== "" && (
                            <Alert
                                severity="error"
                                className="mt-8"
                                onClose={() => setError("")}
                            >
                                {error}
                            </Alert>
                        )}
                        <div className="divider"></div>
                        <div className="action">
                            <div
                                className="btn btn-cancel"
                                onClick={() => navigate("/login")}
                            >
                                Hủy
                            </div>
                            <div
                                className="btn btn-next"
                                onClick={() => checkOtp()}
                            >
                                Tiếp tục
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="forgot-password-form">
                        <div className="title">Đặt mật khẩu mới</div>
                        <div className="divider"></div>
                        <div className="hint">
                            Xin hãy đặt lại mật khẩu cho tài khoản của bạn
                        </div>
                        <div className="input">
                            <input
                                placeholder="Nhập mật khẩu mới"
                                type={"password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="input mt-8">
                            <input
                                type={"password"}
                                placeholder="Nhập lại mật khẩu mới"
                                value={newPasswordAgain}
                                onChange={(e) => setNewPasswordAgain(e.target.value)}
                            />
                        </div>
                        {error !== "" && (
                            <Alert
                                severity="error"
                                className="mt-8"
                                onClose={() => setError("")}
                            >
                                {error}
                            </Alert>
                        )}
                        <div className="divider"></div>
                        <div className="action">
                            <div
                                className="btn btn-cancel"
                                onClick={() => navigate("/login")}
                            >
                                Hủy
                            </div>
                            <div
                                className="btn btn-next"
                                onClick={() => changePassword()}
                            >
                                Hoàn thành
                            </div>
                        </div>
                    </div>
                );
            default:
                return <></>;
        }
    };

    return (
        <div className="forgot-password-page">
            <Loading open={isLoading} />
            <div className="forgot-password-container">{getContent()}</div>
        </div>
    );
}

export default ForgotPassword;
