import { NextResponse } from "next/server";

import { getAccessToken } from "@/lib/mpesa";

export async function POST() {
  try {
    const accessToken = await getAccessToken();
    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("[MPESA_TOKEN_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to generate M-Pesa access token." },
      { status: 500 },
    );
  }
}

