import { useState } from "react";
import { PlanCard } from "../components/index.js";
import { useSelector } from "react-redux";
import service from "../appwrite/Databases.js";

const Pricing = () => {
  const plan = useSelector((state) => state.auth.plan);
  const [buyingPlan, setBuyingPlan] = useState(null);

  const handleSession = async (planType) => {
    if (plan !== "free") return;

    try {
      setBuyingPlan(planType);
      await service.createCheckoutSession(planType);
    } catch (err) {
      setBuyingPlan(null);
    }
  };

  const isCurrentPlan = (planType) => plan === planType;
  const isSubscribed = plan !== "free";

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#ff8ba0] via-[#b7bfff] to-[#f9af91] py-20 text-[#2e2e2e] dark:from-[#fb4e6e] dark:via-[#392a82] dark:to-[#783629] dark:text-[#fefefe]">
      <section className="mx-auto w-full max-w-6xl px-4 text-center">
        <h2 className="mb-10 text-4xl font-bold tracking-tight md:text-5xl">
          Choose Your Plan
        </h2>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          <PlanCard
            name="Lite"
            price="₹99/mo"
            features={[
              "1 Role",
              "No Creator Q/A",
              "No History",
              "AI Filtering",
              "Unlimited Searches",
            ]}
            className="rounded-2xl bg-[#ffe6ec] text-[#2e2e2e] shadow-lg dark:bg-[#ad5165] dark:text-white"
            onBuy={() => handleSession("lite")}
            buttonLabel={
              isCurrentPlan("lite")
                ? "Current Plan"
                : isSubscribed
                  ? "Unavailable"
                  : buyingPlan === "lite"
                    ? "Processing..."
                    : "BUY"
            }
            disabled={isSubscribed || buyingPlan === "lite"}
          />

          <PlanCard
            name="Pro"
            price="₹299/mo"
            features={[
              "Unlimited Roles",
              "Creator Q/A Enabled",
              "No History",
              "AI Filtering",
              "Unlimited Searches",
            ]}
            className="rounded-2xl bg-[#e6e6ff] text-[#1e1e2e] shadow-lg dark:bg-[#2c2c7c] dark:text-white"
            onBuy={() => handleSession("pro")}
            buttonLabel={
              isCurrentPlan("pro")
                ? "Current Plan"
                : isSubscribed
                  ? "Unavailable"
                  : buyingPlan === "pro"
                    ? "Processing..."
                    : "BUY"
            }
            disabled={isSubscribed || buyingPlan === "pro"}
          />

          <PlanCard
            name="Unlimited"
            price="₹599/mo"
            features={[
              "Unlimited Roles",
              "Creator Q/A",
              "History",
              "AI Filtering",
              "Unlimited Searches",
              "Special Membership Perks",
              "Fast Customer Service",
            ]}
            className="rounded-2xl bg-[#fbe9c3] text-[#2e1d0f] shadow-lg dark:bg-[#ae9559] dark:text-white"
            onBuy={() => handleSession("unlimited")}
            buttonLabel={
              isCurrentPlan("unlimited")
                ? "Current Plan"
                : isSubscribed
                  ? "Unavailable"
                  : buyingPlan === "unlimited"
                    ? "Processing..."
                    : "BUY"
            }
            disabled={isSubscribed || buyingPlan === "unlimited"}
          />
        </div>

        {isSubscribed && (
          <p className="mt-10 text-sm text-gray-700 dark:text-gray-300">
            You are currently subscribed to the{" "}
            <strong>{plan.toUpperCase()}</strong> plan. You can change your plan
            after the current billing cycle ends.
          </p>
        )}
      </section>
    </main>
  );
};

export default Pricing;
