import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { string } from "yup";

export type AuthState = {
  identifier: string | null;
  token: string | null;
  isGuest: boolean;
};
const initialState: AuthState = {
  identifier: null,
  token: null,
  isGuest: false,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ identifier: string; token: string }>,
    ) => {
      state.identifier = action.payload.identifier;
      state.token = action.payload.token;
    },
    logout: (state) => {
      ((state.identifier = null), (state.token = null));
    },
    register: (
      state,
      action: PayloadAction<{ email: string; token: string }>,
    ) => {
      state.identifier = action.payload.email;
      state.token = action.payload.token;
    },
    google: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    guest: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.isGuest = true;
    },
  },
});

export const { login, logout, register, google, guest } = authSlice.actions;
export default authSlice.reducer;
