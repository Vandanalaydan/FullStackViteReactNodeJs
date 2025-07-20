import React from "react";
import { useRemoveVideoFromPlaylistMutation } from "../store/apiSlice";

const RemoveVideoButton = ({ playlistId, videoId }) => {
  
  const [removeVideo, { isLoading }] = useRemoveVideoFromPlaylistMutation();

  const handleRemove = async () => {
    const confirm = window.confirm("Are you sure you want to remove this video from the playlist?");
    if (!confirm) return;

    try {
      await removeVideo({ playlistId, videoId }).unwrap();
      alert("Video removed successfully!");
    } catch (error) {
      console.error("Failed to remove video:", error);
      alert("Error removing video.");
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isLoading}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
    >
      {isLoading ? "Removing..." : "Remove from Playlist"}
    </button>
  );
};

export default RemoveVideoButton;
