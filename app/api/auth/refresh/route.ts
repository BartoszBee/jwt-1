
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyRefreshToken, createAccessToken, createRefreshToken } from "@/lib/jwt";


export async function POST() {
  const cookieStore = await cookies();

  // Pobieram refresh token z ciasteczka
  const refreshToken = cookieStore.get("refresh_token")?.value;

  // Brak refresh tokena → użytkownik wylogowany
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  // Sprawdzam podpis i datę ważności
  const payload = await verifyRefreshToken(refreshToken);

  if (!payload) {
    return NextResponse.json({ error: "Refresh token expired or invalid" }, { status: 401 });
  }

  //   Token OK → robię nowe tokeny
  const newPayload = {
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
  };

  const newAccessToken = await createAccessToken(newPayload);
  const newRefreshToken = await createRefreshToken(newPayload);

  // Nadpisanie ciastek
  cookieStore.set("access_token", newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("refresh_token", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({
    message: "Tokens refreshed",
  });
}
