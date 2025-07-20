import { useGetLikedVideosQuery } from "../store/apiSlice";
import VideoCard from "../components/ui/VideoCard";

const LikedVideos = () => {
  const { data, isLoading, error } = useGetLikedVideosQuery();

  const likedVideos = (data?.data || [])
    .map((item) => item.likedVideo)
    .filter((v) => v && v._id);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading liked videos.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Liked Videos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {likedVideos.length === 0 ? (
          <p>No liked videos found.</p>
        ) : (
          likedVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))
        )}
      </div>
    </div>
  );
};

export default LikedVideos;
