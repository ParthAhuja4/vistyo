function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "px-4 py-2 rounded-xl font-semibold transition-colors duration-200";

  const variants = {
    primary:
      "bg-white text-[#2e2e2e] hover:bg-[#f5f5f5] dark:bg-[#2e2e2e] dark:text-[#fefefe] dark:hover:bg-[#3a3a3a]",
    secondary:
      "bg-[#aa2a50] text-white hover:bg-[#911e42] dark:bg-[#ffb1a7] dark:text-[#2e2e2e] dark:hover:bg-[#fba3a3]",
    ghost:
      "bg-transparent border border-[#2e2e2e] text-[#2e2e2e] hover:bg-black/10 dark:border-[#fefefe] dark:text-[#fefefe] dark:hover:bg-white/10",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
