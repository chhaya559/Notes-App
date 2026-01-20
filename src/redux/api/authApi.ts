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
    login: builder.mutation<
      {
        success: boolean;
        data: { email: string; token: string };
        message: string;
      },
      { identifier: string; password: string }
    >({
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
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleMutation,
  useGuestMutation,
} = authApi;
