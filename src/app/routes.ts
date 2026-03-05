import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import Search from "./pages/Search";
import BookDetail from "./pages/BookDetail";
import Notifications from "./pages/Notifications";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "search", Component: Search },
      { path: "book/:id", Component: BookDetail },
      { path: "notifications", Component: Notifications },
    ],
  },
]);
