import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { likeAndUnlikePost } from "./postSlice";

export const getFeedData = createAsyncThunk("user/getFeedData", async () => {
    try {
        const data = await axiosClient.get('/user/getFeedData');
        return data.result;
    } catch (e) {
        return Promise.reject(e);
    }
})
export const followAndUnfollowUser = createAsyncThunk("user/followAndUnfollow", async (body)=>{
    try {
       const data = await axiosClient.post('/user/follow', body);
        return data.result.user;
    } catch (e) {
        return Promise.reject(e);
    }
})
const feedSlice = createSlice({
    name: 'feedSlice',
    initialState: {
        feedData: {}
    },
    extraReducers: (builder) => {
        builder.addCase(getFeedData.fulfilled, (state, action) => {
            state.feedData = action.payload
        });
        builder.addCase(likeAndUnlikePost.fulfilled, (state, action) => {
            const post = action.payload;
            const index = state?.feedData?.posts?.findIndex(item => item._id == post._id);
            if(index != undefined && index != -1) {
                state.feedData.posts[index] =post
            }
        });
        builder.addCase(followAndUnfollowUser.fulfilled, (state, action) => {
            const user = action.payload;
            const index = state?.feedData?.followings?.findIndex(item => item._id == user._id);
            if(index !== -1) {
                state?.feedData?.followings?.splice(index, 1);
            } else {
                state?.feedData.followings.push(user);
            }
        });
    }

})

export default feedSlice.reducer;