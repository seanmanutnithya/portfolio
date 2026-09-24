import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * The URL is the single source of truth for archive filters — there is no
 * local filter state anywhere in the app.
 *
 * `?sector=&discipline=&client=&year=&sort=year|az&view=list|grid`
 *
 * Changing a filter uses `replace: true` so the back button steps out of the
 * archive rather than walking back through every chip the visitor tried.
 */

const DEFAULTS = { sector: "", discipline: "", client: "", year: "", sort: "year", view: "list" };

export function useFilterParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const read = (key) => searchParams.get(key) || DEFAULTS[key];
    return {
      sector: read("sector"),
      discipline: read("discipline"),
      client: read("client"),
      year: read("year"),
      sort: read("sort"),
      view: read("view"),
    };
  }, [searchParams]);

  const setFilter = useCallback(
    (key, value) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (!value || value === DEFAULTS[key]) {
            next.delete(key);
          } else {
            next.set(key, value);
          }
          return next;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  /** Chips behave as toggles — clicking the active one clears it. */
  const toggleFilter = useCallback(
    (key, value) => setFilter(key, filters[key] === value ? "" : value),
    [filters, setFilter],
  );

  const clearFilters = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        ["sector", "discipline", "client", "year"].forEach((key) => next.delete(key));
        return next;
      },
      { replace: true, preventScrollReset: true },
    );
  }, [setSearchParams]);

  const activeCount = ["sector", "discipline", "client", "year"].filter(
    (key) => filters[key],
  ).length;

  /** Carried into the project route so next/prev respects the same order. */
  const filterQuery = useMemo(() => {
    const params = new URLSearchParams();
    ["sector", "discipline", "client", "year", "sort"].forEach((key) => {
      if (filters[key] && filters[key] !== DEFAULTS[key]) params.set(key, filters[key]);
    });
    const string = params.toString();
    return string ? `?${string}` : "";
  }, [filters]);

  return { filters, setFilter, toggleFilter, clearFilters, activeCount, filterQuery };
}
