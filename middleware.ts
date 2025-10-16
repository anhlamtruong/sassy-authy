// Imports
// ========================================================
import { NextResponse } from "next/server";
import authConfig from "@/auth.config";
import NextAuth from "next-auth";
const { auth } = NextAuth(authConfig);
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
  apiPublicPrefix,
  authCLIRoutes,
} from "@/routes";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isApiPublicPrefix = nextUrl.pathname.startsWith(apiPublicPrefix);
  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isAuthCLIRoute = authCLIRoutes.includes(nextUrl.pathname);

  if (isPublicRoutes) {
    return;
  }
  if (isAuthCLIRoute) {
    return;
  }
  if (isApiAuthRoute) {
    return;
  }
  if (isApiPublicPrefix) {
    // Response
    const response = NextResponse.next();
    // Allowed origins check
    const origin = req.headers.get("origin") ?? "";
  }
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }
  if (!isLoggedIn && !isPublicRoutes) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }
  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
