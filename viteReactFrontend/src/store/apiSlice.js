import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/v1", // change if needed
    credentials: "include", // for sending cookies
  }),
  tagTypes: ["User", "Video","Playlist"],
  endpoints: (builder) => ({
    // Register user
   registerUser: builder.mutation({
  query: (formData) => ({
    url: "/users/register",
    method: "POST",
    body: formData,
    credentials: "include",
  }),
}),
    // Login user
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/users/login",
        method: "POST",
        body: data,
      }),
    }),
    //Logout user
    logoutUser: builder.mutation({
      query: () => ({
        url: '/users/logout',
        method: 'POST',
      }),
    }),
   
   // Change Password
changePassword: builder.mutation({
  query: (formData) => ({
    url: "/users/change-password",
    method: "POST",
    body:formData,
  }),
  invalidatesTags: ["User"],
}),

  
    // Update user account
    updateAccount: builder.mutation({
      query: (formData) => ({
        url: "/users/update-account",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
       // ✅ Update avatar
    updateAvatar: builder.mutation({
      query: (formData) => ({
        url: "/users/avatar",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
       // ✅ Update avatar
    updateCoverImage: builder.mutation({
      query: (formData) => ({
        url: "/users/coverImage",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    // Get current user
    getUser: builder.query({
      query: () => "/users/current-user",
      providesTags: ["User"],
    }),
    getChannelProfile: builder.query({
  query: (username) => `/users/c/${username}`,
}),

 // Get My videos
 getCurrentUserVideos: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => 
        `/videos/user/videos?page=${page}&limit=${limit}`,
      providesTags: ['Video'],
    }),

    getCurrentChannelVideos: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => 
        `/videos/channel/videos?page=${page}&limit=${limit}`,
      providesTags: ['Video'],
    }),

    // Get all videos
    getVideos: builder.query({
      query: () => "/videos/",
      providesTags: ["Video"],
    }),

      //getVideo By videoId
      getVideoById: builder.query({
  query: (videoId) => `/videos/${videoId}`,
}),

   // Upload video
    uploadVideo: builder.mutation({
      query: (formData) => ({
        url: "/videos/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Video"],

    

    }),



    //playlist
    // Playlist endpoints
getUserPlaylists: builder.query({
  query: (userId) => `/playlist/user/${userId}`,
  providesTags: ["Playlist"],
}),
getPlaylistById: builder.query({
  query: (playlistId) => `/playlist/${playlistId}`,
  providesTags: ["Playlist"],
}),
createPlaylist: builder.mutation({
  query: (data) => ({
    url: "/playlist/",
    method: "POST",
    body: data,
  }),
  invalidatesTags: ["Playlist"],
}),
updatePlaylist: builder.mutation({
  query: ({ playlistId, data }) => ({
    url: `/playlist/${playlistId}`,
    method: "PATCH",
    body: data,
  }),
  invalidatesTags: ["Playlist"],
}),
deletePlaylist: builder.mutation({
  query: (playlistId) => ({
    url: `/playlist/${playlistId}`,
    method: "DELETE",
    
  }),
  invalidatesTags: ["Playlist","User"],
}),
addVideoToPlaylist: builder.mutation({
  query: ({ videoId, playlistId }) => ({
    url: `/playlist/add/${videoId}/${playlistId}`,
    method: "PATCH",
  }),
  invalidatesTags: ["Playlist"],
}),
removeVideoFromPlaylist: builder.mutation({
  query: ({ videoId, playlistId }) => ({
    url: `/playlist/remove/${videoId}/${playlistId}`,
    method: "PATCH",
  }),
  invalidatesTags: ["Playlist"],
}),

    
    // Subscriptions
toggleSubscription: builder.mutation({
  query: (channelId) => ({
    url: `/subscriptions/c/${channelId}`,
    method: "POST",
  }),
}),
getUserChannelSubscribers: builder.query({
  query: (channelId) => `/subscriptions/u/${channelId}`,
  providesTags: ["User"],
}),

getSubscribedChannels: builder.query({
  query: (channelId) => `/subscriptions/c/${channelId}`,
  providesTags: ["User"],
}),
getSubscriptionStatus: builder.query({
  query: (channelId) => `/subscriptions/status/${channelId}`,
  providesTags:["User"],
}),

//  Comments // Inside endpoints: (builder) => ({
// ...existing endpoints

addComment: builder.mutation({
  query: ({ videoId, content }) => ({
    url: `/comments/${videoId}`,
    method: "POST",
    body: { content },
  }),
  invalidatesTags: ["Video"],
}),
 getVideoStats: builder.query({
      query: (videoId) => `/videos/${videoId}/stats`,
    }),

//comments//
getComments: builder.query({
  query: ({ videoId, page = 1, limit = 10 }) => ({
    url: `/comments/${videoId}`,
    params: { page, limit },
  }),
  providesTags: (result, error, { videoId }) => [
    { type: "Comments", id: videoId },
  ],
}),
//likes 
 toggleVideoLike: builder.mutation({
      query: (videoId) => ({
        url: `/likes/toggle/v/${videoId}`,
        method: "POST",
      }),
    }),
    getLikedVideos: builder.query({
      query: () => `/likes/videos`,
    }),



}),
  });

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
 useUploadVideoMutation,
 useChangePasswordMutation,
  useUpdateAccountMutation,
   useUpdateAvatarMutation,
   useUpdateCoverImageMutation,
  useGetUserQuery,
  useGetChannelProfileQuery,
   useGetCurrentUserVideosQuery,
   useGetCurrentChannelVideosQuery,
   useGetVideosQuery,
   useGetVideoByIdQuery,
   useGetUserPlaylistsQuery,
useGetPlaylistByIdQuery,
useCreatePlaylistMutation,
useUpdatePlaylistMutation,
useDeletePlaylistMutation,
useAddVideoToPlaylistMutation,
useRemoveVideoFromPlaylistMutation,
useToggleSubscriptionMutation,
useGetUserChannelSubscribersQuery,
useGetSubscribedChannelsQuery,
useGetSubscriptionStatusQuery,
 useGetVideoStatsQuery,
 useAddCommentMutation,
  useGetCommentsQuery,
   useToggleVideoLikeMutation,
  useGetLikedVideosQuery,


} = apiSlice;
