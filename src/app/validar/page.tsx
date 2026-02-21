'use client'

import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function ValidarContent() {
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ user_name: string; created_at: string } | null>(null)
    const [error, setError] = useState('')
    const [autoVerified, setAutoVerified] = useState(false)
    const searchParams = useSearchParams()

    async function verifyCodeValue(value: string) {
        setLoading(true)
        setError('')
        setResult(null)

        try {
            const { data, error: supabaseError } = await supabase
                .from('certificates')
                .select('*')
                .eq('code', value.trim())
                .single()

            if (supabaseError || !data) {
                setError('Certificado não encontrado. Verifique o código e tente novamente.')
            } else {
                setResult(data)
            }
        } catch {
            setError('Erro ao validar. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    async function handleVerify(e: React.FormEvent) {
        e.preventDefault()
        if (!code.trim()) return
        await verifyCodeValue(code)
    }

    useEffect(() => {
        const codeParam = searchParams.get('codigo')
        if (!codeParam || autoVerified) return
        setCode(codeParam)
        verifyCodeValue(codeParam)
        setAutoVerified(true)
    }, [searchParams, autoVerified])

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="pt-24 pb-16 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/20 border border-slate-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-center text-white">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-extrabold mb-2">Validador de Certificados</h1>
                            <p className="text-blue-100/80 text-sm">Verifique a autenticidade dos certificados emitidos pela T&S Cursos.</p>
                        </div>

                        <div className="p-8">
                            <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3 mb-8">
                                <input
                                    type="text"
                                    placeholder="Ex: TES-177..."
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !code.trim()}
                                    className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3 rounded-xl transition disabled:opacity-50"
                                >
                                    {loading ? 'Validando...' : 'Verificar'}
                                </button>
                            </form>

                            {error && (
                                <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-6 text-center animate-shake">
                                    <p className="font-bold">{error}</p>
                                </div>
                            )}

                            {result && (
                                <div className="bg-green-50 border border-green-100 rounded-2xl p-8 animate-slide-up">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-green-800 font-extrabold text-xl">Certificado Válido</h3>
                                            <p className="text-green-700/70 text-sm">Este documento é autêntico e foi emitido em nosso sistema.</p>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-green-200/50">
                                        <div>
                                            <label className="block text-xs font-bold text-green-800/50 uppercase tracking-widest mb-1">Aluno</label>
                                            <p className="text-slate-800 font-bold text-lg">{result.user_name}</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-green-800/50 uppercase tracking-widest mb-1">Data de Emissão</label>
                                            <p className="text-slate-800 font-bold text-lg">{new Date(result.created_at).toLocaleDateString('pt-BR')}</p>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-xs font-bold text-green-800/50 uppercase tracking-widest mb-1">Curso</label>
                                            <p className="text-slate-800 font-bold text-lg">eSocial na Prática — SST</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-center mt-10">
                        <Link href="/" className="text-slate-400 hover:text-blue-700 font-medium text-sm transition transition-all inline-flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Voltar para a home
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function ValidarPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ValidarContent />
        </Suspense>
    )
}
