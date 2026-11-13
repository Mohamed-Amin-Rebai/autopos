import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/features(.*)",
  "/solutions(.*)",
  "/how-it-works(.*)",
  "/pricing(.*)",
  "/contact(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/cashier(.*)",
  "/receipt(.*)",
  "/api/cashier-login(.*)",
  "/api/cashier-logout(.*)",
  "/api/cashier/(.*)",
  "/api/checkout(.*)",
  "/api/webhooks/clerk(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (!isPublicRoute(req)) {
    if (!userId) {
      return Response.redirect(
        new URL("/sign-in", req.url)
      );
    }
  }
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};