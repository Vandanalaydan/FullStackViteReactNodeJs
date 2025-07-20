import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDeletePlaylistMutation, useGetPlaylistByIdQuery } from "../store/apiSlice";

const PlaylistActions = () => {
 const { playlistId } = useParams();
  const navigate = useNavigate();


  const { data, isLoading: loadingPlaylist } = useGetPlaylistByIdQuery(playlistId);
    
    
  
 const playlist= data?.data;
 

  // const userId = playlist?.user?._id; // ✅ Get actual user ID from nested object

  const [deletePlaylist, { isLoading }] = useDeletePlaylistMutation();

  const handleDelete = async () => {
   // if (!userId) return alert("User not found.");

    if (window.confirm("Are you sure you want to delete this playlist?")) {
      try {
        await deletePlaylist(playlistId).unwrap();
        alert("Playlist deleted successfully!");
        navigate(`/playlist/user/${playlist.owner}`); // ✅ Correct navigation
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete playlist.");
      }
    }
  };

  if (loadingPlaylist) return <p>Loading...</p>;

  return (
    <button
      onClick={handleDelete}
      disabled={isLoading}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
    >
      {isLoading ? "Deleting..." : "Delete Playlist"}
    </button>
  );
};

export default PlaylistActions;
