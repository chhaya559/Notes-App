import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/index";
export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://uninitiated-jerrold-coverable.ngrok-free.dev/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  reducerPath: "authApi",
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    profileImage: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/users/me/profile-image",
        method: "POST",
        body,
      }),
    }),
    deleteImage: builder.mutation({
      query: () => ({
        url: "/users/me/profile-image",
        method: "DELETE",
      }),
    }),
    google: builder.mutation({
      query: (data) => ({
        url: "/auth/google",
        method: "POST",
        body: data,
      }),
    }),
    guest: builder.mutation<any, void>({
      query: () => ({
        url: "/auth/guest",
        method: "POST",
      }),
    }),
    forgotpassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
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

    guestConversion: builder.mutation({
      query: (data) => ({
        url: "/auth/convert-guest",
        method: "POST",
        body: data,
      }),
    }),
    editUser: builder.mutation({
      query: (data) => ({
        url: "/users/me",
        method: "PUT",
        body: data,
      }),
    }),
    deleteUser: builder.mutation({
      query: () => ({
        url: "/users/me",
        method: "DELETE",
      }),
    }),

    getUser: builder.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
    }),
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
} = authApi;
