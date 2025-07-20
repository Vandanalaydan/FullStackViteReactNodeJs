import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetVideoByIdQuery, useGetVideoStatsQuery } from "../store/apiSlice";
import CommentsSection from "../components/ui/comment";
import LikeButton from "../components/ui/LikeButton"; // Adjust path
import SubscribeButton from "../components/ui/SubscribeButton";

const VideoDetails = () => {
  const { videoId } = useParams();
  

  const {
    data: videoData,
    isLoading: videoLoading,
    error: videoError,
  } = useGetVideoByIdQuery(videoId);

  const {
    data: statsData,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useGetVideoStatsQuery(videoId);

  const video = videoData?.data;
  const stats = statsData?.data;

  useEffect(() => {
    // Optional: Refresh stats every 10 seconds
    const interval = setInterval(() => {
      refetchStats();
    }, 3000);

    return () => clearInterval(interval);
  }, [refetchStats]);

 

  if (videoLoading || statsLoading) return <div className="p-4">Loading...</div>;
  if (videoError || !video) return <div className="p-4 text-red-500">Error fetching video</div>;

  


  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>

      <video
        className="w-full h-80 rounded mb-4"
        src={video.videoFile}
        controls
        poster={video.thumbnail}
      />

      <div className="flex flex-col gap-2 mb-4">
        <p className="text-gray-700">
          <strong>Description:</strong> {video.description}
        </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
        <p className="text-sm text-gray-500">
          Duration: {video.duration.toFixed(2)} seconds
        </p>
        <p className="text-sm text-gray-500">
           {stats?.totalViews ?? video.views} Views
        </p>
        <p className="text-sm text-gray-500">
           {stats?.totalLikes ?? 0} Likes
        </p>
        <LikeButton videoId={video._id} refetchStats={refetchStats} />
        </div>
  

      <div className="flex items-center gap-4 mt-6">
        <img
          src={video.owner?.avatar}
          alt="Uploader Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{video.owner?.fullName}</p>
          <p className="text-sm text-gray-600">@{video.owner?.username}</p>
        </div>
         {/* <SubscribeButton
          channelId={channel._id}
          onToggle={handleSubscriptionToggle}
        />
          <p><strong>Subscribers:</strong> {subscriberCount}</p>*/}
      </div> 

      <CommentsSection videoId={video._id} />
    </div>
  );
};

export default VideoDetails;
