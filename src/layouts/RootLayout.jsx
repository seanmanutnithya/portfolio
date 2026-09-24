import { useCallback, useEffect, useState } from "react";
import { Outlet, ScrollRestoration, useLocation, useNavigationType } from "react-router-dom";

import Footer from "@/components/Footer";
import Intro from "@/components/Intro";
import Nav from "@/components/Nav";
import SearchOverlay from "@/components/SearchOverlay";
import { LenisProvider, useLenis } from "@/hooks/useLenis";
import { refreshMotion } from "@/lib/motion";

import styles from "./RootLayout.module.css";

/**
 * Shell composition, in the order the handoff sheet specifies:
 *
 *   Lenis provider → Nav → ScrollRestoration → Outlet → Footer → SearchOverlay
 *
 * plus the site-open <Intro>, which covers the shell while it plays and
 * unmounts itself when done.
 *
 * The provider is a separate component from the shell because the shell
 * itself consumes the Lenis context.
 */
export function RootLayout() {
  return (
    <LenisProvider>
      <Shell />
    </LenisProvider>
  );
}

function Shell() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { scrollTo } = useLenis();
  const location = useLocation();
  const navigationType = useNavigationType();

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // ⌘K / Ctrl-K anywhere.
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  /**
   * On a new navigation, jump to the top and re-measure every ScrollTrigger.
   *
   * POP is excluded deliberately: that is the back button, and
   * <ScrollRestoration> is already restoring the previous offset. Forcing
   * the top here would break "back restores scroll" on /work.
   */
  useEffect(() => {
    if (navigationType !== "POP") {
      scrollTo(0, { immediate: true });
    }
    refreshMotion();
  }, [location.pathname, navigationType, scrollTo]);

  return (
    <div className={styles.shell}>
      <a className="u-skip" href="#main">
        Skip to content
      </a>

      <Nav onOpenSearch={openSearch} />

      <ScrollRestoration />

      <main id="main" className={styles.main} key={location.pathname}>
        <div className="u-page">
          <Outlet />
        </div>
      </main>

      <Footer />

      <SearchOverlay open={searchOpen} onClose={closeSearch} />

      <Intro />
    </div>
  );
}

export default RootLayout;
