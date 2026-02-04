import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/index";

export const noteApi = createApi({
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
  tagTypes: ["Notes", "Notifications", "NotificationCount"],
  reducerPath: "noteApi",
  endpoints: (builder) => ({
    set: builder.mutation({
      query: (data) => ({
        url: "/notes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notes"],
    }),
    get: builder.query<any, void>({
      query: () => ({
        url: "/notes",
        method: "GET",
      }),
      providesTags: ["Notes"],
    }),
    update: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/notes/${id}`,
        body: body,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${id}`,
        },
      }),
      invalidatesTags: ["Notes"],
    }),
    getNoteById: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/notes/${id}`,
        method: "GET",
      }),
    }),

    delete: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/notes/${id}`,
        body: body,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${id}`,
        },
      }),
      invalidatesTags: ["Notes"],
    }),
    searchNotes: builder.query<any, string>({
      query: (text) => `/notes?search=${text}`,
    }),

    aiSummary: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `notes/${id}/generate-summary`,
        method: "POST",
      }),
    }),
    unlockNote: builder.mutation<
      any,
      { id: string; password: string; unlockMinutes: number }
    >({
      query: ({ id, ...body }) => ({
        url: `notes/${id}/unlock`,
        method: "POST",
        body,
      }),
    }),
    noteLock: builder.mutation<
      any,
      { id: string; isPasswordProtected: boolean; password: string }
    >({
      query: ({ id, ...body }) => ({
        url: `notes/${id}/lock`,
        method: "POST",
        body,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/users/change-common-password",
        method: "POST",
        body: data,
      }),
    }),
    getNotifications: builder.query({
      query: () => ({
        url: "/notifications",
        method: "GET",
        // params: { pageNumber, pageSize },
      }),
      providesTags: ["Notifications"],
    }),
    markNoificationRead: builder.mutation({
      query: ({ id }) => ({
        url: `/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["NotificationCount", "Notifications"],
    }),
    getNotificationsCount: builder.query({
      query: () => ({
        url: "/notifications/unread-count",
        method: "GET",
      }),
      providesTags: ["NotificationCount"],
    }),
    readAllNotification: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PUT",
      }),
      invalidatesTags: ["NotificationCount", "Notifications"],
    }),
    clearAllNotification: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/clear-all",
        method: "DELETE",
      }),
      invalidatesTags: ["NotificationCount", "Notifications"],
    }),
    getNotificationById: builder.mutation({
      query: ({ id }) => ({
        url: `/notifications/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useUpdateMutation,
  useGetQuery,
  useDeleteMutation,
  useSetMutation,
  useSearchNotesQuery,
  useGetNoteByIdQuery,
  useAiSummaryMutation,
  useUnlockNoteMutation,
  useNoteLockMutation,
  useChangePasswordMutation,
  useGetNotificationsCountQuery,
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useMarkNoificationReadMutation,
  useClearAllNotificationMutation,
  useReadAllNotificationMutation,
  useGetNotificationByIdMutation,
} = noteApi;
