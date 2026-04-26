import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/shipping", "/checkout/payment", "/checkout/place-order"],
};
