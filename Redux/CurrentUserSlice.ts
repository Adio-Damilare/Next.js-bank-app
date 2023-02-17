import { createSlice } from "@reduxjs/toolkit";

const currentUser=createSlice({
    name:"CurrentUser",
    initialState:{
        details:undefined,
    },
    reducers:{
        AddDetails:(state,action)=>{
            state.details=action.payload
        }
    }
})

export const {AddDetails} =currentUser.actions;
export default currentUser.reducer