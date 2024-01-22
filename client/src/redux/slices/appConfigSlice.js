import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

export const getMyInfo = createAsyncThunk("user/getMyInfo", async () => {
    try { 
        const data = await axiosClient.get('/user/getMyInfo');
        return data.result;
    } catch (e) {
        return Promise.reject(e);
    }
})

export const updateMyProfile = createAsyncThunk("user/updateMyProfile", async (body) => {
    try {
        const data = await axiosClient.put('/user/', body);
        return data.result;
    } catch (e) {
        return Promise.reject(e);
    }
});

const appConfigSlicer = createSlice({
    name: 'appConfigSlicer',
    initialState: {
        isLoading: false,
        myProfile: {},
        toastData: {}
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        showToast: (state,action) => {
            state.toastData = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMyInfo.fulfilled, (state, action) => {
            state.myProfile = action.payload.user
        });
        builder.addCase(updateMyProfile.fulfilled, (state, action) => {
            state.myProfile = action.payload.user
        });
    }

})

export default appConfigSlicer.reducer;
export const { setLoading, showToast} = appConfigSlicer.actions;