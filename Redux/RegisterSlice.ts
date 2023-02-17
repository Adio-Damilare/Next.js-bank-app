import { createSlice } from "@reduxjs/toolkit";


const UserSlice = createSlice({
    name:"Register",
    initialState: { email:"",navState:false},
    reducers:{
        AddUser:(state,action)=>{
            state.email=action.payload
        },
        Reset:(state)=>{
            state.email=""
        },
       

    }

})

export const {AddUser,Reset}=UserSlice.actions;
export default UserSlice.reducer