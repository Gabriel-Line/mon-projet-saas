
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 1. Récupérer les cookies de session
    const userId = request.cookies.get('userId')?.value;
    const userRole = request.cookies.get('userRole')?.value;

    const { pathname } = request.nextUrl;

    // 2. Protection de la route /admin
    // Si l'utilisateur essaie d'aller sur /admin...
    if (pathname.startsWith('/admin')) {
        // ...mais qu'il n'est pas connecté
        if (!userId) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // ...ou qu'il est connecté mais n'est pas VENDEUR
        if (userRole?.toLowerCase() !== 'vendeur') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // 3. Empêcher un utilisateur déjà connecté d'aller sur /login ou /register
    if (userId && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// 4. Configurer sur quelles routes le middleware doit s'exécuter
export const config = {
    matcher: [
        '/admin/:path*', 
        '/login', 
        '/register'
    ],
};