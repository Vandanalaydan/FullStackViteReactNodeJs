import React, { useState } from 'react';
import { useAddCommentMutation, useGetCommentsQuery } from '../../store/apiSlice';
import { FiSend } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";
import toast from 'react-hot-toast';

const CommentsSection = ({ videoId }) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const { data, isLoading: isLoadingComments, isError, refetch } = useGetCommentsQuery({ videoId });
  const [addComment, { isLoading: isAddingComment }] = useAddCommentMutation();

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await addComment({ videoId, content: commentText }).unwrap();
      setCommentText("");
      toast.success("Comment added successfully!", { icon: '✅' });
      refetch();
      setShowComments(true);
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment. Try again.", { icon: '❌' });
    }
  };

  const comments = data?.data?.comments || [];
  const total = data?.data?.totalComments || 0;

  return (
    <div className="comments w-full max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md mt-6">
      {/* Comment Input */}
      <form
        onSubmit={handleAddComment}
        className="flex items-center gap-2 mb-4 border p-2 rounded-full shadow-sm"
      >
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow outline-none px-4 py-2 rounded-full text-sm bg-transparent"
        />
        <button
          type="submit"
          disabled={isAddingComment}
          className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-2 rounded-full hover:scale-105 transition-transform duration-200 disabled:opacity-50"
        >
          {isAddingComment ? (
            <ImSpinner2 className="w-5 h-5 animate-spin" />
          ) : (
            <FiSend className="w-5 h-5" />
          )}
        </button>
      </form>

      {/* Comments Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xl font-semibold">
          {total} Comments 
        </h3>
        <button
          onClick={() => setShowComments((prev) => !prev)}
          className="text-sm text-blue-500 hover:underline"
        >
          {showComments ? "Hide Comments" : "Show Comments"}
        </button>
      </div>

      {/* Comment List */}
      {showComments && (
        <div className="space-y-4 mt-4">
          {isLoadingComments && <p className="text-gray-500">Loading comments...</p>}
          {isError && <p className="text-red-500">Failed to load comments.</p>}
          {!isLoadingComments && comments.length === 0 && (
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          )}
          {!isLoadingComments && comments.length > 0 && comments.map((comment) => (
            <div
              key={comment._id}
              className="flex items-start gap-3 bg-gray-50 p-3 rounded-md border"
            >
              {/* Avatar */}
              <img
                src={comment.owner.avatar || '/default-avatar.png'}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              {/* Comment content */}
              <div className="flex flex-col">
                <p className="font-semibold text-sm">{comment.owner.fullName}</p>
                <p className="text-sm mt-1">{comment.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
