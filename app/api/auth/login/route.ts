
import { NextResponse } from "next/server";
import { createAccessToken, createRefreshToken } from "@/lib/jwt";
import { users } from "@/lib/users";
import { cookies } from "next/headers";
import type { JWTPayload} from "jose";


export async function POST(req: Request) {
    const body = await req.json();
    const { email, password } = body;

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
    const payload:JWTPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
    };

    // 3) Tworzymy tokeny
    const accessToken = await createAccessToken(payload);
    const refreshToken = await createRefreshToken(payload);

    // 4) Umieszczamy bilety w bezpiecznych cookie
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
