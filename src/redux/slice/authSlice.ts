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
  isCommonPasswordSet: boolean;
  isNotesUnlocked: boolean;
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
  isCommonPasswordSet: false,
  isNotesUnlocked: false,
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
        isCommonPasswordSet: boolean;
        isNotesUnlocked: boolean;
      }>,
    ) => {
      state.identifier = action.payload.identifier;
      state.token = action.payload.token;
      state.profileImageUrl = action.payload.profileImageUrl;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.username = action.payload.username;
      state.isCommonPasswordSet = action.payload.isCommonPasswordSet;
      state.isNotesUnlocked = action.payload.isNotesUnlocked;
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
      state.isCommonPasswordSet = false;
      state.isNotesUnlocked = false;
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
        isCommonPasswordSet: boolean;
        isNotesUnlocked: boolean;
      }>,
    ) => {
      state.identifier = action.payload.email;
      state.token = action.payload.token;
      state.profileImageUrl = action.payload.profileImageUrl;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.username = action.payload.username;
      state.isCommonPasswordSet = action.payload.isCommonPasswordSet;
      state.isNotesUnlocked = action.payload.isNotesUnlocked;
    },
    google: (
      state,
      action: PayloadAction<{
        token: string;
        email: string;
        firstName: string | null;
        profileImageUrl: string | null;
        isCommonPasswordSet: boolean;
        isNotesUnlocked: boolean;
      }>,
    ) => {
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.isCommonPasswordSet = action.payload.isCommonPasswordSet;
      state.isNotesUnlocked = action.payload.isNotesUnlocked;

      state.profileImageUrl = action.payload.profileImageUrl;
    },
    guest: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
      state.isGuest = true;
    },
    edit: (
      state,
      action: PayloadAction<{
        firstName: string;
        lastName: string;
        username: string;
      }>,
    ) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.username = action.payload.username;
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

export const { login, logout, register, google, guest, conversion, edit } =
  authSlice.actions;
export default authSlice.reducer;
