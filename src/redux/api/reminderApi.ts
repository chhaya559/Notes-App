import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/index";

export const reminderApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl:
      "https://uninitiated-jerrold-coverable.ngrok-free.dev/api/reminders",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  reducerPath: "reminderApi",
  endpoints: (builder) => ({
    setReminder: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
    }),
    updateReminder: builder.mutation({
      query: (data) => ({
        url: "/",
        body: data,
        method: "PUT",
      }),
    }),
    getReminderById: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),

    deleteReminder: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useDeleteReminderMutation,
  useGetReminderByIdQuery,
  useSetReminderMutation,
  useUpdateReminderMutation,
} = reminderApi;
