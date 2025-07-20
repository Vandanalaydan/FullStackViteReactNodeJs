// src/pages/SubscribedChannels.jsx

import { useParams } from "react-router-dom";
import { useGetSubscribedChannelsQuery } from "../store/apiSlice";
import Sidebar from "../layouts/SideBar";

export default function SubscribedChannels() {
  const { channelId } = useParams();
  const { data, isLoading, isError } = useGetSubscribedChannelsQuery(channelId);

  if (isLoading) return <p>Loading subscribed channels...</p>;
  if (isError) return <p>Failed to load subscribed channels.</p>;

  const channels = data?.data || [];

  return (
    // <div className="flex min-h-screen">
    //   <Sidebar />
      <div className="flex-1 p-6 bg-white">
        <h2 className="text-2xl font-semibold mb-4">Subscribed Channels</h2>
        {channels.length === 0 ? (
          <p className="text-gray-600">No subscriptions found.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map(({ channel, subscribedAt }) => (
              <li
                key={channel._id}
                className="border rounded-lg p-4 shadow hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={channel.avatar}
                    alt={channel.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{channel.fullName}</h3>
                    <p className="text-gray-500 text-sm">@{channel.username}</p>
                    <p className="text-gray-400 text-xs">
                      Subscribed on {new Date(subscribedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    // </div>
  );
}
