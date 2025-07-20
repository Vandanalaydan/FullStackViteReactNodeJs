import { useGetVideoStatsQuery } from "../../store/apiSlice";
import { Link } from "react-router-dom";

const VideoCard = ({ video }) => {
  const { _id, title, thumbnail, duration, videoFile, ownerInfo } = video;

  const { data: stats, isLoading } = useGetVideoStatsQuery(_id);

  return (
    <Link to={`/videos/${_id}`} className="block">
      <video
        src={videoFile}
        poster={thumbnail}
        controls
        className="w-full h-48 object-cover"
      />
      <div className="p-4 bg-green-200">
        <h2 className="text-lg font-semibold line-clamp-2">{title}</h2>
        <p className="text-sm text-gray-500">
          Duration: {duration?.toFixed(1)}s
        </p>
        <p className="text-sm text-gray-500">
          Views: {isLoading ? "..." : stats?.data?.totalViews ?? 0}
        </p>
        <p className="text-sm text-gray-500">
          Likes: {isLoading ? "..." : stats?.data?.totalLikes ?? 0}
        </p>

        {/* ✅ Owner Info Section */}
        {ownerInfo && (
          <div className="mt-3 flex items-center gap-3">
            <img
              src={ownerInfo.avatar}
              alt="Owner Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div>
              <Link
                to={`/users/c/${ownerInfo.username}`}
                className="inline-block mt-3 text-blue-600 hover:underline"
              >
                <p className="text-sm font-medium">{ownerInfo.fullName}</p>
              </Link>
              <p className="text-xs text-gray-500">@{ownerInfo.username}</p>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default VideoCard;
