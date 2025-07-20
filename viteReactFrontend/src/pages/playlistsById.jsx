import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetPlaylistByIdQuery } from "../store/apiSlice";
import PlaylistActions from "./Deleteplaylist";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import RemoveVideoButton from "./RemovePlaylistVideo";
  const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const { data, isLoading, isError } = useGetPlaylistByIdQuery(playlistId);
  const navigate=useNavigate();

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (isError || !data?.data) return <p className="text-center mt-10 text-red-600">Failed to load playlist.</p>;

  const playlist = data.data;
 
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-2">{playlist.name}</h2>
      <p className="text-gray-600 mb-4">{playlist.description}</p>
      <Button onClick={() => navigate(`/playlist/${playlist._id}/upload-video`)}>
             Upload 
            </Button>

      {/* update Playlist Button with Link */}
      <div className="mb-6">
        <Link
          to={`/playlist/${playlist._id}/update`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all duration-200"
        >
          Update
        </Link>
      </div>

    
         <PlaylistActions/>
      

      <h3 className="text-xl font-semibold mb-4">Videos</h3>
      {playlist.videos.length === 0 ? (
        <p className="text-gray-500">No videos in this playlist.</p>
      ) : (
        <ul className="space-y-4">
          {playlist.videos.map((video) => (

            <li
              key={video._id}
              className="border p-4 rounded-md shadow-sm bg-white hover:shadow transition"
            >
              <video
              src={video.videoFile}
              poster={video.thumbnail}
              controls
              className="w-full h-48 object-cover"
            />
            
              <h4 className="text-lg font-medium"
               onClick={() => navigate(`/videos/${video._id}`)}
              >{video.title}</h4>
              <p className="text-sm text-gray-500">{video.description}</p>
              <RemoveVideoButton playlistId={playlist._id} videoId={video._id} />

              
            </li>
          ))}
           
        </ul>
      )}
    
    </div>
  );
};

export default PlaylistDetails;
