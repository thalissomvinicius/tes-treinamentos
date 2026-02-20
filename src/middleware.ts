import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAdmin } from '@/lib/admin'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()

    // ========================================
    // MODO TESTE — Remover em produção!
    // Permite acesso ao dashboard sem login
    // ========================================
    const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true'
    if (isTestMode) {
        return res
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        res.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // Admin routes — must be logged in AND be admin
    if (req.nextUrl.pathname.startsWith('/admin')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', req.url))
        }
        if (!isAdmin(session.user.email)) {
            return NextResponse.redirect(new URL('/dashboard', req.url))
        }
        return res
    }

    // Dashboard routes — must be logged in AND have paid access
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', req.url))
        }

        // Check if user has access
        const { data: purchase, error: purchaseError } = await supabase
            .from('purchases')
            .select('paid')
            .eq('user_id', session.user.id)
            .eq('paid', true)
            .single()

        if (purchaseError) {
            // Error checking purchase
        }

        if (!purchase?.paid) {
            return NextResponse.redirect(new URL('/checkout', req.url))
        }
    }

    return res
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*'],
}
