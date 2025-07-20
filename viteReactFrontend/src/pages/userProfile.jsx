import { useGetUserQuery } from "../store/apiSlice";
import { useNavigate } from "react-router-dom";
import { useGetUserPlaylistsQuery } from "../store/apiSlice";
import { useGetVideosQuery } from "../store/apiSlice";


import { Button } from "../components/ui/button";
//import Sidebar from "../layouts/SideBar";

export default function UserProfile() {
  const { data, isLoading, isError } = useGetUserQuery();
 
  const navigate = useNavigate();

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data?.data) return <p>Failed to load user data.</p>;

  const user = data.data;
  //  const videos = data.data.videos;
  //  const playlists=data.data.playlists;
  // const videoId=data.data;
  // const playlistId=data.data;
  // const userId=data.data;

  return (
     <div className="flex min-h-screen">
    
      {/* Main content (right) */}
      <div className="flex-1 bg-white text-gray-800">
        {/* Cover Image */}
        <div className="w-full h-60 bg-gray-300 relative">
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          {/* Avatar */}
          <div className="absolute left-10 -bottom-12">
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-16 px-10">
          <h1 className="text-2xl font-semibold">{user.fullName}</h1>
          <p className="text-gray-600">@{user.username}</p>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => navigate("/users/update-account")}>
              Customize Profile
            </Button>
            <Button onClick={() => navigate(`/users/c/${user.username}`)}>
  Channel
</Button>
 <Button onClick={() => navigate("/videos/upload")}>
 Upload video
</Button>
 <Button onClick={() => navigate("/playlist/")}>
 CreatePlaylist
</Button>
 <Button onClick={() => navigate(`/playlists/add/${videos._id}/${playlists._id}`)}>
 Add Video to playlist
</Button>

<Button onClick={() => navigate( `/playlist/user/${user._id}`)}>
Playlists
</Button>
<Button onClick={() => navigate( `/subscriptions/u/${user._id}`)}>
Subscribers
</Button>
<Button onClick={() => navigate( `/subscriptions/c/${user._id}`)}>
Subscribed channels
</Button>

</div>


            
          

          {/* Post Box Placeholder */}
          <div className="mt-10 border rounded-md p-4 shadow-sm bg-gray-50">
            <p className="font-medium mb-2">Share a sneak peek of your next post</p>
            <div className="flex gap-4">
              <Button variant="outline">🖼️ Image</Button>
              <Button variant="outline">📊 Poll</Button>
              <Button variant="outline">📄 Text</Button>
              <Button variant="outline">🎥 Video</Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-10 border-b flex gap-8 text-gray-600 font-medium">
            <button className="border-b-2 border-black pb-2">Published</button>
            <button className="pb-2 hover:text-black">Scheduled</button>
            <button className="pb-2 hover:text-black">Archived</button>
          </div>

          {/* Empty State */}
          <div className="mt-8 text-center text-gray-500">
            <p className="text-3xl">📝</p>
            <p className="mt-2">No posts yet</p>
          </div>
        </div>
      </div>
     </div>
  );
}
