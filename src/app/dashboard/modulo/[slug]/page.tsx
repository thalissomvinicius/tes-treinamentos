'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { quizzes } from '@/lib/quizzes'
import Navbar from '@/components/Navbar'
import QuizCard from '@/components/QuizCard'
import Link from 'next/link'

const MODULE_META: Record<string, { gradient: string; icon: string; order: number }> = {
    'modulo-1-esocial': { gradient: 'from-blue-600 to-blue-700', icon: '📋', order: 1 },
    'modulo-2-s2210': { gradient: 'from-rose-500 to-rose-600', icon: '🚨', order: 2 },
    'modulo-3-s2220': { gradient: 'from-teal-500 to-teal-600', icon: '🩺', order: 3 },
    'modulo-4-s2240': { gradient: 'from-amber-500 to-amber-600', icon: '⚠️', order: 4 },
    'modulo-5-conclusao': { gradient: 'from-indigo-500 to-indigo-600', icon: '🎓', order: 5 },
}

export default function ModulePage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string

    const [user, setUser] = useState<{ id: string } | null>(null)
    const [content, setContent] = useState<string>('')
    const [title, setTitle] = useState('')
    const [completed, setCompleted] = useState(false)
    const [loading, setLoading] = useState(true)
    const [marking, setMarking] = useState(false)

    const meta = MODULE_META[slug] || { gradient: 'from-blue-600 to-blue-700', icon: '📖', order: 0 }

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

            // Load content via API
            try {
                const res = await fetch(`/api/content/${slug}`)
                if (res.ok) {
                    const data = await res.json()
                    setContent(data.content)
                    setTitle(data.title)
                }
            } catch {
                console.error('Error loading content')
            }

            // Check completion
            const { data: progress } = await supabase
                .from('progress')
                .select('completed')
                .eq('user_id', authUser.id)
                .eq('module_slug', slug)
                .single()

            setCompleted(progress?.completed || false)
            setLoading(false)
        }

        loadData()
    }, [slug, router])

    async function handleMarkComplete() {
        if (!user) return
        setMarking(true)

        await supabase.from('progress').upsert(
            {
                user_id: user.id,
                module_slug: slug,
                completed: true,
                updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,module_slug' }
        )

        setCompleted(true)
        setMarking(false)
    }

    const moduleQuizzes = quizzes[slug] || []

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">Carregando módulo...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            <Navbar isLoggedIn />

            <main className="pt-24 pb-16 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Hero header */}
                    <div className={`relative overflow-hidden bg-gradient-to-r ${meta.gradient} rounded-3xl p-8 sm:p-10 mb-8 shadow-xl shadow-blue-200/20`}>
                        {/* Decorative */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-xl" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-lg" />

                        <div className="relative z-10">
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
                                <Link href="/dashboard" className="hover:text-white transition font-medium">
                                    Dashboard
                                </Link>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-white/80 font-medium">Módulo {String(meta.order).padStart(2, '0')}</span>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                                    {meta.icon}
                                </div>
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                                        {title || slug}
                                    </h1>
                                    {completed && (
                                        <span className="inline-flex items-center gap-1.5 mt-2 bg-white/15 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Módulo concluído
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Card */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-12 mb-8">
                        <article
                            className="prose prose-slate prose-lg max-w-none
                prose-headings:text-slate-800 prose-headings:font-extrabold
                prose-h1:text-3xl prose-h1:mb-6 prose-h1:pb-4 prose-h1:border-b prose-h1:border-slate-200
                prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-slate-600 prose-p:leading-relaxed
                prose-strong:text-slate-800
                prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50/60 prose-blockquote:rounded-r-2xl prose-blockquote:py-2 prose-blockquote:px-5 prose-blockquote:not-italic prose-blockquote:text-blue-800
                prose-li:text-slate-600 prose-li:marker:text-blue-600
                prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                prose-table:rounded-2xl prose-table:overflow-hidden prose-table:border prose-table:border-slate-100
                prose-th:bg-gradient-to-r prose-th:from-blue-700 prose-th:to-blue-600 prose-th:text-white prose-th:font-bold prose-th:text-sm prose-th:py-3.5
                prose-td:text-sm prose-td:py-3 prose-td:border-slate-100
                prose-a:text-blue-600 prose-a:font-semibold hover:prose-a:text-blue-800
                prose-img:rounded-2xl prose-img:shadow-xl
              "
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>

                    {/* Quiz section */}
                    {moduleQuizzes.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <span className="text-xl">📝</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-extrabold text-slate-800">Quiz de Fixação</h2>
                                    <p className="text-sm text-slate-400 font-medium">Teste seus conhecimentos</p>
                                </div>
                            </div>
                            <QuizCard
                                questions={moduleQuizzes}
                                onComplete={handleMarkComplete}
                            />
                        </div>
                    )}

                    {/* Footer actions */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            {completed ? (
                                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-3.5">
                                    <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-emerald-700 font-bold text-sm">Módulo concluído!</p>
                                        <p className="text-emerald-600 text-xs">Progresso salvo automaticamente</p>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleMarkComplete}
                                    disabled={marking}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-200/40 disabled:opacity-50 flex items-center gap-3 group"
                                >
                                    {marking ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Marcar como concluído
                                        </>
                                    )}
                                </button>
                            )}

                            <Link
                                href="/dashboard"
                                className="text-slate-400 hover:text-blue-600 font-bold text-sm transition-all flex items-center gap-2 group"
                            >
                                <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Voltar ao painel
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
