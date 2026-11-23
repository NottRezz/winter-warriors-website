import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * One shared scorekeeper login. It's set in the Vercel project's environment variables
 * rather than in this file, because this repository is public.
 */
const USERNAME = process.env.ADMIN_USERNAME ?? "";
const PASSWORD = process.env.ADMIN_PASSWORD ?? "";

export const SESSION_COOKIE = "ww_scorekeeper";
/** Long enough for a full tournament day without signing in again. */
export const SESSION_SECONDS = 60 * 60 * 18;

// Changing the password signs everyone out, since the key comes from it.
const key = createHash("sha256")
  .update(`${process.env.SESSION_SECRET ?? ""}:${USERNAME}:${PASSWORD}`)
  .digest();

function same(a: string, b: string) {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

export const loginConfigured = Boolean(USERNAME && PASSWORD);

export function checkLogin(username: string, password: string) {
  if (!loginConfigured) return false;
  // Both are always compared, so the time taken doesn't say which one was wrong.
  const userOk = same(username.trim().toLowerCase(), USERNAME.toLowerCase());
  const passOk = same(password, PASSWORD);
  return userOk && passOk;
}

function sign(value: string) {
  return createHmac("sha256", key).update(value).digest("base64url");
}

export function createSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  return `${expires}.${sign(String(expires))}`;
}

export function isValidSession(cookie: string | undefined) {
  if (!cookie || !loginConfigured) return false;
  const [expires, signature] = cookie.split(".");
  if (!expires || !signature || Number(expires) * 1000 < Date.now()) return false;
  return same(signature, sign(expires));
}
