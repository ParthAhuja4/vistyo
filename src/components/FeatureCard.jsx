const FeatureCard = ({ title, description }) => {
  return (
    <div className="relative rounded-2xl bg-white/70 p-6 text-center shadow-lg backdrop-blur-md md:p-8 dark:bg-black/40">
      <div className="absolute right-4 bottom-4 flex gap-1">
        <span className="h-2 w-2 rounded-full bg-[#005a9c] dark:bg-[#5caeff]" />
        <span className="h-2 w-2 rounded-full bg-[#ffc107] dark:bg-[#ffe08a]" />
        <span className="h-2 w-2 rounded-full bg-[#aa2a50] dark:bg-[#ffb1a7]" />
      </div>
      <h3 className="mb-2 text-2xl font-semibold">{title}</h3>
      <p className="text-base text-gray-800 dark:text-gray-200">
        {description}
      </p>
    </div>
  );
};
export default FeatureCard;
