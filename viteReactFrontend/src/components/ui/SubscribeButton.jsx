import {
  useToggleSubscriptionMutation,
  useGetSubscriptionStatusQuery,
} from "../../store/apiSlice";
import { useSelector } from "react-redux";

const SubscribeButton = ({ channelId, onToggle }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const [toggleSubscription, { isLoading: toggling }] =
    useToggleSubscriptionMutation();
  const {
    data: statusData,
    isLoading: statusLoading,
    refetch,
  } = useGetSubscriptionStatusQuery(channelId);

  const isSubscribed = statusData?.data?.subscribed;

  const handleToggle = async () => {
    try {
      await toggleSubscription(channelId).unwrap();
      const updated = await refetch();
      const newStatus = updated?.data?.data?.subscribed;
      onToggle?.(newStatus); // Notify parent
    } catch (err) {
      console.error("Toggle failed:", err);
      alert("Failed to toggle");
    }
  };

  if (currentUser?._id === channelId) return null;

  return (
    <button
      onClick={handleToggle}
      disabled={toggling || statusLoading}
      className={`${
        isSubscribed ? "bg-red-600" : "bg-blue-600"
      } text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50`}
    >
      {toggling || statusLoading
        ? "Processing..."
        : isSubscribed
        ? "Unsubscribe"
        : "Subscribe"}
    </button>
  );
};

export default SubscribeButton;
