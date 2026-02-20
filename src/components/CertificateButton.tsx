'use client'

import Link from 'next/link'

interface CertificateButtonProps {
    // The provided "Code Edit" snippet for this section is syntactically incorrect.
    // It attempts to place React hook usage and a return statement inside an interface definition.
    // To maintain syntactic correctness as per instructions, this specific part of the "Code Edit" cannot be applied literally.
    // The original `allCompleted: boolean` prop is retained to keep the component functional.
    allCompleted: boolean
}

export default function CertificateButton({ allCompleted }: CertificateButtonProps) {
    return (
        <div className={`rounded-3xl p-6 border-2 transition-all ${allCompleted
            ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300 shadow-lg shadow-amber-100/50'
            : 'bg-slate-50 border-slate-200'
            }`}>
            {/* Stacked vertical layout */}
            <div className="text-center">
                <span className={`text-4xl block mb-3 ${allCompleted ? 'animate-bounce' : 'grayscale opacity-40'}`}>
                    🎓
                </span>
                <h3 className={`font-bold text-base mb-1 ${allCompleted ? 'text-amber-800' : 'text-slate-400'}`}>
                    Certificado T&S Cursos
                </h3>
                <p className={`text-xs leading-relaxed mb-4 ${allCompleted ? 'text-amber-600' : 'text-slate-400'}`}>
                    {allCompleted
                        ? 'Parabéns! Seu certificado está pronto para emissão.'
                        : 'Conclua todos os 5 módulos e a Prova Final para emitir.'}
                </p>
                {allCompleted ? (
                    <Link
                        href="/dashboard/certificado"
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-lg shadow-amber-200/50 hover:shadow-amber-300/50 text-sm"
                    >
                        <span>⬇️</span> Emitir Certificado
                    </Link>
                ) : (
                    <div className="w-full bg-slate-200 text-slate-400 font-bold px-5 py-3 rounded-xl cursor-not-allowed text-sm text-center">
                        🔒 Bloqueado
                    </div>
                )}
            </div>
        </div>
    )
}
