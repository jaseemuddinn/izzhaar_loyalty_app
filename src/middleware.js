import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    // Allow unauthenticated access to /admin/login
    if (pathname === '/admin/login') {
        return NextResponse.next();
    }
    const isAdminRoute = pathname.startsWith('/admin');
    if (isAdminRoute) {
        const cookie = request.cookies.get('admin_auth');
        if (!cookie || cookie.value !== 'true') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
