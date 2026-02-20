'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import ModuleCard from '@/components/ModuleCard'
import ProgressBar from '@/components/ProgressBar'
import CertificateButton from '@/components/CertificateButton'

const MODULES = [
    {
        slug: 'modulo-1-esocial',
        title: 'Fundamentos do eSocial',
        description: 'O que é o eSocial, legislação e importância para o Técnico em SST.',
        icon: '📋',
        order: 1,
        gradient: 'from-blue-600 to-blue-700',
    },
    {
        slug: 'modulo-2-s2210',
        title: 'S-2210 | CAT',
        description: 'Comunicação de Acidente de Trabalho: prazos, preenchimento e impactos.',
        icon: '🚨',
        order: 2,
        gradient: 'from-rose-500 to-rose-600',
    },
    {
        slug: 'modulo-3-s2220',
        title: 'S-2220 | ASO',
        description: 'Monitoramento da Saúde Ocupacional: exames, Tabela 27 e prazos.',
        icon: '🩺',
        order: 3,
        gradient: 'from-teal-500 to-teal-600',
    },
    {
        slug: 'modulo-4-s2240',
        title: 'S-2240 | Agentes Nocivos',
        description: 'Condições Ambientais: agentes nocivos, Tabela 24, EPI/EPC.',
        icon: '⚠️',
        order: 4,
        gradient: 'from-amber-500 to-amber-600',
    },
    {
        slug: 'modulo-5-conclusao',
        title: 'Considerações Finais',
        description: 'Síntese dos eventos, checklist prático e certificado T&S Cursos.',
        icon: '🎓',
        order: 5,
        gradient: 'from-indigo-500 to-indigo-600',
    },
    {
        slug: 'prova-final',
        title: 'Prova Final',
        description: 'Avaliação final com 10 questões. Acerte 70% para liberar seu certificado.',
        icon: '🏁',
        order: 6,
        gradient: 'from-slate-800 to-slate-900',
    },
]

export default function DashboardPage() {
    const router = useRouter()
    const [user, setUser] = useState<{ id: string; email: string } | null>(null)
    const [completedModules, setCompletedModules] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            const {
                data: { user: authUser },
            } = await supabase.auth.getUser()

            if (!authUser) {
                router.push('/login')
                return
            }

            setUser({ id: authUser.id, email: authUser.email || '' })

            // Load progress
            const { data: progress } = await supabase
                .from('progress')
                .select('module_slug')
                .eq('user_id', authUser.id)
                .eq('completed', true)

            setCompletedModules(progress?.map((p) => p.module_slug) || [])
            setLoading(false)
        }

        loadData()
    }, [router])

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/')
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">Carregando seu painel...</p>
                </div>
            </div>
        )
    }

    const allCompleted = completedModules.length >= MODULES.length

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            <Navbar isLoggedIn />

            <main className="pt-24 pb-16 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Hero Header */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-10 mb-8 shadow-xl shadow-blue-200/30">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-xl" />

                        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl">
                                        👋
                                    </div>
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                                            Olá, aluno!
                                        </h1>
                                        <p className="text-blue-200 text-sm">{user?.email}</p>
                                    </div>
                                </div>
                                <p className="text-blue-100/80 text-sm mt-3 max-w-md">
                                    Continue sua jornada em eSocial SST. Complete os módulos e conquiste seu certificado.
                                </p>
                                <button
                                    onClick={handleLogout}
                                    className="mt-4 text-sm text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm font-medium px-4 py-2 rounded-xl transition-all flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sair
                                </button>
                            </div>

                            {/* Flat Design SVG Illustration */}
                            <div className="hidden md:block flex-shrink-0">
                                <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                                    {/* Desk */}
                                    <rect x="30" y="100" width="140" height="8" rx="4" fill="white" fillOpacity="0.2" />
                                    <rect x="50" y="108" width="8" height="30" rx="2" fill="white" fillOpacity="0.12" />
                                    <rect x="142" y="108" width="8" height="30" rx="2" fill="white" fillOpacity="0.12" />

                                    {/* Monitor */}
                                    <rect x="60" y="50" width="80" height="50" rx="6" fill="white" fillOpacity="0.25" />
                                    <rect x="65" y="55" width="70" height="38" rx="3" fill="white" fillOpacity="0.1" />
                                    <rect x="90" y="100" width="20" height="6" rx="2" fill="white" fillOpacity="0.15" />

                                    {/* Screen content - chart bars */}
                                    <rect x="72" y="78" width="8" height="10" rx="2" fill="#60a5fa" fillOpacity="0.8" className="animate-float" />
                                    <rect x="84" y="72" width="8" height="16" rx="2" fill="#34d399" fillOpacity="0.8" className="animate-float [animation-delay:0.3s]" />
                                    <rect x="96" y="68" width="8" height="20" rx="2" fill="#fbbf24" fillOpacity="0.8" className="animate-float [animation-delay:0.6s]" />
                                    <rect x="108" y="64" width="8" height="24" rx="2" fill="#60a5fa" fillOpacity="0.8" className="animate-float [animation-delay:0.9s]" />
                                    <rect x="120" y="60" width="8" height="28" rx="2" fill="#34d399" fillOpacity="0.8" className="animate-float [animation-delay:1.2s]" />

                                    {/* Person - head */}
                                    <circle cx="32" cy="60" r="14" fill="#fcd34d" />
                                    {/* Person - body */}
                                    <rect x="20" y="74" width="24" height="26" rx="8" fill="white" fillOpacity="0.3" />
                                    {/* Person - arm pointing at screen */}
                                    <rect x="38" y="80" width="30" height="5" rx="2.5" fill="white" fillOpacity="0.25" transform="rotate(-15 38 82)" />

                                    {/* Floating document */}
                                    <g className="animate-float [animation-delay:1s]">
                                        <rect x="155" y="30" width="24" height="30" rx="4" fill="white" fillOpacity="0.2" />
                                        <rect x="160" y="36" width="14" height="2" rx="1" fill="white" fillOpacity="0.3" />
                                        <rect x="160" y="41" width="10" height="2" rx="1" fill="white" fillOpacity="0.3" />
                                        <rect x="160" y="46" width="14" height="2" rx="1" fill="white" fillOpacity="0.3" />
                                        <rect x="160" y="51" width="8" height="2" rx="1" fill="white" fillOpacity="0.3" />
                                    </g>

                                    {/* Floating checkmark badge */}
                                    <g className="animate-float [animation-delay:0.5s]">
                                        <circle cx="165" y="75" r="10" fill="#34d399" fillOpacity="0.8" />
                                        <path d="M160 75l3 3 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>

                                    {/* Coffee cup */}
                                    <rect x="145" y="90" width="12" height="10" rx="3" fill="white" fillOpacity="0.15" />
                                    <rect x="143" y="88" width="16" height="3" rx="1.5" fill="white" fillOpacity="0.2" />

                                    {/* Plant */}
                                    <rect x="12" y="88" width="10" height="12" rx="3" fill="white" fillOpacity="0.15" />
                                    <ellipse cx="17" cy="84" rx="6" ry="5" fill="#34d399" fillOpacity="0.6" />
                                    <ellipse cx="12" cy="80" rx="4" ry="4" fill="#34d399" fillOpacity="0.4" />
                                    <ellipse cx="22" cy="80" rx="4" ry="4" fill="#34d399" fillOpacity="0.4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Progress */}
                            {user && <ProgressBar userId={user.id} />}

                            {/* Download Handout (Apostila) */}
                            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl shadow-slate-200 transition-all hover:scale-[1.02] group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-white/10 text-white rounded-xl flex items-center justify-center text-xl">
                                        📄
                                    </div>
                                    <h3 className="font-bold text-white">Apostila Completa</h3>
                                </div>
                                <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                                    Acesse o manual técnico em <strong>PDF</strong> com todo o conteúdo para consulta rápida.
                                </p>
                                <a
                                    href="/apostila"
                                    target="_blank"
                                    className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-3.5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Baixar Manual PDF
                                </a>
                            </div>

                            {/* Certificate CTA */}
                            <div className="hidden lg:block">
                                <CertificateButton allCompleted={allCompleted} />
                            </div>
                        </div>

                        {/* Main content */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="font-extrabold text-xl text-slate-800">Seus Módulos</h2>
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 rounded-full px-3 py-1">
                                    {completedModules.length}/{MODULES.length} concluídos
                                </span>
                            </div>

                            {MODULES.map((mod, idx) => (
                                <div key={mod.slug} className={`animate-slide-up stagger-${idx + 1}`}>
                                    <ModuleCard
                                        slug={mod.slug === 'prova-final' ? '../../prova' : mod.slug}
                                        title={mod.title}
                                        description={mod.description}
                                        icon={mod.icon}
                                        order={mod.order}
                                        gradient={mod.gradient}
                                        completed={completedModules.includes(mod.slug)}
                                    />
                                </div>
                            ))}

                            {/* Mobile certificate */}
                            <div className="lg:hidden mt-6">
                                <CertificateButton allCompleted={allCompleted} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
