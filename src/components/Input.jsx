import { useId } from "react";

const Input = ({ label, type = "text", id, className = "", ...props }) => {
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:gap-4">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 text-sm font-medium text-[#2e2e2e] md:mb-0 md:w-32 dark:text-[#fefefe]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`w-full rounded-lg border border-[#ccc] bg-white px-3 py-2 text-[#2e2e2e] placeholder-gray-400 focus:ring-2 focus:ring-[#aa2a50] focus:outline-none dark:border-[#555] dark:bg-[#2e2e2e] dark:text-[#fefefe] dark:placeholder-gray-400 dark:focus:ring-[#ffb1a7] ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
