

import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function POST() {
  const cookieStore = await cookies();

  //  Czyścimy access token
  cookieStore.set("access_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0), 
  });

  //  Czyścimy refresh token
  cookieStore.set("refresh_token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });

 
  return NextResponse.json({ message: "Logged out" });
}
