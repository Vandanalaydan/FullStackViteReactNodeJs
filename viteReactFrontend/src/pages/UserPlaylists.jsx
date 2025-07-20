import React, { useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { useGetUserPlaylistsQuery } from "../store/apiSlice";
import { Button } from "../components/ui/button";

const UserPlaylists = () => {
  const { userId } = useParams();
  const navigate=useNavigate()

 
  const {
    data,
    isLoading,
    isError,
    refetch, // 🔥 Add this
  } = useGetUserPlaylistsQuery(userId);
  

  useEffect(() => {
    // Optional: force refetch on mount
    refetch();
  }, [refetch]);

  if (isLoading) return <p className="text-center mt-10">Loading playlists...</p>;
  if (isError) return <p className="text-center text-red-600 mt-10">Failed to fetch playlists.</p>;

  const playlists = data?.data || [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Playlists</h2> <Button onClick={() => navigate("/playlist/")}>
       CreatePlaylist
      </Button>

      {playlists.length === 0 ? (
        <p className="text-gray-600">You have no playlists yet.</p>
      ) : (
        <ul className="space-y-4">
          {playlists.map((playlist) => (
            <li key={playlist._id} className="border p-4 rounded shadow hover:bg-gray-50 transition">
              <a
                href={`/playlist/${playlist._id}`}
                className="text-xl font-semibold text-blue-600 hover:underline"
              >
                {playlist.name}
              </a>
              <p className="text-gray-600">{playlist.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserPlaylists;
