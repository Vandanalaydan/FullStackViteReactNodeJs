import React from "react";
import { useForm } from "react-hook-form";
import { useCreatePlaylistMutation } from "../../store/apiSlice";
import { useNavigate } from "react-router-dom";

const CreatePlaylistForm = () => {

  const { register, handleSubmit, reset } = useForm();
  const [createPlaylist, {   isLoading, isError, isSuccess }] = useCreatePlaylistMutation();



  const navigate = useNavigate();

 const onSubmit = async (formData) => {
  try {
    const result = await createPlaylist(formData).unwrap();

    alert("Playlist created successfully!");
    reset();

    // Extract owner from the response: result.data.owner
    const userId = result.data.owner;
    if (userId) {
      navigate(`/playlist/user/${userId}`);
    } else {
      console.warn("Owner ID not found in response.");
    }
  } catch (error) {
    console.error("Error creating playlist:", error);
    alert("Creation failed.");
  }
};

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg space-y-4"
    >
      <h2 className="text-2xl font-bold">Create Playlist</h2>

      <div>
        <label className="block font-medium">Name</label>
        <input
          type="text"
          {...register("name", { required: true })}
          className="mt-1 block w-full border rounded p-2"
          placeholder="Enter playlist name"
        />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          {...register("description", { required: true })}
          className="mt-1 block w-full border rounded p-2"
          placeholder="Enter description"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create Playlist"}
      </button>

      {isError && <p className="text-red-500">Creation failed. Try again.</p>}
      {isSuccess && <p className="text-green-500">Playlist created successfully!</p>}
    </form>
  );
};

export default CreatePlaylistForm;
