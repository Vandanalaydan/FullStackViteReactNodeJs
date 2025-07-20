import {React} from "react";
import { Link } from "react-router-dom";
import { useGetVideosQuery } from "../store/apiSlice"; // Replace with actual hook
import CommentsSection from "../components/ui/comment";
import Sidebar from "../layouts/SideBar";

export default function VideoList() {
  const { data, isLoading, isError } = useGetVideosQuery(); // Your custom hook here

  if (isLoading) return <p>Loading videos...</p>;
  if (isError || !data?.data?.videos) return <p>Failed to load videos.</p>;

  const videos = data.data.videos;

  return (
    //  <div className="flex min-h-screen">
    //       <Sidebar />
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video._id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-all overflow-hidden"
          >
            <video
              src={video.videoFile}
              poster={video.thumbnail}
              controls
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{video.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{video.description}</p>

              <div className="mt-3 flex items-center gap-3">
                <img
                  src={video.ownerInfo.avatar}
                  alt="Owner Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <Link
        to={`/users/c/${video.ownerInfo.username}`}
        className="inline-block mt-3 text-blue-600 hover:underline"
      >
        <p className="text-sm font-medium">{video.ownerInfo.fullName}</p>
      </Link>
                 
                  <p className="text-xs text-gray-500">@{video.ownerInfo.username}</p>
                   
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-500">
                <p>Views: {video.views}</p>
                <p>Duration: {video.duration.toFixed(1)} sec</p>
                {/* video detail button */}
                   <Link
        to={`/videos/${video._id}`}
        className="inline-block mt-3 text-blue-600 hover:underline"
      >
        View Details
      </Link>
      
                 {/* video detail button */}

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    // </div>
  );
}
