import React from "react";
import { useForm } from "react-hook-form";
import { useUploadVideoMutation } from "../../store/apiSlice";

const UploadVideo = () => {
  const { register, handleSubmit, reset } = useForm();
  const [uploadVideo, { isLoading, isError, isSuccess }] = useUploadVideoMutation();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("videoFile", data.videoFile[0]);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("thumbnail", data.thumbnail[0]); // NEW FIELD

    try {
      await uploadVideo(formData).unwrap();
      alert("Video uploaded successfully!");
      reset();
    } catch (error) {
      alert("Upload failed.");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg space-y-4"
    >
      <h2 className="text-2xl font-bold">Upload Video</h2>

      <div>
        <label className="block font-medium">Video File</label>
        <input
          type="file"
          accept="video/*"
          {...register("videoFile", { required: true })}
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Thumbnail Image</label>
        <input
          type="file"
          accept="image/*"
          {...register("thumbnail", { required: true })}
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <label className="block font-medium">Title</label>
        <input
          type="text"
          {...register("title", { required: true })}
          className="mt-1 block w-full border rounded p-2"
          placeholder="Enter title"
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
        {isLoading ? "Uploading..." : "Upload Video"}
      </button>

      {isError && <p className="text-red-500">Upload failed. Try again.</p>}
      {isSuccess && <p className="text-green-500">Video uploaded successfully!</p>}
    </form>
  );
};

export default UploadVideo;
