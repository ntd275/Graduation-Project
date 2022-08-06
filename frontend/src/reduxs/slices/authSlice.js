import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        needUpdate: false,
    },
    reducers: {
        updateAuthState: (state, action) => {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
});

export const { updateAuthState } = authSlice.actions;

export default authSlice.reducer;
