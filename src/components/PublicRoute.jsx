import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import authService from "../appwrite/auth.js";

export default function PublicRoute({ children }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setIsLoggedIn(true);
          navigate("/app/search");
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        setChecking(false);
      }
    };
    init();
  }, [navigate]);

  if (checking) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#f5eaff] via-[#d3c4ff] to-[#cab3ff] dark:from-[#1a1529] dark:via-[#22183a] dark:to-[#2c204a]">
        <Loader2 className="h-10 w-10 animate-spin text-purple-700 dark:text-purple-300" />
        <p className="mt-4 text-lg font-semibold text-[#2e2e2e] dark:text-[#fefefe]">
          Checking authentication...
        </p>
      </div>
    );
  }

  return isLoggedIn ? null : children;
}
