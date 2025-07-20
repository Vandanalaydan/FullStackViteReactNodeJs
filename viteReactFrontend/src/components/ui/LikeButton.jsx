import React, { useEffect, useState } from "react";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { useToggleVideoLikeMutation, useGetLikedVideosQuery } from "../../store/apiSlice";
import toast from "react-hot-toast";

const LikeButton = ({ videoId }) => {
  const [isLiked, setIsLiked] = useState(false);

  const { data: likedVideos, refetch } = useGetLikedVideosQuery();
  const [toggleLike, { isLoading }] = useToggleVideoLikeMutation();

  // Set initial liked state
  useEffect(() => {
    if (likedVideos?.data) {
      const liked = likedVideos.data.some(item => item.likedVideo._id === videoId);
      setIsLiked(liked);
    }
  }, [likedVideos, videoId]);

  const handleToggle = async () => {
    try {
      const res = await toggleLike(videoId).unwrap();
      setIsLiked(res.data.liked);
      toast.success(res.message);
      refetch(); // Optional: keep cache in sync
    } catch (err) {
      toast.error("Failed to toggle like");
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-1 text-lg px-2 py-1 rounded-md 
        ${isLiked ? "text-blue-600" : "text-gray-600"} 
        hover:text-blue-500 transition`}
      disabled={isLoading}
    >
      {isLiked ? <AiFillLike size={20} /> : <AiOutlineLike size={20} />}
       <span>{isLiked ? "Liked" : "Like"}</span>
    </button>
  );
};

export default LikeButton;
