import { useEffect, useState } from "react";
import service from "../appwrite/Databases";
import { Button } from "../components/index.js";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

function formatDate(iso) {
  if (!iso) return "Unknown";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function History() {
  const [selected, setSelected] = useState("watch");
  const [watchHistory, setWatchHistory] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loadingWatch, setLoadingWatch] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [hasMoreWatch, setHasMoreWatch] = useState(true);
  const [hasMoreSearch, setHasMoreSearch] = useState(true);
  const [lastWatchId, setLastWatchId] = useState(null);
  const [lastSearchId, setLastSearchId] = useState(null);
  const [activeRoleId, setActiveRoleId] = useState(null);
  const navigate = useNavigate();

  const fetchWatchHistory = async (startAfterId = null, id) => {
    if (loadingWatch || !hasMoreWatch || !id) return;
    setLoadingWatch(true);
    try {
      const res = await service.listUserHistory(20, startAfterId, id);
      const docs = res.documents || [];
      const newDocs = docs.filter(
        (doc) => !watchHistory.find((d) => d.$id === doc.$id),
      );
      setWatchHistory((prev) => [...prev, ...newDocs]);
      if (docs.length) setLastWatchId(docs[docs.length - 1].$id);
      setHasMoreWatch(docs.length === 20);
    } catch (err) {
      console.error("Failed to load watch history:", err);
    } finally {
      setLoadingWatch(false);
    }
  };

  const fetchSearchHistory = async (startAfterId = null, id) => {
    if (loadingSearch || !hasMoreSearch || !id) return;
    setLoadingSearch(true);
    try {
      const res = await service.listUserAllSearches(20, startAfterId, id);
      const docs = res.documents || [];
      const newDocs = docs.filter(
        (doc) => !searchHistory.find((d) => d.$id === doc.$id),
      );
      setSearchHistory((prev) => [...prev, ...newDocs]);
      if (docs.length) setLastSearchId(docs[docs.length - 1].$id);
      setHasMoreSearch(docs.length === 20);
    } catch (err) {
      console.error("Failed to load search history:", err);
    } finally {
      setLoadingSearch(false);
    }
  };

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { id } = await service.getActiveRole();
        setActiveRoleId(id);
      } catch (err) {
        console.error("Failed to get active role:", err);
      }
    };
    fetchRole();
  }, []);

  useEffect(() => {
    if (!activeRoleId) return;

    setWatchHistory([]);
    setSearchHistory([]);
    setLastWatchId(null);
    setLastSearchId(null);
    setHasMoreWatch(true);
    setHasMoreSearch(true);

    fetchWatchHistory(null, activeRoleId);
    fetchSearchHistory(null, activeRoleId);
  }, [activeRoleId]);

  const handleDelete = async (id, type) => {
    const setHistory = type === "watch" ? setWatchHistory : setSearchHistory;
    const updated =
      type === "watch"
        ? watchHistory.filter((item) => item.$id !== id)
        : searchHistory.filter((item) => item.$id !== id);

    setHistory(updated);

    try {
      type === "watch"
        ? await service.deleteHistory(id)
        : await service.deleteSearch(id);
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Delete failed.");
    }
  };

  const handleWatchClick = async (video) => {
    try {
      const { id } = await service.getActiveRole();
      await service.createHistory(
        video.videoId,
        id,
        video.title,
        video.duration,
        video.thumbnail,
        video.channelName,
        video.description,
        video.channelId,
      );
      navigate(`/app/videoplayer/${video.channelId}/${video.videoId}`);
    } catch (err) {
      console.error("Open failed:", err);
      alert("Could not open video.");
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#2e2e2e] dark:text-white">
          History
        </h1>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="rounded border px-3 py-2 dark:bg-[#1e1e1e] dark:text-white"
        >
          <option value="watch">Watch History</option>
          <option value="search">Search History</option>
        </select>
      </div>

      {selected === "watch" && (
        <>
          {watchHistory.length === 0 && !loadingWatch ? (
            <p className="text-gray-500 dark:text-gray-400">
              No watch history found.
            </p>
          ) : (
            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(clamp(200px, 30vw, 300px), 1fr))",
              }}
            >
              {watchHistory.map((video) => (
                <div
                  key={video.$id}
                  className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl transition-transform duration-300 hover:-translate-y-1 hover:bg-[#f5eaff] hover:shadow-lg dark:hover:bg-[#302445]"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(video.$id, "watch");
                    }}
                    className="absolute top-2 right-2 z-10 rounded-full bg-black/60 p-1 text-white hover:bg-red-600"
                    title="Delete from history"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div
                    onClick={() => handleWatchClick(video)}
                    className="relative aspect-video w-full overflow-hidden"
                  >
                    <img
                      src={
                        video.thumbnail ||
                        "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"
                      }
                      alt={video.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="bg-opacity-80 absolute right-2 bottom-2 rounded bg-black px-1.5 py-0.5 text-xs text-white">
                      {video.duration}
                    </span>
                  </div>

                  <div className="mt-3 px-2 pb-3">
                    <h3 className="line-clamp-2 text-sm leading-snug font-bold group-hover:text-[#5f3dc4] dark:group-hover:text-[#d5c6ff]">
                      {video.title}
                    </h3>
                    <p className="text-sm font-semibold text-black dark:text-gray-200">
                      {video.channelName}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Watched on{" "}
                      {formatDate(video.createdAt || video.$createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {hasMoreWatch && !loadingWatch && watchHistory.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => fetchWatchHistory(lastWatchId, activeRoleId)}
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}

      {selected === "search" && (
        <>
          {searchHistory.length === 0 && !loadingSearch ? (
            <p className="text-gray-500 dark:text-gray-400">
              No search history found.
            </p>
          ) : (
            <div className="space-y-4">
              {searchHistory.map((item) => (
                <div
                  key={item.$id}
                  className="relative rounded-lg border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-[#1e1e1e]"
                >
                  <button
                    onClick={() => handleDelete(item.$id, "search")}
                    className="absolute top-2 right-2 z-10 rounded-full bg-black/60 p-1 text-white hover:bg-red-600"
                    title="Delete from search history"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {item.query || "[missing query]"}
                  </p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Searched on {formatDate(item.createdAt || item.$createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
          {hasMoreSearch && !loadingSearch && searchHistory.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => fetchSearchHistory(lastSearchId, activeRoleId)}
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
