export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout/shipping", "/checkout/payment", "/checkout/place-order"],
};
