import React, { useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { IconClose2 } from "../Icon/Icons";
import { Alert, TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import "./Register.scss";
import Loading from "../loading/Loading";
import Api from "../../api/Api";
import { useSnackbar } from "notistack";
import { validateEmail, validatePassword } from "../../utils/PasswordUtils";

function Register({ open, onClose }) {
    const [birthday, setBirthday] = useState(new Date());
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [gender, setGender] = useState(true);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [passwordErr, setPasswordErr] = useState("");
    const [passwordAgainErr, setPasswordAgainErr] = useState("");
    const [emailErr, setEmailErr] = useState("");
    const register = async () => {
        if (
            passwordErr ||
            passwordAgainErr ||
            emailErr ||
            password === "" ||
            name === "" ||
            email === ""
        ) {
            return;
        }
        setIsLoading(true);
        try {
            const account = {
                name: name,
                email: email,
                password: password,
                gender: gender,
                dateOfBirth: birthday,
            };
            const res = await Api.register(account);
            console.log(res);
            setIsLoading(false);
            enqueueSnackbar("Tạo tài khoản thành công", { variant: "success" });
            onClose();
        } catch (err) {
            console.log(err);
            setError(
                err?.response?.data?.message ||
                    "Có lỗi xảy ra khi đăng ký. Xin vui lòng thử lại."
            );
            setIsLoading(false);
        }
    };

    const closeDialog = (_e, reason) => {
        if (reason === "backdropClick") {
            return;
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={closeDialog}>
            <Loading open={isLoading} />
            <DialogTitle>
                <div className="register-modal-title">
                    <div className="title-text">Đăng ký</div>
                    <div className="btn-close" onClick={() => onClose()}>
                        <IconClose2 />
                    </div>
                </div>
            </DialogTitle>
            <div className="register-modal">
                <TextField
                    className="input"
                    label="Họ và tên"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    className="input"
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (!validateEmail(e.target.value)) {
                            setEmailErr("Sai định dạng email");
                        } else {
                            setEmailErr("");
                        }
                    }}
                    error={emailErr !== ""}
                    helperText={emailErr}
                />
                <TextField
                    className="input"
                    label="Mật khẩu"
                    variant="outlined"
                    type="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordErr(validatePassword(e.target.value));
                    }}
                    error={passwordErr !== ""}
                    helperText={passwordErr}
                />
                <TextField
                    className="input"
                    label="Nhập lại mật khẩu"
                    variant="outlined"
                    type="password"
                    value={passwordAgain}
                    onChange={(e) => {
                        setPasswordAgain(e.target.value);
                        if (e.target.value !== password) {
                            setPasswordAgainErr("Mật khẩu nhập lại không đúng");
                        } else {
                            setPasswordAgainErr("");
                        }
                    }}
                    error={passwordAgainErr !== ""}
                    helperText={passwordAgainErr}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDatePicker
                        label="Sinh nhật"
                        inputFormat="dd/MM/yyyy"
                        value={birthday}
                        onChange={(value) => setBirthday(value)}
                        maxDate={new Date()}
                        renderInput={(params) => (
                            <TextField {...params} className="input" />
                        )}
                    />
                </LocalizationProvider>
                <div className="gender">Giới tính</div>
                <RadioGroup
                    row
                    name="row-radio-buttons-group"
                    value={gender}
                    onChange={(e) => setGender(e.target.value === "true")}
                >
                    <FormControlLabel
                        value={true}
                        control={<Radio />}
                        label="Nam"
                    />
                    <FormControlLabel
                        value={false}
                        control={<Radio />}
                        label="Nữ"
                    />
                </RadioGroup>
                {error !== "" && (
                    <Alert
                        severity="error"
                        className="mt-8"
                        onClose={() => setError("")}
                    >
                        {error}
                    </Alert>
                )}
                <div className="btn-save" onClick={() => register()}>
                    Đăng ký
                </div>
            </div>
        </Dialog>
    );
}

export default Register;
