import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import DOMPurify from "dompurify";
import { Input, Button } from "../components/index.js";
import authService from "../appwrite/auth.js";
import { Header, Footer } from "../components/index.js";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    const safeEmail = DOMPurify.sanitize(email);
    const safePassword = DOMPurify.sanitize(password);

    try {
      await authService.login(safeEmail, safePassword);
      let retries = 10;
      while (retries--) {
        try {
          const user = await authService.getCurrentUser();
          if (user) {
            navigate("/app/search");
            return;
          }
        } catch {
          console.log("Appwrite update issue...Trying again");
        }
        await new Promise((r) => setTimeout(r, 200));
      }
    } catch (err) {
      console.error(err);
      return alert("LOGIN FAILED. PLEASE ENTER CORRECT CREDENTIALS.");
    } finally {
      reset();
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-[#ff8ba0] via-[#b7bfff] to-[#f9af91] text-[#2e2e2e] dark:from-[#fb4e6e] dark:via-[#392a82] dark:to-[#783629] dark:text-[#fefefe]">
        <div className="flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-[#f1ffd9] via-[#e8fdfc] to-[#dae1f3] p-8 shadow-2xl dark:from-[#2d1b3d] dark:via-[#2c2f59] dark:to-[#1a1a2e]">
            <h2 className="mb-6 text-center text-3xl font-bold text-[#2e2e2e] dark:text-[#fefefe]">
              Log In
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#2e2e2e] dark:text-[#fefefe]"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-3 left-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-700">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#2e2e2e] dark:text-[#fefefe]"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-3 left-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10 pl-10"
                    {...register("password", {
                      required: "Password is required",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute top-2.5 right-3 rounded p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-700">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                variant="secondary"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : "Log In"}
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-[#a3254b] hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Login;
