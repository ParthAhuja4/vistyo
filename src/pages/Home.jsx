import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  FeatureCard,
  PlanCard,
  Header,
  Footer,
} from "../components/index.js";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <Header home={true} />
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-[#ff8ba0] via-[#b7bfff] to-[#f9af91] px-6 py-16 text-[#2e2e2e] dark:from-[#fb4e6e] dark:via-[#392a82] dark:to-[#783629] dark:text-[#fefefe]">
        <section className="flex w-full justify-center px-4 pb-17 lg:pt-17">
          <div className="relative w-full max-w-3xl space-y-5 rounded-2xl border border-[#94b0ce] bg-[#ecf5ff] p-8 text-center text-[#1f1f1f] shadow-xl md:space-y-6 md:p-12 dark:border-[#313843] dark:bg-[#50395b] dark:text-white">
            <div className="absolute top-4 left-4 flex gap-1">
              <span className="h-2 w-2 rounded-full bg-[#aa2a50] dark:bg-[#ffb1a7]" />
              <span className="h-2 w-2 rounded-full bg-[#005a9c] dark:bg-[#5caeff]" />
              <span className="h-2 w-2 rounded-full bg-[#ffc107] dark:bg-[#ffe08a]" />
            </div>
            <div className="absolute right-4 bottom-4 flex gap-1">
              <span className="h-2 w-2 rounded-full bg-[#005a9c] dark:bg-[#5caeff]" />
              <span className="h-2 w-2 rounded-full bg-[#ffc107] dark:bg-[#ffe08a]" />
              <span className="h-2 w-2 rounded-full bg-[#aa2a50] dark:bg-[#ffb1a7]" />
            </div>

            <h1 className="text-[22px] leading-tight font-extrabold break-words sm:text-3xl md:text-4xl">
              Vistyo — An AI-Powered Platform to Break Free from Doomscrolling
            </h1>

            <p className="mb-3 text-sm font-semibold tracking-widest text-[#aa2a50] uppercase md:text-base dark:text-[#ffb1a7]">
              Curate Your Vista, Kill the Chaos
            </p>
            <i className="text-sm font-semibold tracking-widest text-[#005a9c] md:text-base dark:text-[#5caeff]">
              Intent over Algorithms. Context over Clicks.
            </i>

            <p className="text-base font-medium md:text-lg">
              Vistyo is a production-grade, AI-native SaaS that transforms
              YouTube into a focused workspace. It uses role-based context and
              semantic intelligence to surface content that aligns with your
              goals — not your impulses. Every search is intent-locked — the AI
              actively removes distractions and irrelevant queries.
            </p>

            <p className="text-sm text-gray-900 md:text-base dark:text-gray-200">
              Stack: React · Vite · Appwrite · Cohere AI · Stripe
            </p>

            <Link to="/app/search">
              <Button
                variant="primary"
                className="mt-2 mb-6 px-6 py-3 text-sm font-semibold md:text-base"
              >
                Start Your Journey
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
          <FeatureCard
            title="Role-Based Search"
            description="Assign roles, define keywords, provide whitelisted Channels and get focused search results tailored to your learning or workflow context. All AI powered."
          />
          <FeatureCard
            title="Creator Q/A (Pro & Unlimited)"
            description="See only the relevant comments — real questions answered directly by the video creator. No more digging through noise or misleading replies. Vistyo filters and highlights creator-authored insights so you never miss important context."
          />

          <FeatureCard
            title="History (Unlimited)"
            description="Automatically save your viewed videos — perfect for tracking what matters."
          />
          <FeatureCard
            title="Minimal, Distraction-Free"
            description="No ads, no recommendations, no chaos. Just the YouTube videos that match your intent."
          />
          <FeatureCard
            title="Smart Pricing"
            description="Only pay the difference when upgrading your plan. Start small, scale when you're ready."
          />
          <FeatureCard
            title="Fast & Seamless"
            description="Built with Vite + Appwrite + React. Everything loads fast. Nothing gets in your way."
          />
        </section>

        <section className="mt-20 w-full max-w-4xl text-left">
          <h2 className="mb-6 text-center text-3xl font-semibold">
            Plans We Offer
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
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
              className="bg-[#ffe6ec] text-[#2e2e2e] dark:bg-[#ad5165] dark:text-white"
              onBuy={() => navigate("/app/pricing")}
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
              className="bg-[#e6e6ff] text-[#1e1e2e] dark:bg-[#2c2c7c] dark:text-white"
              onBuy={() => navigate("/app/pricing")}
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
              className="bg-[#fbe9c3] text-[#2e1d0f] dark:bg-[#ae9559] dark:text-white"
              onBuy={() => navigate("/app/pricing")}
            />
          </div>

          <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
            Only pay the difference when you upgrade — no hidden fees.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
