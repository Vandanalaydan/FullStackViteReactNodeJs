import React from "react";
import { useForm } from "react-hook-form";
import { useAddVideoToPlaylistMutation } from "../../store/apiSlice";

const AddToPlaylist = () => {
  const { register, handleSubmit, reset } = useForm();
  const [addVideoToPlaylist, { isLoading, isSuccess, isError }] = useAddVideoToPlaylistMutation();

  const onSubmit = async (data) => {
    try {
      await addVideoToPlaylist({
        videoId: data.videoId,
        playlistId: data.playlistId,
      }).unwrap();
      alert("Video added to playlist successfully!");
      reset();
    } catch (error) {
      alert("Failed to add video to playlist.");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 bg-white shadow rounded-lg space-y-4"
    >
      <h2 className="text-xl font-semibold">Add Video to Playlist</h2>

      <div>
        <label className="block font-medium">Video ID</label>
        <input
          type="text"
          {...register("videoId", { required: true })}
          className="mt-1 block w-full border rounded p-2"
          placeholder="Enter video ID"
        />
      </div>

      <div>
        <label className="block font-medium">Playlist ID</label>
        <input
          type="text"
          {...register("playlistId", { required: true })}
          className="mt-1 block w-full border rounded p-2"
          placeholder="Enter playlist ID"
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add to Playlist"}
      </button>

      {isError && <p className="text-red-500">Failed to add video.</p>}
      {isSuccess && <p className="text-green-500">Video added successfully!</p>}
    </form>
  );
};

export default AddToPlaylist;
