'use client'

import Link from 'next/link'

interface ModuleCardProps {
    slug: string
    title: string
    description: string
    icon: string
    order: number
    gradient?: string
    completed?: boolean
    locked?: boolean
}

export default function ModuleCard({
    slug,
    title,
    description,
    icon,
    order,
    gradient = 'from-blue-600 to-blue-700',
    completed = false,
    locked = false,
}: ModuleCardProps) {
    const content = (
        <>
            <div className="flex items-start gap-4 p-5 sm:p-6">
                {/* Icon container with gradient */}
                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg shadow-blue-200/30 relative`}>
                    <span className="relative z-10">{icon}</span>
                    <div className="absolute inset-0 rounded-2xl bg-white/10" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Módulo {String(order).padStart(2, '0')}
                        </span>
                        {completed && (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                Concluído
                            </span>
                        )}
                    </div>

                    <h3 className={`font-bold text-base sm:text-lg mb-1 transition-colors leading-snug ${completed ? 'text-emerald-700' : 'text-slate-800 group-hover:text-blue-700'
                        }`}>
                        {title}
                    </h3>

                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                        {description}
                    </p>

                    {/* CTA */}
                    {!locked && (
                        <div className={`mt-3 inline-flex items-center gap-1.5 text-xs font-bold transition-all ${completed
                                ? 'text-emerald-600'
                                : 'text-blue-600 group-hover:text-blue-700 group-hover:gap-2.5'
                            }`}>
                            <span>{completed ? 'Revisar conteúdo' : 'Acessar módulo'}</span>
                            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom progress indicator */}
            <div className={`h-1 w-full transition-all duration-500 ${completed
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                    : 'bg-slate-100 group-hover:bg-blue-100'
                }`} />
        </>
    )

    const className = `group relative block bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${locked
            ? 'border-slate-200 opacity-50 cursor-not-allowed'
            : completed
                ? 'border-emerald-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100/30 hover:-translate-y-0.5'
                : 'border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/30 hover:-translate-y-0.5'
        }`

    if (locked) {
        return <div className={className}>{content}</div>
    }

    return (
        <Link href={`/dashboard/modulo/${slug}`} className={className}>
            {content}
        </Link>
    )
}
