import axios from "axios";
const baseUrl = "http://20.212.104.107:3001";

const guest = axios.create({ timeout: 30000 });
guest.defaults.withCredentials = true;

const user = axios.create({ timeout: 30000 });
user.interceptors.request.use(
    function (config) {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers["x-access-token"] = accessToken;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

user.interceptors.response.use(
    function (response) {
        return response;
    },
    async function (error) {
        const originalRequest = error.config;
        if (
            !originalRequest.retry &&
            error.response &&
            error.response.status === 401
        ) {
            try {
                originalRequest.retry = true;
                const res = await Api.refreshToken();
                localStorage.setItem("accessToken", res.data.accessToken);
                console.log("Access token refreshed");
                return user(originalRequest);
            } catch (err) {
                localStorage.removeItem("accessToken");
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

const Api = {
    login: (email, password) => {
        return guest.post(`${baseUrl}/auth/login`, { email: email, password: password })
    },
    register: (account) => {
        return guest.post(`${baseUrl}/auth/register`, { ...account })
    },
    logout: () => {
        return guest.post(`${baseUrl}/auth/logout`);
    },
    refreshToken: () => {
        return guest.post(`${baseUrl}/auth/refresh-token`)
    },
    checkAuth: () => {
        return user.get(`${baseUrl}/auth/check-auth`)
    },
    changePassword: (oldPassword, newPassword) => {
        return user.post(`${baseUrl}/account/change-password`, {
            oldPassword: oldPassword,
            newPassword: newPassword
        })
    },
    sendOTP: (email) => {
        return guest.post(`${baseUrl}/auth/send-otp`, {
            email: email
        })
    },
    checkOTP: (otpToken, otp) => {
        return guest.post(`${baseUrl}/auth/check-otp`, {
            otpToken: otpToken,
            otp: otp
        })
    },
    forgetPassword: (accessToken, newPassword) => {
        return guest.post(`${baseUrl}/auth/forget-password`, {
            newPassword: newPassword,
            token: accessToken,
        })
    },
    uploadImage: (image) => {
        const data = new FormData();
        data.append("image", image)
        return user.post(`${baseUrl}/utils/upload-image/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    uploadVideo: (video) => {
        const data = new FormData();
        data.append("video", video)
        return user.post(`${baseUrl}/utils/upload-video/`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    getPostsInNewFeed: () => {
        return user.get(`${baseUrl}/post/get-post-in-new-feed`);
    },
    getPostInProfile: (accountId) => {
        return user.get(`${baseUrl}/post/get-post-in-profile/${accountId}`);
    },
    createPost: (post) => {
        return user.post(`${baseUrl}/post`, post);
    },
    editPost: (id, post) => {
        return user.put(`${baseUrl}/post/${id}`,post);
    },
    deletePost: (id) => {
        return user.delete(`${baseUrl}/post/${id}`);
    },
    like: (id) => {
        return user.post(`${baseUrl}/like/like`, {postId: id});
    },
    unLike: (id) => {
        return user.post(`${baseUrl}/like/unlike`, {postId: id});
    },
    getLikes: (id) => {
        return user.post(`${baseUrl}/like/get-like`, {postId: id});
    },
    getPostById: (id) => {
        return user.get(`${baseUrl}/post/${id}`);
    },
    getCommentByPostId: (id) => {
        return user.get(`${baseUrl}/comment/get-by-post-id/${id}`);
    },
    createComment: (postId, comment) => {
        return user.post(`${baseUrl}/comment`, {postId: postId, comment: comment});
    },
    editComment: (id, comment) => {
        return user.put(`${baseUrl}/comment/${id}`,{comment: comment});
    },
    deleteComment: (id) => {
        return user.delete(`${baseUrl}/comment/${id}`);
    },
    getShareByPostId: (postId) => {
        return user.post(`${baseUrl}/share/get-share-by-post-id/`,{postId: postId});
    },
    getAccount: (id) => {
        return user.get(`${baseUrl}/account/${id}`);
    },
    editAccount: (id, data) => {
        return user.put(`${baseUrl}/account/${id}`,data);
    },
    getFriendRequestList: () => {
        return user.get(`${baseUrl}/friend-request/`);
    },
    getSendFriendRequestList: () => {
        return user.get(`${baseUrl}/friend-request/send`);
    },
    sendFriendRequest: (accountId) => {
        return user.post(`${baseUrl}/friend-request/`,{accountId: accountId});
    },
    cancelFriendRequest: (accountId) => {
        return user.post(`${baseUrl}/friend-request/delete`,{accountId: accountId});
    },
    acceptFriendRequest: (accountId) => {
        return user.post(`${baseUrl}/friend-request/accept`,{accountId: accountId});
    },
    refuseFriendRequest: (accountId) => {
        return user.post(`${baseUrl}/friend-request/refuse`,{accountId: accountId});
    },
    getFriendList: (accountId) => {
        return user.get(`${baseUrl}/friend/friend-list/${accountId}`);
    },
    getSuggestFriend: () => {
        return user.get(`${baseUrl}/friend/suggest-list/`);
    },
    unFriend: (accountId) => {
        return user.post(`${baseUrl}/friend/unfriend/`,{accountId: accountId});
    },
    getConversationList: () => {
        return user.get(`${baseUrl}/conversation`);
    },
    createConversation: (accountId) => {
        return user.post(`${baseUrl}/conversation`, {accountId: accountId});
    },
    deleteConversation: (conversationId) => {
        return user.post(`${baseUrl}/conversation/delete`, {conversationId: conversationId});
    },
    getMessageList: (conversationId) => {
        return user.post(`${baseUrl}/message/get-list`, {conversationId: conversationId});
    },
    createMessage: (conversationId, message) => {
        return user.post(`${baseUrl}/message/create`, {conversationId: conversationId, message: message});
    },
    recallMessage: (messageId) => {
        return user.post(`${baseUrl}/message/recall`, {messageId: messageId});
    },
    createMessageCall: (conversationId, callDuration) => {
        return user.post(`${baseUrl}/message/call`, {conversationId: conversationId, callDuration: callDuration});
    },
    searchPeople: (name) => {
        return user.post(`${baseUrl}/account/search`, {name: name});
    },
    searchPost: (keyword) => {
        return user.post(`${baseUrl}/post/search`, {keyword: keyword});
    },
}

export {baseUrl};
export default Api;