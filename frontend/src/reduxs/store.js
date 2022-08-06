import { configureStore } from "@reduxjs/toolkit";
import postReducer from "./slices/postSlice";
import authReducer from "./slices/authSlice";
import friendRequestReducer from "./slices/friendRequestSlice";
import chatReducer from "./slices/chatSlice";
import searchReducer from "./slices/searchSlice";

export default configureStore({
    reducer: {
        post: postReducer,
        auth: authReducer,
        friendRequest: friendRequestReducer,
        chat: chatReducer,
        search: searchReducer,
    },
});
