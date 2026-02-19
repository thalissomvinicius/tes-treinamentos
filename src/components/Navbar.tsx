'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'

export default function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isAdminUser, setIsAdminUser] = useState(false)

    useEffect(() => {
        async function checkAdmin() {
            if (!isLoggedIn) return
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.email && isAdmin(user.email)) {
                setIsAdminUser(true)
            }
        }
        checkAdmin()
    }, [isLoggedIn])

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group relative">
                        <div className="flex items-center gap-1.5">
                            <span className="text-2xl font-extrabold tracking-tighter flex items-center">
                                <span className="text-blue-700">T</span>
                                <span className="text-slate-300 mx-px">&</span>
                                <span className="text-blue-700">S</span>
                            </span>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:block mt-1">Treinamentos</span>
                        </div>
                        {/* Animated Underline */}
                        <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-700 to-indigo-600 transition-all duration-300 group-hover:w-full" />
                    </Link>

                    {/* Desktop links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/#modulos" className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">
                            Módulos
                        </Link>
                        <Link href="/#certificado" className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">
                            Certificado
                        </Link>
                        <Link href="/#faq" className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors">
                            FAQ
                        </Link>
                        {isAdminUser && (
                            <Link
                                href="/admin"
                                className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1"
                            >
                                🔧 Admin
                            </Link>
                        )}
                        {isLoggedIn ? (
                            <Link
                                href="/dashboard"
                                className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-700/25"
                            >
                                Meu Painel
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-blue-700/25"
                            >
                                Entrar
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Menu"
                    >
                        {mobileOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
                    <div className="px-4 py-4 space-y-3">
                        <Link href="/#modulos" className="block text-sm font-medium text-slate-600 hover:text-blue-700" onClick={() => setMobileOpen(false)}>
                            Módulos
                        </Link>
                        <Link href="/#certificado" className="block text-sm font-medium text-slate-600 hover:text-blue-700" onClick={() => setMobileOpen(false)}>
                            Certificado
                        </Link>
                        <Link href="/#faq" className="block text-sm font-medium text-slate-600 hover:text-blue-700" onClick={() => setMobileOpen(false)}>
                            FAQ
                        </Link>
                        {isAdminUser && (
                            <Link href="/admin" className="block text-sm font-medium text-amber-600 hover:text-amber-700" onClick={() => setMobileOpen(false)}>
                                🔧 Painel Admin
                            </Link>
                        )}
                        <Link
                            href={isLoggedIn ? '/dashboard' : '/login'}
                            className="block w-full text-center bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition"
                            onClick={() => setMobileOpen(false)}
                        >
                            {isLoggedIn ? 'Meu Painel' : 'Entrar'}
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}
