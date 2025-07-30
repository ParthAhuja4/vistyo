import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import App from "./App";
import {
  Signup,
  Roles,
  Login,
  Home,
  Search,
  VideoPlayer,
  History,
  NotFound,
  Pricing,
  ThankYou,
} from "./pages/index.js";
import ThemeProvider from "./context/ThemeProvider";
import { Provider } from "react-redux";
import store from "./store/store.js";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { PublicRoute } from "./components/index.js";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path="/app" element={<App />}>
        <Route path="roles" element={<Roles />} />
        <Route path="thankyou" element={<ThankYou />} />
        <Route path="search" element={<Search />} />
        <Route path="history" element={<History />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="videoplayer/:channelId/:videoId"
          element={<VideoPlayer />}
        />
      </Route>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </>,
  ),
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ThemeProvider>
  </StrictMode>,
);
