'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { quizzes } from '@/lib/quizzes'
import Navbar from '@/components/Navbar'
import QuizCard from '@/components/QuizCard'
import Link from 'next/link'

export default function ProvaPage() {
    const router = useRouter()
    const [user, setUser] = useState<{ id: string } | null>(null)
    const [loading, setLoading] = useState(true)
    const [completed, setCompleted] = useState(false)

    useEffect(() => {
        async function loadData() {
            const {
                data: { user: authUser },
            } = await supabase.auth.getUser()

            if (!authUser) {
                router.push('/login')
                return
            }
            setUser({ id: authUser.id })

            // Check if already completed
            const { data: progress } = await supabase
                .from('progress')
                .select('completed')
                .eq('user_id', authUser.id)
                .eq('module_slug', 'prova-final')
                .single()

            if (progress?.completed) {
                setCompleted(true)
            }
            setLoading(false)
        }

        loadData()
    }, [router])

    async function handleProvaComplete(passed: boolean) {
        if (!user || !passed) return

        await supabase.from('progress').upsert(
            {
                user_id: user.id,
                module_slug: 'prova-final',
                completed: true,
                updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,module_slug' }
        )

        setCompleted(true)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">Carregando avaliação...</p>
                </div>
            </div>
        )
    }

    const examQuestions = quizzes['prova-final'] || []

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            <Navbar isLoggedIn />

            <main className="pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-10 mb-8 shadow-xl">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
                                <Link href="/dashboard" className="hover:text-white transition font-medium">
                                    Dashboard
                                </Link>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-white/80 font-medium">Avaliação Final</span>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                                    🏁
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                                        Prova Final de Certificação
                                    </h1>
                                    <p className="text-slate-400 text-sm mt-1">
                                        Demonstre seu domínio sobre os eventos de SST no eSocial.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Intro Card */}
                    {!completed && (
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 flex items-start gap-4">
                            <div className="text-2xl mt-1">⚠️</div>
                            <div>
                                <h3 className="font-bold text-blue-900">Regras da Avaliação</h3>
                                <p className="text-blue-800/70 text-sm leading-relaxed mt-1">
                                    Para obter o certificado, você deve acertar pelo menos <strong>70% das questões</strong> (7 de 10).
                                    Caso não atinja a nota, você poderá refazer a prova.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Prova Section */}
                    <div className="mb-8">
                        <QuizCard
                            title="Avaliação Final"
                            questions={examQuestions}
                            passingPercentage={70}
                            onComplete={handleProvaComplete}
                        />
                    </div>

                    {/* Result Footer */}
                    {completed && (
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center italic text-slate-500">
                            <p className="mb-6">Parabéns! Você foi aprovado na Avaliação Final.</p>
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Ir para o Dashboard e emitir Certificado
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
