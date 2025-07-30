import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { Header, Footer } from "./components/index.js";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import service from "./appwrite/Databases.js";
import { Loader2 } from "lucide-react";
import { clearVideos } from "./store/videoSlice.js";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const init = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData) {
          const metaData = await service.getUserMetadata();
          dispatch(
            login({
              isLoggedIn: true,
              userId: metaData.userId,
              email: userData.email,
              plan: metaData.plan,
              remainingSearches: metaData.remainingSearches,
            }),
          );
        }
      } catch (error) {
        console.error("Error during initialization:", error);
        dispatch(logout());
        dispatch(clearVideos());
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-[#ff8ba0] via-[#b7bfff] to-[#f9af91] text-[#2e2e2e] dark:from-[#fb4e6e] dark:via-[#392a82] dark:to-[#783629] dark:text-[#fefefe]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="font-['Serico',_sans-serif] text-3xl font-semibold tracking-widest">
              LOADING...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-[#ff8ba0] via-[#b7bfff] to-[#f9af91] text-[#2e2e2e] dark:from-[#fb4e6e] dark:via-[#392a82] dark:to-[#783629] dark:text-[#fefefe]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
