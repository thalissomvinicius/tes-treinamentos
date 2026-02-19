'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const MODULES = [
    { slug: 'modulo-1-esocial', title: 'Fundamentos do eSocial', icon: '📋' },
    { slug: 'modulo-2-s2210', title: 'S-2210 | CAT', icon: '🚨' },
    { slug: 'modulo-3-s2220', title: 'S-2220 | ASO', icon: '🩺' },
    { slug: 'modulo-4-s2240', title: 'S-2240 | Agentes Nocivos', icon: '⚠️' },
    { slug: 'modulo-5-conclusao', title: 'Considerações Finais', icon: '🎓' },
]

export default function ProgressBar({ userId }: { userId: string }) {
    const [progress, setProgress] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProgress() {
            const { data } = await supabase
                .from('progress')
                .select('module_slug')
                .eq('user_id', userId)
                .eq('completed', true)

            setProgress(data?.map((d) => d.module_slug) || [])
            setLoading(false)
        }
        fetchProgress()
    }, [userId])

    const percentage = Math.round((progress.length / MODULES.length) * 100)
    const circumference = 2 * Math.PI * 40
    const strokeDash = (percentage / 100) * circumference

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
                <div className="h-3 bg-slate-200 rounded-full" />
            </div>
        )
    }

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 overflow-hidden relative">
            {/* Subtle bg decoration */}
            {percentage === 100 && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-full" />
            )}

            <div className="relative z-10">
                {/* Header with circular progress */}
                <div className="flex items-center gap-4 mb-5">
                    {/* Ring */}
                    <div className="relative w-16 h-16 flex-shrink-0">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="7" />
                            <circle
                                cx="50" cy="50" r="40" fill="none"
                                stroke={percentage === 100 ? '#10b981' : '#3b82f6'}
                                strokeWidth="7"
                                strokeDasharray={`${strokeDash} ${circumference}`}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-sm font-extrabold ${percentage === 100 ? 'text-emerald-600' : 'text-blue-600'}`}>
                                {percentage}%
                            </span>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-800">Seu Progresso</h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                            {progress.length} de {MODULES.length} módulos concluídos
                        </p>
                    </div>
                </div>

                {/* Module list */}
                <div className="space-y-2">
                    {MODULES.map((mod, idx) => {
                        const isCompleted = progress.includes(mod.slug)
                        const isCurrent = !isCompleted && idx === progress.length
                        return (
                            <div
                                key={mod.slug}
                                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${isCompleted
                                        ? 'bg-emerald-50/80'
                                        : isCurrent
                                            ? 'bg-blue-50/80 ring-1 ring-blue-200'
                                            : 'bg-slate-50/80'
                                    }`}
                            >
                                <span
                                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${isCompleted
                                            ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'
                                            : isCurrent
                                                ? 'bg-blue-500 text-white shadow-sm shadow-blue-200 animate-pulse'
                                                : 'bg-slate-200 text-slate-400'
                                        }`}
                                >
                                    {isCompleted ? '✓' : isCurrent ? '▶' : '○'}
                                </span>
                                <span className="text-sm mr-1">{mod.icon}</span>
                                <span className={`text-sm font-medium truncate ${isCompleted
                                        ? 'text-emerald-700'
                                        : isCurrent
                                            ? 'text-blue-700 font-semibold'
                                            : 'text-slate-500'
                                    }`}>
                                    {mod.title}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* Completion message */}
                {percentage === 100 && (
                    <div className="mt-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-center shadow-lg shadow-emerald-200/30">
                        <p className="text-white font-bold text-sm">
                            🏆 Todos os módulos concluídos!
                        </p>
                        <p className="text-emerald-100 text-xs mt-1">
                            Seu certificado T&S Cursos está disponível
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
