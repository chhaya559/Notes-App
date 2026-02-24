import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store/index";

export const noteApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://cloudnotes.clashhub.online/api",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["Notes", "Notifications", "NotificationCount"],
  reducerPath: "noteApi",
  endpoints: (builder) => ({
    saveNote: builder.mutation<any, any>({
      query: (body) => ({
        url: "/notes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notes"],
    }),
    get: builder.query<any, { pageNumber?: number; pageSize: number }>({
      query: ({ pageNumber, pageSize }) => ({
        url: "/Notes",
        method: "GET",
        params: {
          pageNumber,
          pageSize,
        },
      }),
      providesTags: ["Notes"],
    }),
    update: builder.mutation<any, any>({
      query: (body) => ({
        url: `/Notes/${body.id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Notes"],
    }),

    getNoteById: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/Notes/${id}`,
        method: "GET",
      }),
    }),

    delete: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/Notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),

    searchNotes: builder.query<any, string>({
      query: (text) => `/Notes?search=${text}`,
    }),

    aiSummary: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `Notes/${id}/generate-summary`,
        method: "POST",
      }),
    }),
    unlockNote: builder.mutation<
      any,
      { password: string; unlockMinutes: number }
    >({
      query: (body) => ({
        url: `Notes/unlock`,
        method: "POST",
        body,
      }),
    }),
    noteLock: builder.mutation<
      any,
      { id: string; isPasswordProtected: boolean; password?: string }
    >({
      query: ({ id, isPasswordProtected, password }) => ({
        url: `Notes/${id}/lock`,
        method: "POST",
        body: { isPasswordProtected, password },
      }),
      invalidatesTags: ["Notes"],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/users/change-common-password",
        method: "POST",
        body: data,
      }),
    }),
    getNotifications: builder.query<
      any,
      { pageNumber: number; pageSize: number }
    >({
      query: ({ pageNumber = 1, pageSize = 10 }) => ({
        url: "/notifications",
        method: "GET",
        params: { pageNumber, pageSize },
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
    deleteNotification: builder.mutation({
      query: ({ id }) => ({
        url: `/notifications/${id}`,
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
    uploadFile: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/Notes/upload-file",
        method: "POST",
        body,
      }),
    }),
    RemoveLock: builder.mutation({
      query: ({ id }) => ({
        url: `/Notes/${id}/unlock-protection`,
        method: "POST",
      }),
      invalidatesTags: ["Notes"],
    }),
    removeFile: builder.mutation({
      query: ({ id, fileUrl }) => ({
        url: `/Notes/${id}/files`,
        method: "DELETE",
        body: { fileUrl },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useUpdateMutation,
  useGetQuery,
  useDeleteMutation,
  useSaveNoteMutation,
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
  useUploadFileMutation,
  useRemoveFileMutation,
  useDeleteNotificationMutation,
  useRemoveLockMutation,
} = noteApi;
