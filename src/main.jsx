import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import RootLayout from "@/layouts/RootLayout";
import * as Home from "@/routes/Home";
import * as NotFound from "@/routes/NotFound";
import "@/styles/globals.css";

/**
 * Route-level code splitting.
 *
 * Explicit rather than `lazy: () => import(...)` so only real route
 * properties are ever handed to the router.
 */
const split = (load) => async () => {
  const module = await load();
  return { Component: module.Component, loader: module.loader };
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    // Catches anything the layout itself throws.
    errorElement: <NotFound.Component />,
    children: [
      {
        // Pathless wrapper: child errors render *inside* the layout, so a
        // failed loader still leaves the visitor with nav, footer and a way out.
        errorElement: <NotFound.Component />,
        children: [
          // Home is eager — it is the entry point and should not wait on a
          // second round trip.
          { index: true, Component: Home.Component, loader: Home.loader },

          { path: "work", lazy: split(() => import("@/routes/Work.jsx")) },
          { path: "work/:slug", lazy: split(() => import("@/routes/Project.jsx")) },
          { path: "about", lazy: split(() => import("@/routes/About.jsx")) },
          { path: "services", lazy: split(() => import("@/routes/Services.jsx")) },
          { path: "press", lazy: split(() => import("@/routes/Press.jsx")) },
          { path: "journal", lazy: split(() => import("@/routes/Journal.jsx")) },
          { path: "journal/:slug", lazy: split(() => import("@/routes/JournalPost.jsx")) },
          { path: "contact", lazy: split(() => import("@/routes/Contact.jsx")) },

          { path: "*", Component: NotFound.Component },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
