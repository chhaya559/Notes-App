import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthState = {
  identifier: string | null;
  token: string | null;
  isGuest: boolean;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  profileImageUrl: string | null;
};
const initialState: AuthState = {
  identifier: null,
  token: null,
  isGuest: false,
  username: null,
  firstName: null,
  lastName: null,
  email: null,
  profileImageUrl: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        identifier: string;
        token: string;
        profileImageUrl: string;
        email: string;
        firstName: string;
        lastName: string;
        username: string;
      }>,
    ) => {
      state.identifier = action.payload.identifier;
      state.token = action.payload.token;
      state.profileImageUrl = action.payload.profileImageUrl;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.username = action.payload.username;
    },
    logout: (state) => {
      state.identifier = null;
      state.token = null;
      state.isGuest = false;
      state.username = null;
      state.firstName = null;
      state.lastName = null;
      state.email = null;
      state.profileImageUrl = null;
    },

    register: (
      state,
      action: PayloadAction<{
        email: string;
        token: string;
        profileImageUrl: string;
        firstName: string;
        lastName: string;
        username: string;
      }>,
    ) => {
      state.identifier = action.payload.email;
      state.token = action.payload.token;
      state.profileImageUrl = action.payload.profileImageUrl;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.username = action.payload.username;
    },
    google: (
      state,
      action: PayloadAction<{
        token: string;
        email: string;
        firstName: string | null;
        profileImageUrl: string | null;
      }>,
    ) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.profileImageUrl = action.payload.profileImageUrl;
    },
    guest: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.isGuest = true;
    },
    conversion: (
      state,
      action: PayloadAction<{
        email: string;
        firstName: string;
        lastName: string;
        username: string;
      }>,
    ) => {
      state.identifier = action.payload.email;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.username = action.payload.username;
    },
  },
});

export const { login, logout, register, google, guest, conversion } =
  authSlice.actions;
export default authSlice.reducer;
