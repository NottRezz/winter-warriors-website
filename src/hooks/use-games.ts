"use client";

import { useSyncExternalStore } from "react";
import { games as localGames, tournament, type Game } from "@/data/tournament";
import { gamesFromCsv } from "@/lib/schedule";

const REFRESH_MS = 60_000;
const TIMEOUT_MS = 15_000;

type State = { games: Game[]; updatedAt: Date | null; failed: boolean };

// Shared by every component, so the Schedule and team pages always agree and scores
// don't disappear while moving between pages.
const initial: State = { games: localGames, updatedAt: null, failed: false };
let state = initial;
let refreshing = false;
const listeners = new Set<() => void>();

function publish(next: State) {
  state = next;
  listeners.forEach((listener) => listener());
}

async function refresh() {
  if (refreshing) return;
  refreshing = true;

  // Arena wifi can hang, and one stuck request mustn't stop every later one.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(tournament.scheduleCsvUrl, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Sheet returned ${response.status}`);
    const games = gamesFromCsv(await response.text());
    // An unpublished or half-edited sheet can answer with a page that has no games in it.
    if (games.length === 0) throw new Error("Sheet had no games");
    publish({ games, updatedAt: new Date(), failed: false });
  } catch {
    // Keep showing the last good copy; the next refresh may recover.
    publish({ ...state, failed: true });
  } finally {
    clearTimeout(timeout);
    refreshing = false;
  }
}

// Phones pause timers while locked, so check again as soon as someone looks.
function refreshIfVisible() {
  if (document.visibilityState === "visible") refresh();
}

let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (tournament.scheduleCsvUrl && listeners.size === 1) {
    refresh();
    timer = setInterval(refresh, REFRESH_MS);
    document.addEventListener("visibilitychange", refreshIfVisible);
    window.addEventListener("online", refresh);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size > 0) return;
    clearInterval(timer);
    document.removeEventListener("visibilitychange", refreshIfVisible);
    window.removeEventListener("online", refresh);
  };
}

/**
 * Games from the published Google Sheet when one is set, otherwise the data file. The
 * data file's schedule also shows until the sheet first loads, or if it can't be reached.
 */
export function useGames() {
  const current = useSyncExternalStore(subscribe, () => state, () => initial);
  return { ...current, isLive: Boolean(tournament.scheduleCsvUrl) };
}
