"use client";

import { useGames } from "@/hooks/use-games";

/** Says how fresh the scores are. Only appears once a score sheet is connected. */
export function LiveStatus() {
  const { isLive, failed, updatedAt } = useGames();
  if (!isLive) return null;

  const time = updatedAt?.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit" });

  return (
    <p aria-live="polite" className="text-sm text-ice-300">
      {failed
        ? time
          ? `Reconnecting, scores from ${time}`
          : "Reconnecting to live scores…"
        : time
          ? `Live scores, checked ${time}`
          : "Loading live scores…"}
    </p>
  );
}
