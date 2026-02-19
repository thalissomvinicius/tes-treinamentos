'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function CertificadoPage() {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingUser, setLoadingUser] = useState(true)
    const [done, setDone] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadUser() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const fetchedName = user.user_metadata?.name || user.user_metadata?.full_name || ''
                setName(fetchedName)
            }
            setLoadingUser(false)
        }
        loadUser()
    }, [])

    async function handleDownload() {
        setLoading(true)
        setError('')

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            setError('Você precisa estar logado.')
            setLoading(false)
            return
        }

        try {
            const res = await fetch('/api/certificado', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id }),
            })

            if (!res.ok) {
                const err = await res.json()
                setError(err.error || 'Erro ao gerar certificado.')
                setLoading(false)
                return
            }

            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'certificado-tes-cursos.pdf'
            a.click()
            URL.revokeObjectURL(url)
            setDone(true)
        } catch {
            setError('Erro de conexão. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    if (loadingUser) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar isLoggedIn />

            <main className="pt-24 pb-16 px-4 flex items-center justify-center min-h-screen">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/20 border border-slate-100 p-10 text-center">
                        {/* Icon */}
                        <div className="mb-6">
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-4xl">🎓</span>
                            </div>
                        </div>

                        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Seu Certificado</h1>
                        <p className="text-slate-500 text-sm mb-8">
                            Emitido por{' '}
                            <span className="font-bold text-blue-700">T&S Treinamentos</span>
                        </p>

                        {done ? (
                            /* Success */
                            <div>
                                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
                                    <div className="text-4xl mb-3">🎉</div>
                                    <p className="text-green-700 font-bold">Certificado baixado com sucesso!</p>
                                    <p className="text-green-600 text-sm mt-2">
                                        Confira o arquivo PDF na sua pasta de downloads.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setDone(false)}
                                    className="text-blue-700 hover:text-blue-800 font-semibold text-sm transition"
                                >
                                    Baixar novamente
                                </button>
                            </div>
                        ) : (
                            /* Final confirmation step */
                            <div className="space-y-6">
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        Nome no Certificado
                                    </label>
                                    <p className="text-lg font-bold text-slate-800 break-words">
                                        {name || 'Nome não definido'}
                                    </p>
                                </div>

                                {error && (
                                    <p className="text-red-500 text-sm text-center bg-red-50 rounded-lg p-3">
                                        {error}
                                    </p>
                                )}

                                {!name && (
                                    <p className="text-amber-600 text-xs bg-amber-50 p-3 rounded-lg">
                                        ⚠️ Seu nome não está configurado. Por favor, entre em contato com o suporte para corrigir seu cadastro.
                                    </p>
                                )}

                                <button
                                    onClick={handleDownload}
                                    disabled={!name || loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200/50 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Gerando...
                                        </span>
                                    ) : (
                                        '⬇️ Confirmar e Baixar'
                                    )}
                                </button>

                                <p className="text-xs text-slate-400 leading-relaxed px-4">
                                    O certificado é emitido com seu nome oficial de cadastro por segurança.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="text-center mt-6">
                        <Link
                            href="/dashboard"
                            className="text-slate-500 hover:text-blue-700 font-semibold text-sm transition"
                        >
                            ← Voltar ao painel
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

