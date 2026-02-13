import { NextRequest, NextResponse } from "next/server";
import { decrypt, SESSION_COOKIE_NAME } from "@/lib/auth";

const PROTECTED_ROUTES = ["/dashboard", "/quests", "/focus", "/achievements", "/profile"];
const AUTH_ROUTES = ["/login", "/register", "/"];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isProtectedRoute = PROTECTED_ROUTES.some(route => path.startsWith(route));
    const isAuthRoute = AUTH_ROUTES.includes(path);

    const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = cookie ? await decrypt(cookie).catch(() => null) : null;

    // 1. Redirect to login if accessing protected route without session
    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    // 2. Redirect to dashboard if accessing auth route with valid session
    if (isAuthRoute && session && path !== "/") {
        return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    }

    // Note: We can't easily check 'isOnboarded' in middleware without a DB call
    // which is expensive for middleware. We handle the onboarding check 
    // inside the Server Components of the protected pages instead.

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
