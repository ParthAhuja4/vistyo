import { useState, useContext } from "react";
import { Menu, LogIn, LogOut, UserPlus, Moon, Sun } from "lucide-react";
import Logo from "../assets/Logo.png";
import { ThemeContext } from "../context/ThemeProvider.jsx";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice.js";
import authService from "../appwrite/auth.js";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "./index.js";
import { clearVideos } from "../store/videoSlice.js";

const Header = ({ home }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMenu = () => setMobileOpen(!mobileOpen);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const plan = useSelector((state) => state.auth.plan);
  const remainingSearches = useSelector(
    (state) => state.auth.remainingSearches,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      dispatch(clearVideos());
      navigate("/login");
    } catch {
      alert("LOGIN FIRST");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 flex w-full flex-wrap items-center justify-between px-6 py-4 backdrop-blur-2xl ${
        theme === "dark"
          ? "bg-gradient-to-r from-[#fb4e6e] to-[#392a82] text-[#fefefe]"
          : "bg-gradient-to-r from-[#ff8ba0] to-[#b7bfff] text-[#2e2e2e]"
      }`}
    >
      <Link
        to="/app/search"
        className="inline-block"
        onClick={() => setMobileOpen(false)}
      >
        <div className="flex items-center gap-2 sm:gap-4">
          <img src={Logo} alt="Logo" className="h-10 w-auto" />
          <div className="font-['Serico',_sans-serif] text-4xl font-bold tracking-widest text-[#2e2e2e] dark:text-[#fefefe]">
            VISTYO
          </div>
        </div>
      </Link>

      <nav className="hidden items-center gap-6 text-lg md:flex">
        {home && (
          <Link
            to="/app/search"
            className="flex items-center gap-1 hover:underline hover:opacity-90"
          >
            Go To App
          </Link>
        )}
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="flex items-center gap-1 hover:underline hover:opacity-90"
            >
              <LogIn size={18} /> Login
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-1 hover:underline hover:opacity-90"
            >
              <UserPlus size={18} /> Signup
            </Link>
          </>
        ) : (
          <>
            {plan === "unlimited" && (
              <>
                <Link
                  to="/app/history"
                  className="hover:underline hover:opacity-90"
                >
                  History
                </Link>
              </>
            )}
            {plan === "free" && (
              <div>Remaining Searches: {remainingSearches}</div>
            )}
            <Link to="/app/roles" className="hover:underline hover:opacity-90">
              Roles
            </Link>
            <Link to="/app/search" className="hover:underline hover:opacity-90">
              Search
            </Link>
            <Link
              to="/app/pricing"
              className="hover:underline hover:opacity-90"
            >
              Pricing
            </Link>
            <Button
              onClick={logoutHandler}
              className="flex items-center gap-1 hover:opacity-90"
              variant="ghost"
            >
              <LogOut size={18} /> Logout
            </Button>
          </>
        )}
        <button onClick={toggleTheme} className="ml-2 hover:opacity-90">
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      <div className="flex items-center gap-3 md:hidden">
        <button onClick={toggleTheme} className="hover:opacity-90">
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button onClick={toggleMenu} className="hover:opacity-90">
          <Menu size={24} />
        </button>
      </div>

      <div
        className={`absolute top-full left-0 flex w-full flex-col gap-4 px-6 py-4 text-base shadow-lg transition-all duration-200 ease-out ${
          mobileOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        } ${
          theme === "dark"
            ? "bg-gradient-to-r from-[#fb4e6e] to-[#392a82] text-[#fefefe]"
            : "bg-gradient-to-r from-[#ff8ba0] to-[#b7bfff] text-[#2e2e2e]"
        }`}
      >
        {home && (
          <Link
            to="/app/search"
            className="flex items-center gap-1 hover:underline hover:opacity-90"
          >
            Go To App
          </Link>
        )}
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="hover:underline hover:opacity-90"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hover:underline hover:opacity-90"
              onClick={() => setMobileOpen(false)}
            >
              Signup
            </Link>
          </>
        ) : (
          <>
            {plan === "unlimited" && (
              <>
                <Link
                  to="/app/history"
                  className="hover:underline hover:opacity-90"
                  onClick={() => setMobileOpen(false)}
                >
                  History
                </Link>
              </>
            )}
            {plan === "free" && (
              <div>Remaining Searches: {remainingSearches}</div>
            )}
            <Link
              to="/app/roles"
              className="hover:underline hover:opacity-90"
              onClick={() => setMobileOpen(false)}
            >
              Roles
            </Link>
            <Link
              to="/app/search"
              className="hover:underline hover:opacity-90"
              onClick={() => setMobileOpen(false)}
            >
              Search
            </Link>
            <Link
              to="/app/pricing"
              className="hover:underline hover:opacity-90"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </Link>
            <Button
              onClick={() => {
                setMobileOpen(false);
                logoutHandler();
              }}
              className="flex items-center gap-1 hover:opacity-90"
              variant="ghost"
            >
              <LogOut size={18} /> Logout
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
