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

    headers.delete("Content-Type");

    return headers;
  },
}),

  tagTypes: ["Notes", "Notifications", "NotificationCount"],
  reducerPath: "noteApi",
  endpoints: (builder) => ({
  saveNote: builder.mutation({
  query: (body) => ({
    url: "/notes",
    method: "POST",
    body,
  }),
  invalidatesTags : ["Notes"]
}),



    get: builder.query<any, void>({
      query: () => ({
        url: "/Notes",
        method: "GET",
      }),
      providesTags: ["Notes"],
    }),
    update: builder.mutation({
  query: ({ id, body }) => ({
    url: `/Notes/${id}`,
    method: "PUT",
    body,
  }),
  invalidatesTags : ["Notes"]
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
  invalidatesTags :["Notes"]
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
      { id: string; password: string; unlockMinutes: number }
    >({
      query: ({ id, ...body }) => ({
        url: `Notes/${id}/unlock`,
        method: "POST",
        body,
      }),
    }),
    noteLock: builder.mutation<
      any,
      { isPasswordProtected: boolean; password: string }
    >({
      query: ({ ...body }) => ({
        url: `Notes/lock`,
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
   uploadFile : builder.mutation<any,FormData>({
    query : (body) =>({
      url : "/Notes/upload-file",
      method : "POST",
      body,
    })
   })
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
  useUploadFileMutation
} = noteApi;
