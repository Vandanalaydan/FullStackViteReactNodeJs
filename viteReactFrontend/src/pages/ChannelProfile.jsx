import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useGetChannelProfileQuery } from "../store/apiSlice";
import SubscribeButton from "../components/ui/SubscribeButton";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import Channelvideos from "./ChannelVIdeos.jsx";







export default function ChannelProfile() {
  const { username } = useParams();
  const { data, isLoading, isError } = useGetChannelProfileQuery(username);
  const [subscriberCount, setSubscriberCount] = useState(null);
   const navigate=useNavigate();
 

  useEffect(() => {
    if (data?.data?.subscribersCount !== undefined) {
      setSubscriberCount(data.data.subscribersCount);
    }
  }, [data?.data?.subscribersCount]);

  const handleSubscriptionToggle = (subscribed) => {
    setSubscriberCount((prev) =>
      subscribed ? prev + 1 : Math.max(prev - 1, 0)
    );
  };

  if (isLoading) return <p>Loading channel...</p>;
  if (isError || !data?.data) return <p>Failed to load channel.</p>;

  const channel = data.data;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 bg-white rounded shadow">


        {/* Cover Image */}
        <div className="w-full h-60 bg-gray-300 relative">
          <img
            src={channel.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          {/* Avatar */}
          <div className="absolute left-10 -bottom-12">
            <img
              src={channel.avatar}
              alt="Avatar"
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />
          </div>
        </div>




      <h1 className="text-3xl font-bold">{channel.fullName}</h1>
      <p className="text-gray-600">@{channel.username}</p>
     

      <div className="gap-2 flex py-4 text-gray-800">
        <p><strong>Email:</strong> {channel.email}</p>
        <p><strong>{subscriberCount} Subscribers</strong> </p>
        <p><strong> {channel.channelsSubscribedToCount} Subscriptions</strong> </p>
      </div>
      
     

      <div className="  px-6 gap-2 flex"  >
       
        <SubscribeButton
          channelId={channel._id}
          onToggle={handleSubscriptionToggle}
        />
         <Button  onClick={() => navigate( `/subscriptions/u/${channel._id}`)}>Subscribers</Button>
      </div>
      
  
   <Channelvideos channel={username}/>

    </div>
   
  );
}
