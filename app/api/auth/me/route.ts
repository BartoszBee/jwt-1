

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/jwt";

/**
 * zwraca dane zalogowanego użytkownika 
 */
export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);

    if (!payload) {
        return NextResponse.json({ error: "Token expired or invalid" }, { status: 401 });
    }


    return NextResponse.json({
        user: {
            id: payload.sub,
            email: payload.email,
            role: payload.role,
        },
    });
}
