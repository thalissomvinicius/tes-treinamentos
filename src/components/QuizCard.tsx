'use client'

import { useState } from 'react'
import type { QuizQuestion } from '@/lib/quizzes'

interface QuizCardProps {
    questions: QuizQuestion[]
    onComplete?: (passed: boolean, score: number) => void
    passingPercentage?: number
    title?: string
}

export default function QuizCard({ questions, onComplete, passingPercentage = 50, title = 'Quiz de Fixação' }: QuizCardProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedOption, setSelectedOption] = useState<number | null>(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [correctCount, setCorrectCount] = useState(0)
    const [finished, setFinished] = useState(false)

    const question = questions[currentIndex]

    function handleSelect(optionIndex: number) {
        if (isAnswered) return
        setSelectedOption(optionIndex)
        setIsAnswered(true)
        if (optionIndex === question.correct) {
            setCorrectCount((prev) => prev + 1)
        }
    }

    function handleNext() {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1)
            setSelectedOption(null)
            setIsAnswered(false)
        } else {
            setFinished(true)
            const passed = (correctCount + (selectedOption === question.correct ? 1 : 0)) >= Math.ceil(questions.length * (passingPercentage / 100))
            if (onComplete) onComplete(passed, correctCount + (selectedOption === question.correct ? 1 : 0))
        }
    }

    if (finished) {
        const isPassed = correctCount >= Math.ceil(questions.length * (passingPercentage / 100))
        const scorePercentage = Math.round((correctCount / questions.length) * 100)
        return (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-blue-100/20 overflow-hidden">
                <div className={`p-10 text-center ${isPassed ? 'bg-gradient-to-br from-emerald-50 to-teal-50' : 'bg-gradient-to-br from-orange-50 to-amber-50'}`}>
                    <div className="text-6xl mb-4">{isPassed ? '🏆' : '💪'}</div>
                    <h3 className="text-2xl font-extrabold text-slate-800 mb-2">
                        {isPassed ? 'Excelente!' : 'Quase lá!'}
                    </h3>
                    <p className="text-slate-600 mb-6">
                        Você acertou <span className="font-extrabold text-blue-700">{correctCount}</span> de{' '}
                        <span className="font-bold">{questions.length}</span> perguntas
                    </p>

                    {/* Score ring */}
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                            <circle
                                cx="50" cy="50" r="42" fill="none"
                                stroke={isPassed ? '#10b981' : '#f59e0b'}
                                strokeWidth="8"
                                strokeDasharray={`${scorePercentage * 2.64} 264`}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-xl font-extrabold ${isPassed ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {scorePercentage}%
                            </span>
                        </div>
                    </div>

                    {isPassed ? (
                        <div className="bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-2xl p-4 text-emerald-700 text-sm font-semibold inline-flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            Módulo concluído com sucesso!
                        </div>
                    ) : (
                        <button
                            onClick={() => {
                                setCurrentIndex(0)
                                setSelectedOption(null)
                                setIsAnswered(false)
                                setCorrectCount(0)
                                setFinished(false)
                            }}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-amber-200/50 hover:shadow-amber-300/50"
                        >
                            Tentar novamente →
                        </button>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-blue-100/20 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 px-6 sm:px-8 py-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-extrabold flex items-center gap-2 text-lg">
                            <span>📝</span> {title}
                        </h3>
                        <span className="text-white/70 text-sm font-bold bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                            {currentIndex + 1} de {questions.length}
                        </span>
                    </div>
                    {/* Progress bar */}
                    <div className="flex gap-1.5">
                        {questions.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < currentIndex
                                    ? 'bg-white'
                                    : i === currentIndex
                                        ? 'bg-white/60'
                                        : 'bg-white/15'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Question */}
            <div className="p-6 sm:p-8">
                <p className="text-slate-800 font-bold text-lg sm:text-xl mb-6 leading-snug">{question.question}</p>

                {/* Options */}
                <div className="space-y-3">
                    {question.options.map((option, i) => {
                        let classes = 'bg-slate-50/80 border-slate-200 hover:bg-blue-50 hover:border-blue-300 cursor-pointer'
                        let iconClasses = 'border-slate-300 text-slate-500 bg-white'

                        if (isAnswered) {
                            if (i === question.correct) {
                                classes = 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-100'
                                iconClasses = 'border-emerald-500 bg-emerald-500 text-white'
                            } else if (i === selectedOption) {
                                classes = 'bg-red-50 border-red-400 ring-2 ring-red-100'
                                iconClasses = 'border-red-500 bg-red-500 text-white'
                            } else {
                                classes = 'bg-slate-50/50 border-slate-100 opacity-40'
                                iconClasses = 'border-slate-200 text-slate-300 bg-white'
                            }
                        } else if (i === selectedOption) {
                            classes = 'bg-blue-50 border-blue-400 ring-2 ring-blue-100'
                            iconClasses = 'border-blue-500 bg-blue-500 text-white'
                        }

                        return (
                            <button
                                key={i}
                                onClick={() => handleSelect(i)}
                                disabled={isAnswered}
                                className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 ${classes}`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold border-2 transition-all ${iconClasses}`}>
                                        {isAnswered && i === question.correct ? '✓' : isAnswered && i === selectedOption ? '✕' : String.fromCharCode(65 + i)}
                                    </span>
                                    <span className="text-slate-700 font-medium text-sm sm:text-base">{option}</span>
                                </div>
                            </button>
                        )
                    })}
                </div>

                {/* Feedback + Next button */}
                {isAnswered && (
                    <div className="mt-6 flex items-center justify-between pt-5 border-t border-slate-100">
                        <div className={`flex items-center gap-2 text-sm font-bold ${selectedOption === question.correct ? 'text-emerald-600' : 'text-red-500'
                            }`}>
                            <span className="text-lg">{selectedOption === question.correct ? '✅' : '❌'}</span>
                            <span>{selectedOption === question.correct ? 'Resposta correta!' : 'Resposta incorreta'}</span>
                        </div>
                        <button
                            onClick={handleNext}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-200/30 text-sm flex items-center gap-2"
                        >
                            {currentIndex < questions.length - 1 ? 'Próxima' : 'Finalizar'}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
