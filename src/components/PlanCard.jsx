import Button from "./Button.jsx";
const PlanCard = ({
  name,
  price,
  features,
  className,
  onBuy,
  buttonLabel = "Go to Pricing",
}) => {
  return (
    <div className={`rounded-2xl p-6 shadow-lg ${className}`}>
      <h3 className="mb-1 text-2xl font-bold">{name}</h3>
      <p className="mb-4 text-lg font-medium">{price}</p>
      <ul className="mb-6 list-inside list-disc space-y-1 text-left text-sm">
        {features.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      {onBuy && buttonLabel && (
        <Button onClick={onBuy} variant="primary" className="w-full text-sm">
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};
export default PlanCard;
