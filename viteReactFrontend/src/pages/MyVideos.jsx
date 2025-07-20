import React from 'react';
import { useGetCurrentUserVideosQuery } from '../store/apiSlice';
import VideoCard from '../components/ui/VideoCard';

const MyVideos = () => {
 const { data: responseData, error, isLoading } = useGetCurrentUserVideosQuery({ page: 1, limit: 10 });

if (isLoading) return <p>Loading...</p>;
if (error) return <p className="text-red-500">Failed to load videos</p>;

const { videos = [], totalPages = 1, currentPage = 1 } = responseData?.data || {};

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">My Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.isArray(videos) && videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
};

export default MyVideos;
