import { createSlice } from "@reduxjs/toolkit";


const storedUser = JSON.parse(localStorage.getItem("user"));

const initialState = {
  status: !!storedUser ,
  userData: storedUser || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const user = action.payload;
      if (!user) return;
      state.status = true;

      state.userData = {
        ...user,
        role: user.role || user.prefs?.role || null, // fallback if role missing
      };

      localStorage.setItem("user", JSON.stringify(state.userData));

    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
      
       localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;



