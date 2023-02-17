import {configureStore} from "@reduxjs/toolkit";
import UserSlice from "./RegisterSlice";
import currentUser from "./CurrentUserSlice";
export default configureStore({
    reducer:{
        Register:UserSlice,
        currentUser
    }
})
