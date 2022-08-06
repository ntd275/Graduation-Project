import React, { useState } from "react";
import "./ChangePassword.scss";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { IconClose2 } from "../Icon/Icons";
import Api from "../../api/Api";
import { useSnackbar } from "notistack";
import Loading from "../loading/Loading";
import { useSelector, useDispatch } from "react-redux";
import { Button, TextField } from "@mui/material";
import { validatePassword } from "../../utils/PasswordUtils";

function ChangePasswordModal({ open, onClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const auth = useSelector((state) => state.auth);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordAgain, setNewPasswordAgain] = useState("");
    const [oldPasswordErr, setOldPasswordErr] = useState("");
    const [newPasswordErr, setNewPasswordErr] = useState("");
    const [newPasswordAgainErr, setNewPasswordAgainErr] = useState("");

    const closeDialog = (_e, reason) => {
        if (reason === "backdropClick") {
            return;
        }
        onClose();
    };

    const getTitle = () => {
        return "Đổi mật khẩu";
    };

    const getButtonTitle = () => {
        return "Đổi";
    };

    const changePassword = async () => {
        const err = validatePassword(newPassword);
        if (err !== "") {
            setNewPasswordErr(err);
            return;
        }
        if (newPasswordAgain !== newPassword) {
            return;
        }
        try {
            const res = await Api.changePassword(oldPassword, newPassword);
            if(!res.data.success) {
                setOldPasswordErr(res.data.message);
            } else {
                closeDialog();
                enqueueSnackbar("Đổi mật khẩu thành công", {variant: "success"})
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Dialog open={open} onClose={closeDialog}>
            <DialogTitle>
                <div className="post-modal-title">
                    <div className="title-text">{getTitle()}</div>
                    <div className="btn-close" onClick={() => onClose()}>
                        <IconClose2 />
                    </div>
                </div>
            </DialogTitle>
            <Loading open={isLoading} />
            <div className="change-password-modal">
                <TextField
                    variant="outlined"
                    label="Mật khẩu cũ"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    fullWidth
                    style={{ marginTop: 10 }}
                    type="password"
                    error={oldPasswordErr !== ""}
                    helperText={oldPasswordErr}
                />
                <TextField
                    variant="outlined"
                    label="Mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => {
                        setNewPassword(e.target.value);
                        setNewPasswordErr(validatePassword(e.target.value));
                    }}
                    fullWidth
                    style={{ marginTop: 10 }}
                    type="password"
                    error={newPasswordErr !== ""}
                    helperText={newPasswordErr}
                />
                <TextField
                    variant="outlined"
                    label="Nhập lại mật khẩu mới"
                    value={newPasswordAgain}
                    onChange={(e) => {
                        setNewPasswordAgain(e.target.value);
                        if (e.target.value !== newPassword) {
                            setNewPasswordAgainErr(
                                "Mật khẩu nhập lại không giống"
                            );
                        } else {
                            setNewPasswordAgainErr("");
                        }
                    }}
                    fullWidth
                    style={{ marginTop: 10 }}
                    type="password"
                    error={newPasswordAgainErr !== ""}
                    helperText={newPasswordAgainErr}
                />
                <Button
                    fullWidth
                    variant="contained"
                    style={{ marginTop: 10 }}
                    onClick={() => changePassword()}
                >
                    {getButtonTitle()}
                </Button>
            </div>
        </Dialog>
    );
}

export default ChangePasswordModal;
