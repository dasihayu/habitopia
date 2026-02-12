import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = process.env.JWT_SECRET || "habitiopia-super-secret-key-12345";
const key = new TextEncoder().encode(secretKey);

export const SESSION_COOKIE_NAME = "habitopia_session";

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}

export async function createSession(userId: string) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId, expires });

    (await cookies()).set(SESSION_COOKIE_NAME, session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
}

export async function getSession() {
    const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    if (!session) return null;
    try {
        return await decrypt(session);
    } catch {
        return null;
    }
}

export async function deleteSession() {
    (await cookies()).delete(SESSION_COOKIE_NAME);
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const res = NextResponse.next();
    res.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });
    return res;
}
