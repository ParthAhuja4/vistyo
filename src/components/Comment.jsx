import DOMPurify from "dompurify";

const sanitize = (text) =>
  DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

const Comment = ({ question, answer, comment }) => {
  return question && answer ? (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#2a2a2a]">
      <p className="mb-2 text-lg font-semibold text-[#2e2e2e] dark:text-[#fefefe]">
        <span className="text-purple-600 dark:text-purple-300">Q:</span>{" "}
        {sanitize(question)}
      </p>
      <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
        <span className="font-semibold text-green-600 dark:text-green-400">
          A:
        </span>{" "}
        {sanitize(answer)}
      </p>
    </div>
  ) : (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-[#2a2a2a]">
      <p className="text-lg leading-relaxed text-gray-800 dark:text-gray-200">
        {sanitize(comment)}
      </p>
    </div>
  );
};

export default Comment;
