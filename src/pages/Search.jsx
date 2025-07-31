import { useEffect, useRef, useState } from "react";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { search as ytSearch } from "../youtube/ytapi.js";
import { Input, Button, VideoGrid } from "../components/index.js";
import { useAutoSearch } from "../hooks/useAutoSearch.js";
import service from "../appwrite/Databases.js";
import { useNavigate } from "react-router-dom";
import queryRelevance from "../cohereAI/queryRelevance.js";
import { useDispatch, useSelector } from "react-redux";
import { setRemainingSearch } from "../store/authSlice.js";
import DOMPurify from "dompurify";
import { setVideosDispatch } from "../store/videoSlice.js";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const [hasSearched, setHasSearched] = useState(false);
  const [id, setId] = useState("");
  const saved = useSelector((state) => state.video);

  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  const suggestions = useAutoSearch(searchQuery);
  const dispatch = useDispatch();

  const sanitizePlain = (str) =>
    DOMPurify.sanitize(str, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

  useEffect(() => {
    const handleClickOutsideInput = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideInput);
    const { allVideos, searchQuery: savedQuery, id } = saved;
    if (allVideos.length && savedQuery) {
      setVideos(allVideos);
      setId(id);
      setSearchQuery(savedQuery);
      setHasSearched(true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideInput);
    };
  }, []);

  const handleSearch = async (rawInput = searchQuery) => {
    const q = sanitizePlain(rawInput);
    if (!q.trim()) return;
    setHasSearched(true);
    setShowSuggestions(false);
    try {
      setLoading(true);
      setError("");
      const { remainingSearches, plan } = await service.getUserMetadata();
      if (plan === "free" && remainingSearches <= 0) {
        navigate("/app/pricing");
        return;
      }
      const { id, keywords } = await service.listActiveRoleKeywords();
      setId(id);
      const relevant = await queryRelevance(q, keywords);
      if (plan === "free") {
        const updatedSearches = await service.updateRemainingSearches();
        dispatch(setRemainingSearch(updatedSearches?.remainingSearches));
      }
      if (plan === "unlimited")
        service.createSearch(id, q).catch((err) => console.error(err.message));
      if (!relevant) return alert("NO IRRELEVANT QUERIES!");
      const activeChannelFilters = await service.listActiveChannelFilters(id);
      if (!activeChannelFilters.length) return;
      const searchResults = await ytSearch(q, 100, activeChannelFilters);
      setSearchQuery(q);
      setVideos(searchResults);
      dispatch(
        setVideosDispatch({ searchQuery: q, allVideos: searchResults, id }),
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load videos. Please check if a role is active.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const safeSuggestion = sanitizePlain(suggestion);
    inputRef.current?.blur();
    setShowSuggestions(false);
    setSearchQuery(safeSuggestion);
    handleSearch(safeSuggestion);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div ref={wrapperRef} className="relative mx-auto mb-10 w-full max-w-2xl">
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(sanitizePlain(e.target.value))}
            onKeyDown={handleInputKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search YouTube…"
            className="-mb-4 h-10"
            autoComplete="off"
            name="nonConventional"
          />
          <Button
            onClick={() => handleSearch()}
            variant="secondary"
            className="flex h-10 w-full items-center justify-center gap-2 sm:w-auto"
          >
            <SearchIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white text-black shadow-lg dark:border-gray-700 dark:bg-[#1e1e1e] dark:text-white">
            {suggestions.map((s) => {
              const safe = sanitizePlain(s);
              return (
                <li
                  key={safe}
                  className="cursor-pointer px-4 py-2 hover:bg-pink-100 dark:hover:bg-gray-800"
                  onClick={() => handleSuggestionClick(safe)}
                >
                  {safe}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {loading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {error && (
        <p className="mb-6 rounded bg-red-100 p-4 text-red-800 dark:bg-red-900 dark:text-red-200">
          {error}
        </p>
      )}
      {!loading && videos.length > 0 && <VideoGrid videos={videos} id={id} />}
      {hasSearched &&
        !loading &&
        !error &&
        searchQuery &&
        videos.length === 0 && (
          <p className="text-center text-sm text-black/60 dark:text-white/70">
            No results found for “{searchQuery}”. Check Your Keywords and
            ChannelIds.
          </p>
        )}
    </div>
  );
}
