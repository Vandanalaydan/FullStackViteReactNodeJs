import React, { useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  useGetPlaylistByIdQuery,
 useUpdatePlaylistMutation,
} from "../../store/apiSlice";

const UpdatePlaylistForm = () => {
  const { playlistId } = useParams();
  const navigate =useNavigate()

  const { data, isLoading: fetching, isError } = useGetPlaylistByIdQuery(playlistId);
  const [updatePlaylist, { isLoading: updating, isSuccess }] = useUpdatePlaylistMutation();

  const { register, handleSubmit, reset } = useForm();

  const playlist=data?.data;

  useEffect(() => {
    if (data?.data) {
      reset({
        name: data.data.name,
        description: data.data.description,
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData) => {
    try {
     await updatePlaylist({ playlistId, data: formData }).unwrap();
      alert("Playlist updated successfully!");
       navigate(`/playlist/user/${playlist.owner}`); //
    } catch (error) {
      alert("Update failed.");
      console.error(error);
    }
  };

  if (fetching) return <p className="text-center mt-10">Loading playlist...</p>;
  if (isError) return <p className="text-red-600 text-center mt-10">Failed to load playlist.</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Update Playlist</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input
            {...register("name", { required: true })}
            className="mt-1 block w-full border rounded p-2"
            placeholder="Playlist name"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="mt-1 block w-full border rounded p-2"
            placeholder="Playlist description"
          />
        </div>

        <button
          type="submit"
          disabled={updating}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {updating ? "Updating..." : "Update Playlist"}
        </button>

        {isSuccess && (
          <p className="text-green-500 text-sm mt-2">Playlist updated successfully!</p>
        )}
      </form>
    </div>
  );
};

export default UpdatePlaylistForm;
