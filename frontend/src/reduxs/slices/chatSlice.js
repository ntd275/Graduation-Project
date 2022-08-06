import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
    name: "chat",
    initialState: {
        conversationList: [],
        chatList: [],
        chatMinimumList: [],
        needUpdateChatList: [],
        activateUser: [],
        isCallOpen: false,
        callMode: "",
        opponentPeerId: "",
        opponentId: "",
        needUpdateConversationList: false,
        openConversationList: false,
        isVideoOff: false,
    },
    reducers: {
        updateChatState: (state, action) => {
            return {
                ...state,
                ...action.payload,
            };
        },
    },
});

export const { updateChatState } = chatSlice.actions;

export default chatSlice.reducer;
