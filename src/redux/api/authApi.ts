import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/index";
export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://cloudnotes.clashhub.online/api",
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = (getState() as RootState).auth.token;

      // Skip auth for reset notes password
      if (endpoint !== "resetNotesPassword" && token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  reducerPath: "authApi",
  endpoints: (builder) => ({
    // ------------------------- Login -------------------------
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    // ------------------------- Register -------------------------
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    // ------------------------- Logout  -------------------------
    logout: builder.mutation({
      query: (fcmToken) => ({
        url: "/auth/logout",
        method: "POST",
        body: fcmToken,
      }),
    }),
    // ------------------------- Set Profile Image -------------------------
    profileImage: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/users/me/profile-image",
        method: "POST",
        body,
      }),
    }),
    // ------------------------- Remove Profile Image -------------------------
    deleteImage: builder.mutation<void, void>({
      query: () => ({
        url: "/users/me/profile-image",
        method: "DELETE",
      }),
    }),
    // ------------------------- Google Login  -------------------------
    google: builder.mutation({
      query: (data) => ({
        url: "/auth/google",
        method: "POST",
        body: data,
      }),
    }),
    // ------------------------- Guest Login -------------------------
    guest: builder.mutation<any, void>({
      query: () => ({
        url: "/auth/guest",
        method: "POST",
      }),
    }),
    // ------------------------- Forgot Password - user : send email -------------------------
    forgotpassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    // ------------------------- Change Password - user -------------------------
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
    // ------------------------- Reset Password - user -------------------------
    resetPassword: builder.mutation<
      any,
      { newPassword: string; token: string }
    >({
      query: ({ newPassword, token }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { newPassword },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    // ------------------------- Guest Conversion -------------------------
    guestConversion: builder.mutation({
      query: (data) => ({
        url: "/auth/convert-guest",
        method: "POST",
        body: data,
      }),
    }),
    // ------------------------- Edit User Profile -------------------------
    editUser: builder.mutation({
      query: (data) => ({
        url: "/users/me",
        method: "PUT",
        body: data,
      }),
    }),
    // ------------------------- Delete User Account -------------------------
    deleteUser: builder.mutation({
      query: () => ({
        url: "/users/me",
        method: "DELETE",
      }),
    }),
    // ------------------------- User Read -------------------------
    getUser: builder.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
    }),
    // ------------------------- Forgot Password - notes : send email -------------------------
    forgotNotesPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-notes-password",
        method: "POST",
        body: data,
      }),
    }),
    // ------------------------- Reset Password - notes -------------------------
    resetNotesPassword: builder.mutation<
      any,
      { newNotesPassword: string; token: string }
    >({
      query: ({ newNotesPassword, token }) => ({
        url: "/auth/reset-notes-password",
        method: "POST",
        body: { newNotesPassword },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      extraOptions: {
        skipAuth: true,
      },
    }),
    // --------------------- Push notifications registration : FCM send --------------
    pushNotification: builder.mutation({
      query: (data) => ({
        url: "/push/register",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleMutation,
  useGuestMutation,
  useForgotpasswordMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
  useGuestConversionMutation,
  useDeleteUserMutation,
  useEditUserMutation,
  useGetUserQuery,
  usePushNotificationMutation,
  useProfileImageMutation,
  useDeleteImageMutation,
  useResetNotesPasswordMutation,
  useForgotNotesPasswordMutation,
  useLogoutMutation,
} = authApi;
