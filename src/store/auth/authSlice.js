import { createSlice } from "@reduxjs/toolkit";
import {
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  fetchCurrentUser,
} from "./authThunks";

const initialState = {
  user: null,
  session: null,
  status: "idle",
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      const { user, session } = action.payload;
      state.user = user || null;
      state.session = session || null;
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInWithEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.session = action.payload.session;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(signUpWithEmail.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.session = action.payload.session;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.user = null;
        state.session = null;
        state.status = "idle";
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.initialized = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.initialized = true;
      });
  },
});

export const { setAuthState } = authSlice.actions;
export default authSlice.reducer;
