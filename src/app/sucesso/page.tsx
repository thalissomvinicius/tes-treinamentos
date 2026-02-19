'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SucessoContent() {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white rounded-3xl shadow-xl shadow-green-100/30 border border-green-100 p-10">
                    {/* Success animation */}
                    <div className="mb-6">
                        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-2xl font-extrabold text-slate-800 mb-3">
                        Pagamento confirmado! 🎉
                    </h1>

                    <p className="text-slate-500 leading-relaxed mb-6">
                        Obrigado por adquirir o curso{' '}
                        <strong className="text-slate-700">eSocial na Prática — SST</strong> da{' '}
                        <strong className="text-blue-700">T&S Cursos</strong>!
                    </p>

                    <div className="bg-blue-50 rounded-2xl p-5 mb-6 text-left">
                        <h3 className="font-bold text-blue-800 text-sm mb-3 flex items-center gap-2">
                            <span>📧</span> Próximos passos:
                        </h3>
                        <ol className="space-y-2 text-sm text-blue-700">
                            <li className="flex gap-2">
                                <span className="font-bold">1.</span>
                                Verifique seu e-mail (inclusive a caixa de spam)
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold">2.</span>
                                Clique no link mágico que enviamos
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold">3.</span>
                                Acesse seu painel e comece a estudar!
                            </li>
                        </ol>
                    </div>

                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200/50"
                    >
                        Ir para o Login
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>

                    {sessionId && (
                        <p className="mt-6 text-xs text-slate-400">
                            ID da sessão: {sessionId.slice(0, 20)}...
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function SucessoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full" />
            </div>
        }>
            <SucessoContent />
        </Suspense>
    )
}
