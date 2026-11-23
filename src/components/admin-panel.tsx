"use client";

import { Check, ChevronDown, LoaderCircle, LogOut, Minus, Plus, RotateCcw, Trash2 } from "lucide-react";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import { teams, tournament, type Game } from "@/data/tournament";
import { asset } from "@/lib/asset";
import { dayOf, findTeam } from "@/lib/schedule";

type Status = NonNullable<Game["status"]>;

/** Score boxes are text while editing, so a cleared box stays empty instead of becoming 0. */
type Draft = Omit<Game, "homeScore" | "awayScore" | "homePim" | "awayPim" | "status"> & {
  homeScore: string;
  awayScore: string;
  homePim: string;
  awayPim: string;
  status: Status;
};

const STATUSES: { value: Status; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "live", label: "Live" },
  { value: "final", label: "Final" },
];

/** Labels used for the finals before their teams are known. */
const PLACEHOLDERS = ["TBD", "1st Place", "2nd Place", "3rd Place", "4th Place"];

const num = (value?: number) => (value === undefined ? "" : String(value));

function toDraft(game: Game): Draft {
  const scored = game.homeScore !== undefined && game.awayScore !== undefined;
  return {
    ...game,
    homeScore: num(game.homeScore),
    awayScore: num(game.awayScore),
    homePim: num(game.homePim),
    awayPim: num(game.awayPim),
    status: game.status ?? (scored ? "final" : "upcoming"),
  };
}

function sameAsSaved(draft: Draft, game: Game) {
  return JSON.stringify(draft) === JSON.stringify(toDraft(game));
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(asset(path), {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw Object.assign(new Error(body.error ?? "Something went wrong."), {
      status: response.status,
    });
  }
  return body as T;
}

type Saved = { games: Game[]; updatedAt: string | null };

/* ---------------------------------------------------------------- Sign in */

function SignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      await api("/api/session/", {
        method: "POST",
        body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
      });
      onSignedIn();
    } catch (failure) {
      setError((failure as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const field =
    "mt-1.5 h-12 w-full rounded-lg border border-white/15 bg-plum-900 px-3.5 text-white outline-none focus:border-bronze-300";

  return (
    <div className="mx-auto max-w-sm">
      <p className="eyebrow">{tournament.name}</p>
      <h1 className="display mt-2 text-3xl text-white sm:text-4xl">Scorekeeper sign in</h1>
      <form onSubmit={submit} className="panel mt-6 grid gap-4 p-5">
        <label className="text-sm font-medium text-ice-200">
          Username
          <input name="username" autoComplete="username" autoCapitalize="none" required className={field} />
        </label>
        <label className="text-sm font-medium text-ice-200">
          Password
          <input name="password" type="password" autoComplete="current-password" required className={field} />
        </label>
        {error && (
          <p role="alert" className="text-sm text-red-300">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className="btn mt-1 w-full disabled:opacity-60">
          {busy && <LoaderCircle className="size-4 animate-spin" />}
          Sign in
        </button>
      </form>
    </div>
  );
}

/* ---------------------------------------------------------------- One game */

function Stepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const step = (by: number) => onChange(String(Math.max(0, (Number(value) || 0) + by)));
  const round = "flex size-11 shrink-0 items-center justify-center rounded-lg bg-white/[0.07] text-white active:bg-white/15";

  return (
    <div className="flex items-center gap-1.5">
      <button type="button" aria-label={`${label}, one less`} onClick={() => step(-1)} className={round}>
        <Minus className="size-4" />
      </button>
      <input
        aria-label={label}
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 3))}
        placeholder="–"
        className="h-11 w-12 rounded-lg border border-white/15 bg-plum-900 text-center font-display text-2xl font-bold text-white tabular-nums outline-none focus:border-bronze-300"
      />
      <button type="button" aria-label={`${label}, one more`} onClick={() => step(1)} className={round}>
        <Plus className="size-4" />
      </button>
    </div>
  );
}

function TeamPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const known = [...teams.map((team) => team.shortName), ...PLACEHOLDERS];
  const options = known.includes(value) ? known : [value, ...known];

  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 min-w-0 flex-1 rounded-lg border border-white/15 bg-plum-900 px-2.5 font-medium text-white outline-none focus:border-bronze-300"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function GameEditor({
  game,
  onSaved,
  onSignedOut,
}: {
  game: Game;
  onSaved: (saved: Saved) => void;
  onSignedOut: () => void;
}) {
  const [draft, setDraft] = useState(() => toDraft(game));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [justSaved, setJustSaved] = useState(false);
  const [open, setOpen] = useState(false);
  const dirty = !sameAsSaved(draft, game);

  // Take in changes from the other scorekeeper, unless this card has unsaved edits.
  const [seen, setSeen] = useState(game);
  if (seen !== game) {
    setSeen(game);
    if (sameAsSaved(draft, seen)) setDraft(toDraft(game));
  }

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  async function send(body: object) {
    setBusy(true);
    setError("");
    try {
      const saved = await api<Saved>("/api/games/", { method: "POST", body: JSON.stringify(body) });
      // The server tidies what it saves (trimmed spaces and so on), so show its copy.
      const mine = saved.games.find((other) => other.id === game.id);
      if (mine) setDraft(toDraft(mine));
      onSaved(saved);
      return true;
    } catch (failure) {
      if ((failure as { status?: number }).status === 401) onSignedOut();
      setError((failure as Error).message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    const saved = await send({ action: "update", game: draft });
    if (saved) {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }
  }

  async function remove() {
    if (!confirm(`Remove ${game.home} vs ${game.away} at ${game.time}? It disappears from the site.`)) return;
    await send({ action: "remove", id: game.id });
  }

  const homeTeam = findTeam(draft.home);
  const awayTeam = findTeam(draft.away);
  const small =
    "h-10 w-full rounded-lg border border-white/15 bg-plum-900 px-3 text-white outline-none focus:border-bronze-300";

  return (
    <article
      className={`panel p-4 ${draft.status === "live" ? "border-bronze-300/70" : ""} ${
        dirty ? "ring-1 ring-bronze-300/50" : ""
      }`}
    >
      <header className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-ice-200">
          {draft.time}
          {draft.stage && <span className="text-bronze-300"> · {draft.stage}</span>}
        </p>
        <div role="radiogroup" aria-label="Game status" className="flex rounded-lg bg-white/[0.06] p-0.5">
          {STATUSES.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={draft.status === option.value}
              onClick={() => set("status", option.value)}
              className={`h-9 rounded-md px-3 text-sm font-semibold transition-colors ${
                draft.status === option.value
                  ? option.value === "live"
                    ? "bg-bronze-300 text-ink"
                    : "bg-white/15 text-white"
                  : "text-ice-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </header>

      <div className="mt-4 grid gap-3">
        {(
          [
            ["home", "Home", homeTeam] as const,
            ["away", "Visitor", awayTeam] as const,
          ]
        ).map(([side, role, team]) => (
          <div key={side} className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-9 w-1.5 shrink-0 rounded-full"
              style={{ background: team?.colours.main ?? "rgb(255 255 255 / 0.1)" }}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-xs text-ice-300">{role}</span>
              <TeamPicker label={`${role} team`} value={draft[side]} onChange={(value) => set(side, value)} />
            </div>
            <Stepper
              label={`${role} goals`}
              value={draft[`${side}Score`]}
              onChange={(value) => set(`${side}Score`, value)}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="mt-3 flex min-h-11 items-center gap-1.5 text-sm font-medium text-ice-300 hover:text-white"
      >
        <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} />
        Penalty minutes, note and game details
      </button>

      {open && (
        <div className="grid gap-3 pb-1 sm:grid-cols-2">
          <label className="text-sm text-ice-300">
            {draft.home} PIM
            <input
              inputMode="numeric"
              value={draft.homePim}
              onChange={(event) => set("homePim", event.target.value.replace(/\D/g, "").slice(0, 3))}
              className={`${small} mt-1`}
            />
          </label>
          <label className="text-sm text-ice-300">
            {draft.away} PIM
            <input
              inputMode="numeric"
              value={draft.awayPim}
              onChange={(event) => set("awayPim", event.target.value.replace(/\D/g, "").slice(0, 3))}
              className={`${small} mt-1`}
            />
          </label>
          <label className="text-sm text-ice-300 sm:col-span-2">
            Note shown on the game, e.g. &ldquo;Won in a shootout&rdquo;
            <input value={draft.note ?? ""} onChange={(event) => set("note", event.target.value || undefined)} className={`${small} mt-1`} />
          </label>
          <label className="text-sm text-ice-300">
            Day
            <select value={draft.day} onChange={(event) => set("day", event.target.value)} className={`${small} mt-1`}>
              {tournament.days.map((day) => (
                <option key={day.date} value={day.date}>
                  {day.label}
                </option>
              ))}
              {!tournament.days.some((day) => day.date === draft.day) && <option value={draft.day}>{draft.day}</option>}
            </select>
          </label>
          <label className="text-sm text-ice-300">
            Time
            <input value={draft.time} onChange={(event) => set("time", event.target.value)} className={`${small} mt-1`} />
          </label>
          <label className="text-sm text-ice-300">
            Stage (blank for round robin)
            <input
              value={draft.stage ?? ""}
              onChange={(event) => set("stage", event.target.value || undefined)}
              placeholder="Round robin"
              className={`${small} mt-1`}
            />
          </label>
          <div className="flex items-end">
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-red-300 hover:bg-red-400/10"
            >
              <Trash2 className="size-4" />
              Remove game
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="mt-3 flex items-center justify-end gap-3">
        {dirty && !busy && (
          <button
            type="button"
            onClick={() => setDraft(toDraft(game))}
            className="h-11 px-2 text-sm font-medium text-ice-300 hover:text-white"
          >
            Undo
          </button>
        )}
        {justSaved && !dirty && (
          <span aria-live="polite" className="flex items-center gap-1 text-sm font-medium text-bronze-300">
            <Check className="size-4" /> Saved
          </span>
        )}
        <button type="button" onClick={save} disabled={!dirty || busy} className="btn disabled:opacity-40">
          {busy && <LoaderCircle className="size-4 animate-spin" />}
          Save
        </button>
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------- Panel */

const REFRESH_MS = 20_000;

function Scoreboard({ onSignedOut }: { onSignedOut: () => void }) {
  const [saved, setSaved] = useState<Saved | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setSaved(await api<Saved>("/api/games/?fresh"));
      setError("");
    } catch (failure) {
      setError((failure as Error).message);
    }
  }, []);

  useEffect(() => {
    // Picks up what another scorekeeper saved. Cards with unsaved edits keep them.
    const first = setTimeout(load, 0);
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [load]);

  async function change(body: object, question?: string) {
    if (question && !confirm(question)) return;
    try {
      setSaved(await api<Saved>("/api/games/", { method: "POST", body: JSON.stringify(body) }));
    } catch (failure) {
      if ((failure as { status?: number }).status === 401) onSignedOut();
      setError((failure as Error).message);
    }
  }

  async function signOut() {
    await api("/api/session/", { method: "DELETE" }).catch(() => {});
    onSignedOut();
  }

  const updated = saved?.updatedAt
    ? new Date(saved.updatedAt).toLocaleString("en-CA", {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Scorekeeper panel</p>
          <h1 className="display mt-1 text-3xl text-white sm:text-4xl">Scores</h1>
          <p className="mt-1.5 text-sm text-ice-300">
            {updated ? `Last saved ${updated}` : "Nothing saved yet"}
            <br />
            The public site picks up changes within about 20 seconds.
          </p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="flex min-h-11 items-center gap-1.5 text-sm font-medium text-ice-300 hover:text-white"
        >
          <LogOut className="size-4" /> Sign out
        </button>
      </div>

      {error && (
        <p role="alert" className="panel mt-5 border-red-400/40 p-4 text-sm text-red-200">
          {error}
        </p>
      )}

      {!saved ? (
        <p className="mt-10 flex items-center gap-2 text-ice-300">
          <LoaderCircle className="size-4 animate-spin" /> Loading games…
        </p>
      ) : (
        <>
          {[...tournament.days, null].map((day) => {
            const dayGames = saved.games.filter((game) =>
              day ? dayOf(game)?.date === day.date : !dayOf(game),
            );
            if (dayGames.length === 0) return null;
            return (
              <div key={day?.date ?? "other"} className="mt-8">
                <h2 className="font-semibold text-white">{day?.label ?? "Other games"}</h2>
                <div className="mt-3 grid gap-3">
                  {dayGames.map((game) => (
                    <GameEditor key={game.id} game={game} onSaved={setSaved} onSignedOut={onSignedOut} />
                  ))}
                </div>
              </div>
            );
          })}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-6">
            <button
              type="button"
              onClick={() =>
                change({
                  action: "add",
                  game: {
                    day: tournament.days.at(-1)!.date,
                    time: "TBD",
                    home: "TBD",
                    away: "TBD",
                    stage: "Exhibition",
                  },
                })
              }
              className="btn"
            >
              <Plus className="size-4" /> Add a game
            </button>
            <button
              type="button"
              onClick={() =>
                change(
                  { action: "reset" },
                  "Put back the original schedule? Every score entered so far will be erased.",
                )
              }
              className="flex min-h-11 items-center gap-1.5 text-sm font-medium text-ice-300 hover:text-red-300"
            >
              <RotateCcw className="size-4" /> Reset to the original schedule
            </button>
          </div>
        </>
      )}
    </>
  );
}

export function AdminPanel() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    api<{ signedIn: boolean }>("/api/session/")
      .then((session) => setSignedIn(session.signedIn))
      .catch(() => setSignedIn(false));
  }, []);

  if (signedIn === null) {
    return (
      <p className="flex items-center gap-2 py-10 text-ice-300">
        <LoaderCircle className="size-4 animate-spin" /> Loading…
      </p>
    );
  }

  return signedIn ? (
    <Scoreboard onSignedOut={() => setSignedIn(false)} />
  ) : (
    <SignIn onSignedIn={() => setSignedIn(true)} />
  );
}
