import config from "../config/config";

export const search = async (query, maxResults = 15, channelFilters = []) => {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${config.ytApiKey}`;
  const searchResponse = await fetch(searchUrl);
  if (!searchResponse.ok) {
    throw new Error(`YouTube Search API failed: ${searchResponse.status}`);
  }
  const searchData = await searchResponse.json();

  const filteredItems = searchData.items.filter(
    (item) =>
      item.id.videoId &&
      (!channelFilters.length ||
        channelFilters.includes(item.snippet.channelId)),
  );

  const videoIds = filteredItems.map((item) => item.id.videoId);
  if (videoIds.length === 0) return [];

  const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(",")}&key=${config.ytApiKey}`;
  const videosResponse = await fetch(videosUrl);
  if (!videosResponse.ok) {
    throw new Error(`YouTube Videos API failed: ${videosResponse.status}`);
  }
  const videosData = await videosResponse.json();

  const parseDuration = (iso) => {
    const match = iso?.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const [, h = 0, m = 0, s = 0] = match
      ? match.map((n) => parseInt(n || 0))
      : [];
    return `${h ? `${h}:` : ""}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return filteredItems.map((item) => {
    const videoId = item.id.videoId;
    const videoDetails = videosData.items.find((v) => v.id === videoId);

    return {
      videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      channelId: item.snippet.channelId,
      channelName: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url,
      duration: parseDuration(videoDetails?.contentDetails?.duration ?? ""),
    };
  });
};

//FIRST FETCH HAS ALL VDS DETAIL EXCEPT DURATION SO WE SEARCH FOR THOSE VDS BY SCND FETCH AND THEN BY USING FIND METHOD WE TAKE THE SECOND FETCH'S RESULT EXTRACT OUT DURATION AND THEN MERGE THE TWO FETCH RESULTS INTO ONE OBJECT AND THAT OBJECT IS RETURNED.

export const fetchComments = async (videoId, channelId) => {
  const commentThreadsUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&maxResults=100&key=${config.ytApiKey}`;

  const res = await fetch(commentThreadsUrl);
  if (!res.ok) {
    throw new Error(`YouTube API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (!data.items || data.items.length === 0) {
    return {
      allAuthorComments: [],
      authorRepliesToViewers: [],
    };
  }

  const authorComments = [];
  const authorRepliesToViewers = [];

  for (const thread of data.items) {
    const topComment = thread.snippet?.topLevelComment;
    if (!topComment) continue;

    const topSnippet = topComment.snippet;
    const topCommentId = topComment.id;
    const topText = topSnippet?.textOriginal || "";
    const isCreatorComment = topSnippet?.authorChannelId?.value === channelId;

    if (isCreatorComment) {
      authorComments.push(topText);
    }

    const threadReplies = thread.replies?.comments || [];
    for (const reply of threadReplies) {
      const replySnippet = reply.snippet;
      if (!replySnippet) continue;

      const isCreatorReply = replySnippet.authorChannelId?.value === channelId;
      const isReplyToTopLevel = replySnippet.parentId === topCommentId;

      if (isCreatorReply && isReplyToTopLevel && !isCreatorComment) {
        const replyText = replySnippet.textOriginal || "";
        if (replyText.trim().length > 0) {
          authorRepliesToViewers.push({
            q: topText,
            a: replyText,
          });
        }
      }
    }
  }

  return {
    allAuthorComments: authorComments,
    authorRepliesToViewers,
  };
};
