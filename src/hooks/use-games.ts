"use client";

import { useEffect, useState } from "react";
import { games as localGames, tournament } from "@/data/tournament";
import { gamesFromCsv } from "@/lib/schedule";

const REFRESH_MS = 60_000;

/** Games from the published Google Sheet when one is set, otherwise the data file. */
export function useGames() {
  const [games, setGames] = useState(localGames);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [failed, setFailed] = useState(false);
  const url = tournament.scheduleCsvUrl;

  useEffect(() => {
    if (!url) return;
    let active = true;

    async function load() {
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) throw new Error(`Sheet returned ${response.status}`);
        const next = gamesFromCsv(await response.text());
        if (!active) return;
        setGames(next);
        setUpdatedAt(new Date());
        setFailed(false);
      } catch {
        // Keep showing the last good copy; the next refresh may recover.
        if (active) setFailed(true);
      }
    }

    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [url]);

  const isLive = Boolean(url);
  return { games, updatedAt, failed, isLive, loading: isLive && !updatedAt && !failed };
}
