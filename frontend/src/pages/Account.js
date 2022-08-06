import {
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Api from "../api/Api";
import Header from "../components/header/Header";
import Loading from "../components/loading/Loading";
import { updateAuthState } from "../reduxs/slices/authSlice";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "./Account.scss";

function Account() {
    const [account, setAccount] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const auth = useSelector((state) => state.auth);
    const [isEditName, setIsEditName] = useState(false);
    const [isEditAddress, setIsEditAddress] = useState(false);
    const [isEditGender, setIsEditGender] = useState(false);
    const [isEditDateOfBirth, setIsEditDateOfBirth] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useDispatch();

    useEffect(() => {
        getAccountInfo();
    }, [auth.accountId]);

    const getAccountInfo = async () => {
        try {
            const res = await Api.getAccount(auth.accountId);
            setAccount(res.data.result);
            setIsLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    const editName = async () => {
        if (!isEditName) {
            setIsEditName(true);
            return;
        }
        try {
            await Api.editAccount(auth.accountId, account);
            const res2 = await Api.refreshToken();
            localStorage.setItem("accessToken", res2.data.accessToken);
            dispatch(
                updateAuthState({
                    needUpdate: !auth.needUpdate,
                })
            );
            enqueueSnackbar("Sửa thông tin thành công", {
                variant: "success",
            });
            setIsEditName(false);
        } catch (e) {
            console.log(e);
        }
    };

    const editAddress = async () => {
        if (!isEditAddress) {
            setIsEditAddress(true);
            return;
        }
        try {
            await Api.editAccount(auth.accountId, account);
            const res2 = await Api.refreshToken();
            localStorage.setItem("accessToken", res2.data.accessToken);
            dispatch(
                updateAuthState({
                    needUpdate: !auth.needUpdate,
                })
            );
            enqueueSnackbar("Sửa thông tin thành công", {
                variant: "success",
            });
            setIsEditAddress(false);
        } catch (e) {
            console.log(e);
        }
    };

    const editGender = async () => {
        if (!isEditGender) {
            setIsEditGender(true);
            return;
        }
        try {
            await Api.editAccount(auth.accountId, account);
            const res2 = await Api.refreshToken();
            localStorage.setItem("accessToken", res2.data.accessToken);
            dispatch(
                updateAuthState({
                    needUpdate: !auth.needUpdate,
                })
            );
            enqueueSnackbar("Sửa thông tin thành công", {
                variant: "success",
            });
            setIsEditGender(false);
        } catch (e) {
            console.log(e);
        }
    };

    const editDateOfBirth = async () => {
        if (!isEditDateOfBirth) {
            setIsEditDateOfBirth(true);
            return;
        }
        try {
            await Api.editAccount(auth.accountId, account);
            const res2 = await Api.refreshToken();
            localStorage.setItem("accessToken", res2.data.accessToken);
            dispatch(
                updateAuthState({
                    needUpdate: !auth.needUpdate,
                })
            );
            enqueueSnackbar("Sửa thông tin thành công", {
                variant: "success",
            });
            setIsEditDateOfBirth(false);
        } catch (e) {
            console.log(e);
        }
    };

    const change = (e, key) => {
        setAccount({ ...account, [key]: e.target.value });
    };

    return (
        <div className="account-page">
            <Header />
            <Loading open={isLoading} />
            <Container maxWidth="sm" className="container">
                <div className="title">Thông tin tài khoản</div>
                <div className="field">
                    <div className="label">Tên</div>
                    <TextField
                        id="outlined-name"
                        value={account.name}
                        fullWidth
                        disabled={!isEditName}
                        onChange={(e) => change(e, "name")}
                    />
                    <Button
                        variant="outlined"
                        className="btn"
                        onClick={editName}
                    >
                        {isEditName ? "Lưu" : "Sửa"}
                    </Button>
                </div>
                <div className="field">
                    <div className="label">Email</div>
                    <TextField
                        id="outlined-name"
                        value={account.email}
                        fullWidth
                        disabled={true}
                        style={{ marginRight: 84 }}
                    />
                </div>
                <div className="field">
                    <div className="label">Địa chỉ</div>
                    <TextField
                        id="outlined-name"
                        value={account.address}
                        fullWidth
                        disabled={!isEditAddress}
                        onChange={(e) => change(e, "address")}
                    />
                    <Button
                        variant="outlined"
                        className="btn"
                        onClick={editAddress}
                    >
                        {isEditAddress ? "Lưu" : "Sửa"}
                    </Button>
                </div>
                <div className="field">
                    <div className="label">Giới tính</div>
                    <FormControl fullWidth>
                        <Select
                            key={`${Math.random()}`}
                            value={account.gender}
                            defaultValue={account.gender}
                            onChange={(e) => change(e, "gender")}
                            disabled={!isEditGender}
                        >
                            <MenuItem value={1}>Nam</MenuItem>
                            <MenuItem value={0}>Nữ</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        variant="outlined"
                        className="btn"
                        onClick={editGender}
                    >
                        {isEditGender ? "Lưu" : "Sửa"}
                    </Button>
                </div>
                <div className="field">
                    <div className="label">Ngày sinh</div>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            maxDate={new Date()}
                            inputFormat="dd/MM/yyyy"
                            value={account.dateOfBirth}
                            disabled={!isEditDateOfBirth}
                            onChange={(value) => change({target: {value: value}},"dateOfBirth" )}
                            fullWidth
                            renderInput={(params) => (
                                <TextField fullWidth {...params} className="input" />
                            )}
                        />
                    </LocalizationProvider>
                    <Button
                        variant="outlined"
                        className="btn"
                        onClick={editDateOfBirth}
                    >
                        {isEditDateOfBirth ? "Lưu" : "Sửa"}
                    </Button>
                </div>
            </Container>
        </div>
    );
}

export default Account;
