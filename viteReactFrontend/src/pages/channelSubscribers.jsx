import { useParams } from "react-router-dom";
import { useGetUserChannelSubscribersQuery } from "../store/apiSlice";

const ChannelSubscribers = () => {
  const { channelId } = useParams(); // assumes route: /channel/:channelId/subscribers
  const { data, isLoading, isError } = useGetUserChannelSubscribersQuery(channelId);

  if (isLoading) return <p>Loading subscribers...</p>;
  if (isError) return <p>Failed to load subscribers.</p>;

  const subscribers = data?.data || [];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Subscribers ({subscribers.length})</h2>
      {subscribers.length === 0 ? (
        <p>No subscribers yet.</p>
      ) : (
        <ul className="space-y-4">
          {subscribers.map((sub) => (
            <li key={sub.subscriber._id} className="flex items-center gap-4">
              <img
                src={sub.subscriber.avatar}
                alt={sub.subscriber.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium">{sub.subscriber.fullName}</p>
                <p className="text-sm text-gray-600">@{sub.subscriber.username}</p>
                <p className="text-xs text-gray-500">
                  Subscribed on: {new Date(sub.subscribedAt).toLocaleDateString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChannelSubscribers;
