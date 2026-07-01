import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // ✅ protect private routes
  if (!isPublicRoute(req)) {
    if (!userId) {
      return Response.redirect(new URL("/sign-in", req.url));
    }
  }

  // ✅ admin protection
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const { sessionClaims } = await auth();

    const role = sessionClaims?.role;

    if (role !== "admin") {
      return Response.redirect(new URL("/dashboard", req.url));
    }
  }
});