import { createSlice } from "@reduxjs/toolkit";

export const friendRequestSlice = createSlice({
    name: "friendRequest",
    initialState: {
        sendFriendRequestList: [],
    },
    reducers: {
        updateFriendRequestState: (state, action) => {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
});

export const { updateFriendRequestState } = friendRequestSlice.actions;

export default friendRequestSlice.reducer;
