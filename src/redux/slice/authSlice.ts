import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { THEME } from "@theme/constants";

export type AuthState = {
  identifier: string | null;
  token: string | null;
  isGuest: boolean;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  profileImageUrl: any;
  isCommonPasswordSet: boolean;
  isNotesUnlocked: boolean;
  notesUnlockUntil: number | null;
  isGoogle: boolean;
  theme: THEME;
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
  notesUnlockUntil: null,
  isGoogle: false,
  theme: THEME.DEVICE,
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
      state.isNotesUnlocked = false;
      state.notesUnlockUntil = null;
      state.profileImageUrl = null;
      state.isGoogle = false;
    },
    setTheme(state, action: PayloadAction<THEME>) {
      state.theme = action.payload;
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
    setCommonPasswordSet: (state, action: PayloadAction<boolean>) => {
      state.isCommonPasswordSet = action.payload;
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
      state.isGoogle = true;
    },
    guest: (
      state,
      action: PayloadAction<{ token: string; profileImageUrl: any }>,
    ) => {
      state.token = action.payload.token;
      state.isGuest = true;
      state.profileImageUrl = action.payload.profileImageUrl;
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
    setNotesUnlocked: (
      state,
      action: PayloadAction<{ unlockUntil: number }>,
    ) => {
      state.isNotesUnlocked = true;
      state.notesUnlockUntil = action.payload.unlockUntil;
    },
    profileImageUrl: (
      state,
      action: PayloadAction<{ profileImageUrl: any }>,
    ) => {
      state.profileImageUrl = action.payload.profileImageUrl;
    },

    lockNotes: (state) => {
      state.isNotesUnlocked = false;
      state.notesUnlockUntil = null;
    },
    isGuest: (state, action: PayloadAction<{ isGuest: boolean }>) => {
      state.isGuest = action.payload.isGuest;
    },
    conversion: (
      state,
      action: PayloadAction<{
        email: string;
        firstName: string;
        lastName: string;
        username: string;
        isGuest: boolean;
      }>,
    ) => {
      state.identifier = action.payload.email;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.username = action.payload.username;
      state.isCommonPasswordSet = false;
      state.isGuest = false;
    },
  },
});

export const {
  setNotesUnlocked,
  lockNotes,
  login,
  logout,
  register,
  google,
  guest,
  conversion,
  edit,
  setCommonPasswordSet,
  isGuest,
  profileImageUrl,
  setTheme,
} = authSlice.actions;
export default authSlice.reducer;
