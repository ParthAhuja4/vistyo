import { useEffect, useState } from "react";
import service from "../appwrite/Databases.js";

const ThankYou = () => {
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const metadata = await service.getUserMetadata();
        if (!metadata || metadata.plan === "free") {
          setIsAllowed(false);
          return;
        }
        const updatedAt = new Date(metadata.$updatedAt);
        const now = new Date();
        const minutesAgo = (now - updatedAt) / (1000 * 60);
        if (minutesAgo <= 10) {
          setIsAllowed(true);
        }
      } catch (error) {
        console.error("Access verification failed:", error);
        setIsAllowed(false);
      } finally {
        setLoading(false);
      }
    };
    verifyAccess();
  }, []);
  if (loading) return <p className="text-center">Loading...</p>;
  if (!isAllowed) {
    return (
      <div className="p-8 text-center text-red-600">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>This page is only available right after successful payment.</p>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 text-center shadow">
        <h1 className="text-2xl font-bold text-green-600">🎉 Thank you!</h1>
        <p className="mt-2 text-gray-700">Your payment was successful.</p>
        <a
          href="/app"
          className="mt-6 inline-block rounded bg-blue-600 px-4 py-2 text-white"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
};

export default ThankYou;
