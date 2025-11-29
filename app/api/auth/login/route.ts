
import { NextResponse } from "next/server";
import { createAccessToken, createRefreshToken } from "@/lib/jwt";
import { users } from "@/lib/users";
import { cookies } from "next/headers";
import type { JWTPayload } from "jose";


export async function POST(req: Request) {
    let body;

    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid JSON" },
            { status: 400 }
        );
    }

    if (!body || typeof body !== "object") {
        return NextResponse.json(
            { error: "Request body must be JSON" },
            { status: 400 }
        );
    }

    const { email, password } = body || {};

    if (!email || !password) {
        return NextResponse.json(
            { error: "Email and password are required" },
            { status: 400 }
        );
    }

    // Szukamy użytkownika (na razie prosta, wbudowana lista)
    const user = users.find(
        (u) => u.email === email.toLowerCase() && u.password === password
    );

    if (!user) {
        return NextResponse.json(
            { error: "Invalid credentials" },
            { status: 401 }
        );
    }

    // 2) Payload do tokena (nie dajemy nic tajnego)
    const payload: JWTPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
    };

    // 3) Tworzymy tokeny
    const accessToken = await createAccessToken(payload);
    const refreshToken = await createRefreshToken(payload);

    // 4) Umieszczamy tokeny w bezpiecznych cookie
    const cookieStore = await cookies();
    cookieStore.set("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
    });

    cookieStore.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
    });

    // 5) Odpowiadamy użytkownikowi
    return NextResponse.json({
        message: "Logged in",
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
    });
}
