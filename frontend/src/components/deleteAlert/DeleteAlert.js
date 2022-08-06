import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from '@mui/material/Button';

function DeleteAlert({open, onClose, onConfirm, title}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            disableScrollLock={true}
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogActions>
                <Button variant="outlined" onClick={onClose}>Hủy</Button>
                <Button variant="contained" onClick={onConfirm} autoFocus>
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteAlert;
