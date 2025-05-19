import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null,
    role: null, // Add role as a separate field
  };
  

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            const user = action.payload;
            if (!user) return;
            console.log("Login Action Payload:", action.payload);
            state.status = true;
            state.userData = user; // Ensure userId is stored
            state.role = user.role || user.prefs?.role || "buyer"; // Default to buyer if role is missing
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.role = null;
        },
    },
});



export const {login,logout} = authSlice.actions;

export default authSlice.reducer;
