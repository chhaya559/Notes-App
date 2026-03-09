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
    // ------------------------- Save Note : Create -------------------------
    saveNote: builder.mutation<any, any>({
      query: (body) => ({
        url: "/notes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notes"],
    }),
    // ------------------------- Get Notes : Read  -------------------------
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
    // ------------------------- Edit Note : Update  -------------------------
    update: builder.mutation<any, any>({
      query: (body) => ({
        url: `/Notes/${body.id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Notes"],
    }),
    // ----------------------------- Get Note by Id --------------------------------
    getNoteById: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/Notes/${id}`,
        method: "GET",
      }),
    }),
    // ------------------------- Delete Note : Delete ----------------------------
    delete: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/Notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),
    // -------------------------- Search Note ----------------------------------
    searchNotes: builder.query<any, string>({
      query: (text) => `/Notes?search=${text}`,
    }),
    // ------------------------- Ai Summary -------------------------
    aiSummary: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `Notes/${id}/generate-summary`,
        method: "POST",
      }),
    }),
    // ------------------------- Note Unlock -------------------------
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
    // ------------------------- Note Lock -------------------------
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
    // ------------------------- Change Password - notes -------------------------
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/users/change-common-password",
        method: "POST",
        body: data,
      }),
    }),
    // ------------------------- Get Notifications -------------------------
    getNotifications: builder.query<
      any,
      { pageNumber: number; pageSize: number }
    >({
      query: ({ pageNumber = 1, pageSize = 20 }) => ({
        url: "/notifications",
        method: "GET",
        params: { pageNumber, pageSize },
      }),
      providesTags: ["Notifications"],
    }),
    // ------------------------- Read Notification -------------------------
    markNoificationRead: builder.mutation({
      query: ({ id }) => ({
        url: `/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["NotificationCount", "Notifications"],
    }),
    // ------------------------- Get Notifications Count -------------------------
    getNotificationsCount: builder.query({
      query: () => ({
        url: "/notifications/unread-count",
        method: "GET",
      }),
      providesTags: ["NotificationCount"],
    }),
    // ------------------------- Read All Notifications -------------------------
    readAllNotification: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PUT",
      }),
      invalidatesTags: ["NotificationCount", "Notifications"],
    }),
    // ------------------------- Clear All Notifications --------------------------
    clearAllNotification: builder.mutation<void, void>({
      query: () => ({
        url: "/notifications/clear-all",
        method: "DELETE",
      }),
      invalidatesTags: ["NotificationCount", "Notifications"],
    }),
    // ------------------------- Delete Notification -------------------------
    deleteNotification: builder.mutation({
      query: ({ id }) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NotificationCount", "Notifications"],
    }),
    // ------------------------- Get Single Notification by Id -------------------------
    getNotificationById: builder.mutation({
      query: ({ id }) => ({
        url: `/notifications/${id}`,
        method: "GET",
      }),
    }),
    // ------------------------- File upload - notes -------------------------
    uploadFile: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/Notes/upload-file",
        method: "POST",
        body,
      }),
    }),
    // ------------------------- Lock Remove --------------------------------
    RemoveLock: builder.mutation({
      query: ({ id }) => ({
        url: `/Notes/${id}/unlock-protection`,
        method: "POST",
      }),
      invalidatesTags: ["Notes"],
    }),
    // ------------------------- File Remove(*) ---------------------------------
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
  useLazyGetNoteByIdQuery,
} = noteApi;
