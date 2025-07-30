import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import service from "../appwrite/Databases.js";
import { fetchComments } from "../youtube/ytapi.js";
import { Comment } from "../components/index.js";
import { useDispatch } from "react-redux";
import { clearVideos } from "../store/videoSlice.js";

export default function VideoPlayer() {
  const { videoId, channelId } = useParams();
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [author, setAuthor] = useState([]);
  const [comments, setComments] = useState([]);
  const [plan, setPlan] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        const { id } = await service.getActiveRole();
        const isLegit = await service.isTrustedView(videoId, id);
        if (!isLegit) {
          dispatch(clearVideos());
          alert("Search session expired. Make a new search.");
          navigate("/app/search");
          return;
        }
        if (isMounted) setValidated(true);
        const plan = await service.getUserPlan();
        setPlan(plan);
        if (plan === "unlimited" || plan === "pro") {
          const { allAuthorComments, authorRepliesToViewers } =
            await fetchComments(videoId, channelId);
          if (allAuthorComments && authorRepliesToViewers) {
            setAuthor(allAuthorComments);
            setComments(authorRepliesToViewers);
            setCommentsLoaded(true);
          }
        }
      } catch (error) {
        console.error("Video/Comments validation failed:", error);
        navigate("/app/search");
      }
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!validated) {
    return (
      <div className="flex flex-col items-center gap-3 text-[#2e2e2e] dark:text-[#fefefe]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-lg tracking-wide">Verifying access to video...</p>
      </div>
    );
  }
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8 text-[#2e2e2e] sm:px-6 md:px-8 dark:text-[#fefefe]">
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-xl"
        style={{ paddingTop: "56.25%" }}
      >
        <iframe
          className="absolute top-0 left-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {commentsLoaded && (plan === "unlimited" || plan === "pro") ? (
        <section className="flex flex-col gap-6">
          <h2 className="text-center text-3xl font-bold text-[#2e2e2e] dark:text-[#fefefe]">
            Creator Q/A
          </h2>
          <div className="space-y-6 text-[#2e2e2e] dark:text-[#fefefe]">
            <div className="text-center text-lg font-semibold text-gray-600 dark:text-gray-400">
              Creator's Comments:
            </div>
            {author.length ? (
              author.map((comment, i) => <Comment key={i} comment={comment} />)
            ) : (
              <div className="text-center">NONE</div>
            )}
            <div className="pt-6 text-center text-lg font-semibold text-gray-600 dark:text-gray-400">
              Comments Answered by Creator:
            </div>
            {comments.length ? (
              comments.map((comment, i) => (
                <Comment key={i} question={comment.q} answer={comment.a} />
              ))
            ) : (
              <div className="text-center">NONE</div>
            )}
          </div>
        </section>
      ) : plan === "unlimited" || plan === "pro" ? (
        <div className="flex flex-col items-center gap-3 text-[#2e2e2e] dark:text-[#fefefe]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-lg tracking-wide">Loading Comments...</p>
        </div>
      ) : null}
    </div>
  );
}
