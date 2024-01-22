import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

export const getUserProfile = createAsyncThunk("user/getUserProfile", async (body) => {
    try {
        const data = await axiosClient.post('/user/getUserProfile', body);
        return data.result;
    } catch (e) {
        return Promise.reject(e);
    }
})

export const likeAndUnlikePost =  createAsyncThunk('post/likeAndUnlike', async (body)=>{
    try {
        const data = await axiosClient.post('/posts/like', body);
        return data.result.post;
    } catch (e) {
        return Promise.reject(e);
    }
})

const postSlice = createSlice({
    name: 'postSlice',
    initialState: {
        userProfile: {}
    },
    extraReducers: (builder) => {
        builder.addCase(getUserProfile.fulfilled, (state, action) => {
            state.userProfile = action.payload
        });
        builder.addCase(likeAndUnlikePost.fulfilled, (state, action) => {
            const post = action.payload;
            const index = state?.userProfile?.posts?.findIndex(item => item._id == post._id);
            if(index != undefined && index != -1) {
                state.userProfile.posts[index] =post
            }
        });
    }

})

export default postSlice.reducer;