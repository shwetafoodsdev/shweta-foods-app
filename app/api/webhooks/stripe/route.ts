import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    received: true,
    message: "Stripe webhook endpoint scaffolded. Complete signature verification in payment phase.",
  });
}
