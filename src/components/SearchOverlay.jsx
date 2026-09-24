import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useFocusTrap, useScrollLock } from "@/hooks/useScrollLock";
import { highlight, useSearch } from "@/hooks/useSearch";
import { suggestedTags } from "@/lib/content";
import { shortYear } from "@/lib/format";

import styles from "./SearchOverlay.module.css";

const GROUP_LABEL = { project: "Projects", journal: "Journal", press: "Press" };

/**
 * Global search overlay — a portal, not a route.
 *
 * Opens on ⌘K / Ctrl-K or the nav button. `role="dialog"` + `aria-modal`,
 * focus trapped, ESC closes, ↑↓ moves a roving selection across group
 * boundaries, Enter opens. The query mirrors to `?q=` so a search is
 * shareable and survives a reload.
 */
export function SearchOverlay({ open, onClose }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [activeIndex, setActiveIndex] = useState(0);

  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const listboxId = useId();

  const { groups, flat, ready, term } = useSearch(query, open);

  useScrollLock(open);
  useFocusTrap(dialogRef, open);

  // Seed from the URL on open, focus the field, and reset the cursor.
  useEffect(() => {
    if (!open) return;
    setQuery(searchParams.get("q") ?? "");
    setActiveIndex(0);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    // eslint-disable-next-line consistent-return -- cleanup only on the open path
    return () => cancelAnimationFrame(id);
    // Intentionally not depending on searchParams: re-seeding mid-session
    // would fight the user's typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Mirror the debounced term into the URL.
  useEffect(() => {
    if (!open) return;
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (term) next.set("q", term);
        else next.delete("q");
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  }, [term, open, setSearchParams]);

  const close = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("q");
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
    onClose();
  }, [onClose, setSearchParams]);

  const navigate = useNavigate();

  const openResult = useCallback(
    (item) => {
      if (!item) return;
      close();
      if (item.external) {
        window.open(item.href, "_blank", "noopener,noreferrer");
      } else {
        navigate(item.href);
      }
    },
    [close, navigate],
  );

  const onKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (flat.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % flat.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + flat.length) % flat.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      openResult(flat[activeIndex]);
    }
  };

  useEffect(() => setActiveIndex(0), [term]);

  if (!open) return null;

  const showEmptyState = term.length >= 2 && ready && flat.length === 0;
  const showSuggestions = term.length < 2;

  return createPortal(
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- key handling is delegated from the dialog
    <div className={styles.scrim} onKeyDown={onKeyDown} role="presentation">
      <button type="button" className={styles.backdrop} onClick={close} tabIndex={-1}>
        <span className="u-sr">Close search</span>
      </button>

      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label="Search the site"
        ref={dialogRef}
      >
        <div className={styles.field}>
          <label htmlFor={`${listboxId}-input`} className="u-sr">
            Search projects, journal and press
          </label>
          <input
            id={`${listboxId}-input`}
            ref={inputRef}
            className={styles.input}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search…"
            autoComplete="off"
            spellCheck="false"
            role="combobox"
            aria-expanded={flat.length > 0}
            aria-controls={listboxId}
            aria-activedescendant={flat.length > 0 ? `${listboxId}-${activeIndex}` : undefined}
          />
          <button type="button" className="u-meta" onClick={close}>
            Esc
          </button>
        </div>

        <div className={styles.results} id={listboxId} role="listbox" aria-label="Results">
          {groups.map((group) => (
            <section key={group.type} className={styles.group}>
              <h2 className="u-meta">
                {GROUP_LABEL[group.type]} · {group.items.length}
              </h2>
              {group.items.map((item) => {
                const index = flat.indexOf(item);
                const [before, match, after] = highlight(item.title, term);
                return (
                  <div
                    key={`${item.type}-${item.slug}`}
                    id={`${listboxId}-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    tabIndex={-1}
                    className={styles.result}
                    data-active={index === activeIndex ? "true" : "false"}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => openResult(item)}
                  >
                    <span className={styles.resultTitle}>
                      {before}
                      {match ? <mark className={styles.mark}>{match}</mark> : null}
                      {after}
                    </span>
                    <span className={`${styles.resultMeta} u-meta`}>
                      {item.client}
                      {item.year ? ` · ${shortYear(item.year)}` : ""}
                      {item.external ? " ↗" : ""}
                    </span>
                  </div>
                );
              })}
            </section>
          ))}

          {showEmptyState ? (
            <div className={styles.empty}>
              <p className={styles.emptyLine}>
                Nothing matches <strong>“{term}”</strong>.
              </p>
              <p className="u-meta">Try one of these instead</p>
              <div className={styles.tags}>
                {suggestedTags().map((tag) => (
                  <button key={tag} type="button" className="u-tag" onClick={() => setQuery(tag)}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {showSuggestions ? (
            <div className={styles.empty}>
              <p className="u-meta">Suggested</p>
              <div className={styles.tags}>
                {suggestedTags().map((tag) => (
                  <button key={tag} type="button" className="u-tag" onClick={() => setQuery(tag)}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <p className={`${styles.hint} u-meta`}>↑↓ to move · Enter to open · Esc to close</p>
      </div>
    </div>,
    document.body,
  );
}

export default SearchOverlay;
