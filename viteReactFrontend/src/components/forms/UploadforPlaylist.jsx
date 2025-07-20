import React, { useState } from "react";
import { useUploadVideoMutation, useAddVideoToPlaylistMutation } from "../../store/apiSlice";
import { useParams, useNavigate } from "react-router-dom";

const UploadAndAttachVideo = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const [uploadVideo, { isLoading: isUploading }] = useUploadVideoMutation();
  const [addVideoToPlaylist] = useAddVideoToPlaylistMutation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!videoFile || !title) {
      alert("Please provide at least a video file and title.");
      return;
    }

    const formData = new FormData();
    formData.append("videoFile", videoFile);
    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
    formData.append("title", title);
    formData.append("description", description);

    try {
      // Step 1: Upload video
      const response = await uploadVideo(formData).unwrap();
      const videoId = response?.data?._id;

      if (!videoId) throw new Error("Failed to get uploaded video ID.");

      // Step 2: Add video to playlist
      await addVideoToPlaylist({ videoId, playlistId });

      alert("Video uploaded and added to playlist!");
      navigate(`/playlist/${playlistId}`); // redirect to playlist page
    } catch (err) {
      console.error("Error during upload/attach:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Upload and Add to Playlist</h2>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          placeholder="Video Title"
          className="w-full border px-3 py-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Video Description"
          className="w-full border px-3 py-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div>
          <label className="block mb-1 font-medium">Video File</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Thumbnail (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnailFile(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isUploading ? "Uploading..." : "Upload & Add to Playlist"}
        </button>
      </form>
    </div>
  );
};

export default UploadAndAttachVideo;
