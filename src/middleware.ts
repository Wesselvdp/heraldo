// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authConfig } from "./lib/auth";

// const unprotectedRoutes = ["/"];

// export default async function middleware(req: NextRequest) {
//   if (!unprotectedRoutes.includes(req.nextUrl.pathname)) {
//     const session = await getServerSession(authConfig);
//     if (session) return;
//     const absoluteURL = new URL("/", req.nextUrl.origin);
//     return NextResponse.redirect(absoluteURL.toString());
//   }
// }

// Uncomment below
export { default } from "next-auth/middleware";
export const config = { matcher: ["/subscriptions/:path*"] };
