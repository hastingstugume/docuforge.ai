import { NextResponse } from "next/server";
import { parseAuthResponse, parseSignupInput } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const parsed = parseSignupInput(await request.json());

    return NextResponse.json(
      parseAuthResponse({
        ok: true,
        user: {
          id: "usr_mock_002",
          fullName: parsed.fullName,
          email: parsed.email,
        },
        token: "mock-token-signup",
      }),
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid signup payload" }, { status: 400 });
  }
}
