import { NextResponse } from "next/server";
import { parseAuthResponse, parseLoginInput } from "@/lib/validation/auth";

export async function POST(request: Request) {
  try {
    const parsed = parseLoginInput(await request.json());

    return NextResponse.json(
      parseAuthResponse({
        ok: true,
        user: {
          id: "usr_mock_001",
          fullName: "DocuForge User",
          email: parsed.email,
        },
        token: "mock-token-login",
      }),
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid login payload" }, { status: 400 });
  }
}
