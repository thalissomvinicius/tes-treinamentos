'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email || !password) return

        setLoading(true)
        setError('')

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (signInError) {
            if (signInError.message === 'Invalid login credentials') {
                setError('E-mail ou senha incorretos.')
            } else {
                setError(signInError.message)
            }
        } else {
            window.location.href = '/dashboard'
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex">
            {/* Left side — Brand panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-900 relative overflow-hidden items-center justify-center p-12">
                {/* Decorative shapes */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-blue-300/20 blur-2xl" />
                    <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-indigo-300/20 blur-2xl" />
                </div>

                <div className="relative z-10 max-w-md text-center">
                    <div className="text-5xl font-extrabold mb-6">
                        <span className="text-white">T</span>
                        <span className="text-blue-200">&</span>
                        <span className="text-white">S</span>
                        <span className="text-blue-300 text-2xl font-semibold ml-2">Cursos</span>
                    </div>
                    <h2 className="text-white text-2xl font-bold mb-4">eSocial na Prática — SST</h2>
                    <p className="text-blue-200 text-sm leading-relaxed">
                        Domine os eventos S-2210, S-2220 e S-2240 com conteúdo prático e direto ao ponto.
                        Complete os 5 módulos e receba seu certificado digital.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 text-sm text-blue-300">
                        <div className="flex items-center gap-2 justify-center">
                            <span className="w-5 h-5 bg-blue-500/30 rounded-full flex items-center justify-center text-xs">✓</span>
                            5 módulos completos
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                            <span className="w-5 h-5 bg-blue-500/30 rounded-full flex items-center justify-center text-xs">✓</span>
                            Quizzes de fixação
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                            <span className="w-5 h-5 bg-blue-500/30 rounded-full flex items-center justify-center text-xs">✓</span>
                            Certificado digital T&S Cursos
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side — Login form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
                <div className="w-full max-w-sm">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="text-3xl font-extrabold">
                            <span className="text-blue-700">T</span>
                            <span className="text-slate-400">&</span>
                            <span className="text-blue-700">S</span>
                            <span className="text-slate-500 text-lg font-semibold ml-1">Cursos</span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-extrabold text-slate-800 mb-2">
                        Entrar na plataforma
                    </h1>
                    <p className="text-slate-500 text-sm mb-8">
                        Use o e-mail e senha fornecidos pelo administrador.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="login-email" className="block text-sm font-semibold text-slate-700 mb-2">
                                E-mail
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                required
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="login-password" className="block text-sm font-semibold text-slate-700 mb-2">
                                Senha
                            </label>
                            <div className="relative">
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-3.5 pr-12 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                                <p className="text-red-500 text-sm text-center">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!email || !password || loading}
                            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Entrando...
                                </span>
                            ) : (
                                'Entrar'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link href="/" className="text-sm text-slate-400 hover:text-blue-600 transition">
                            ← Voltar para o site
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
