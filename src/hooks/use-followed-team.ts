"use client";

import { useSyncExternalStore } from "react";
import { teams } from "@/data/tournament";

const KEY = "winter-warriors:team";

const listeners = new Set<() => void>();
// Still works for the visit when storage is blocked, as in some private windows.
let unsaved: string | null = null;
let canStore = true;

function read() {
  if (!canStore) return unsaved;
  try {
    return localStorage.getItem(KEY);
  } catch {
    canStore = false;
    return unsaved;
  }
}

function follow(slug: string | null) {
  unsaved = slug;
  try {
    if (slug) localStorage.setItem(KEY, slug);
    else localStorage.removeItem(KEY);
  } catch {
    canStore = false;
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/** The team this visitor follows. It's only remembered on their own device. */
export function useFollowedTeam() {
  const slug = useSyncExternalStore(subscribe, read, () => null);
  return { followed: teams.find((team) => team.slug === slug) ?? null, follow };
}
