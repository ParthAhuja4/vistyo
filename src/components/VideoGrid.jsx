import { useNavigate } from "react-router-dom";
import { useState } from "react";
import service from "../appwrite/Databases.js";

const VideoCard = ({ video, id }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  if (!video?.videoId) return null;
  const {
    videoId,
    title,
    duration,
    thumbnail,
    channelName,
    description,
    channelId,
  } = video;
  const handleClick = async () => {
    try {
      await service.createHistory(
        videoId,
        id,
        title,
        duration,
        thumbnail,
        channelName,
        description,
        channelId,
      );
      navigate(`/app/videoplayer/${channelId}/${videoId}`);
    } catch {
      alert("SERVER ERROR PLS TRY AGAIN");
      return;
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-xl transition-transform duration-300 hover:-translate-y-1 hover:bg-[#f5eaff] hover:shadow-lg dark:hover:bg-[#302445]"
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={
            imageError
              ? "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
              : thumbnail
          }
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        <span className="bg-opacity-80 absolute right-2 bottom-2 rounded bg-black px-1.5 py-0.5 text-xs text-white">
          {duration}
        </span>
      </div>
      <div className="mt-3 flex gap-3 px-2 pb-3">
        <div className="flex flex-col">
          <h3 className="line-clamp-2 text-sm leading-snug font-extrabold transition-colors duration-300 group-hover:text-[#5f3dc4] dark:group-hover:text-[#d5c6ff]">
            {title}
          </h3>
          <p className="mt-1 text-sm font-semibold text-black dark:text-gray-200">
            {channelName}
          </p>
          <p className="mt-1 line-clamp-2 text-xs font-semibold text-gray-800 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function VideoGrid({ videos, id }) {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
      <div
        className="grid gap-6 sm:gap-6 md:gap-6 lg:gap-8"
        style={{
          gridTemplateColumns:
            "repeat(auto-fill, minmax(clamp(200px, 30vw, 300px), 1fr))",
        }}
      >
        {videos.map((video) => (
          <VideoCard key={video.videoId} video={video} id={id} />
        ))}
      </div>
    </div>
  );
}
