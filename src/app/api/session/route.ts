import { type NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_SECONDS,
  checkLogin,
  createSession,
  isValidSession,
  loginConfigured,
} from "@/lib/auth";

/** Whether this browser is signed in to the scorekeeper panel. */
export async function GET(request: NextRequest) {
  return NextResponse.json({
    signedIn: isValidSession(request.cookies.get(SESSION_COOKIE)?.value),
    loginConfigured,
  });
}

/** Signs in. */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as {
    username?: unknown;
    password?: unknown;
  };
  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!checkLogin(username, password)) {
    // A short pause makes guessing the password slow.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return NextResponse.json(
      {
        error: loginConfigured
          ? "That username or password isn't right."
          : "The scorekeeper login hasn't been set up on the server yet.",
      },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ signedIn: true });
  response.cookies.set(SESSION_COOKIE, createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return response;
}

/** Signs out. */
export async function DELETE() {
  const response = NextResponse.json({ signedIn: false });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
