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
  reducerPath: "noteApi",
  endpoints: (builder) => ({
    set: builder.mutation({
      query: (data) => ({
        url: "/notes",
        method: "POST",
        body: data,
      }),
    }),
    get: builder.query<any[], void>({
      query: () => ({
        url: "/notes",
        method: "GET",
      }),
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
    }),
    searchNotes: builder.query<any, string>({
      query: (text) => `/notes?search=${text}`,
    }),

    aiSummary: builder.query<{ summary: string }, { id: string }>({
      query: ({ id }) => `notes/${id}/generate-summary`,
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
  useAiSummaryQuery,
} = noteApi;
