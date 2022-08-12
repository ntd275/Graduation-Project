import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
    name: "post",
    initialState: {
        needRefreshPost: [],
        isOpenPostDetail: false,
        notificationList: [],
    },
    reducers: {
        updatePostState: (state, action) => {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
});

export const { updatePostState } = postSlice.actions;

export default postSlice.reducer;
