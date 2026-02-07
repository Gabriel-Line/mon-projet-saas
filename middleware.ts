

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
   
    const userId = request.cookies.get('userId')?.value;
    const userRole = request.cookies.get('userRole')?.value;

    const { pathname } = request.nextUrl;

    
    if (pathname.startsWith('/admin')) {
        
        if (!userId) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        
        if (userRole?.toLowerCase() !== 'vendeur') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    
    if (userId && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        '/admin/:path*', 
        '/login', 
        '/register'
    ],
};