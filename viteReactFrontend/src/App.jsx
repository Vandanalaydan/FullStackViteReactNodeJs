import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout.jsx"; // ✅ Use relative path without "/"
import { Toaster } from 'react-hot-toast';
import Home from "./pages/Home.jsx";

import Account from "./pages/Account.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import UserProfile from "./pages/userProfile.jsx";
import LogoutButton from "./layouts/LogoutButtton.jsx";
import "./App.css";
import Updateavtar from "./pages/Updateavtar.jsx";
import UpdatecoverImage from "./pages/UpdatecoverImage.jsx"
import Changepassword from "./pages/Changepassword.jsx";
import ChannelProfile from "./pages/ChannelProfile.jsx";
import VideoList from "./pages/videoList.jsx";
import UploadaVideo from "./pages/UploadVideo.jsx";
import VideoDetails from "./pages/VideobyId.jsx";
import CreatePlaylist from "./pages/CreatePlaylist.jsx";
import AddtoPlaylist from "./pages/AddToPlaylist.jsx";
import PlaylistDetails from "./pages/playlistsById.jsx";
import UserPlaylists from "./pages/UserPlaylists.jsx";
import Updateplaylist from "./pages/Updateplaylist.jsx";
import PlaylistActions from "./pages/Deleteplaylist.jsx";
import UploadtoPlaylist from "./pages/UploadForPlaylist.jsx";
import RemoveVideoButton from "./pages/RemovePlaylistVideo.jsx";
import SubscribeButton from "./components/ui/SubscribeButton.jsx";
import ChannelSubscribers from "./pages/channelSubscribers.jsx";
//import SubscribeButton from "./components/ui/SubscribeButton.jsx";
import SubscribedChannels from "./pages/SubscribedChannel.jsx";
import Sidebar from "./layouts/SideBar.jsx";
import LikedVideosPage from "./pages/LikedVideos.jsx";
import MyVideos from "./pages/MyVideos.jsx";
import Channelvideos from "./pages/ChannelVideos.jsx";



function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
       
          <Layout> 
        
        <Routes>
        
     
         <Route path="/" element={<Home />} />
          <Route path="/users/update-account" element={<Account />} />
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/register" element={<Register />} />
          <Route path="/users/current-user" element={<UserProfile />} />
           <Route path="/users/logout" element={<LogoutButton />} />
            <Route path="/users/avatar" element={<Updateavtar />} />
             <Route path="/users/coverImage" element={<UpdatecoverImage />} />
            <Route path="/users/change-password" element={<Changepassword />} />
            <Route path="users/c/:username" element={<ChannelProfile />} />
             <Route path="/videos/" element={<VideoList/>} />
             <Route path="/videos/upload" element={<UploadaVideo/>}/>
             <Route path="/videos/:videoId" element={<VideoDetails/>}/>
              <Route path="/videos/user/videos" element={<MyVideos/>}/>
              <Route path="/videos/channel/videos" element={<Channelvideos/>}/>

{/* playlist */}
 <Route path="/playlist/" element={<CreatePlaylist/>}/>
  <Route path="/playlist/add/:videoId/:playlistId" element={< AddtoPlaylist/>}/>
  <Route path="/playlist/:playlistId" element={<PlaylistDetails />} />
<Route path="/playlist/user/:userId" element={<UserPlaylists />} />
<Route path="/playlist/:playlistId/update" element={<Updateplaylist />} />
<Route path="/playlist/:playlistId/delete" element={<PlaylistActions />} />
<Route path="/playlist/:playlistId/upload-video" element={<UploadtoPlaylist />} />
<Route path="/playlist/remove/:videoId/:playlistId" element={<RemoveVideoButton /> } />

{/* subscription */}

<Route path="/subscriptions/u/:channelId" element={<ChannelSubscribers/>} />
<Route path="/subscriptions/c/:channelId" element={<SubscribedChannels />} />



{/* comments */}

{/* likedvideos */}
<Route path="/likes/videos" element={<LikedVideosPage />} />




 

        </Routes>
       
       </Layout>
    </Router>
  );
}

export default App;
