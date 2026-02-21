'use client'

import React, { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ApostilaPage() {
    const searchParams = useSearchParams()

    useEffect(() => {
        // Se a URL contiver ?print=true, dispara a impressão após um breve delay para garantir o carregamento
        if (searchParams.get('print') === 'true') {
            const timer = setTimeout(() => {
                window.print()
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [searchParams])

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans print:bg-white print:text-black overflow-x-hidden">
            {/* Botão de Impressão (Oculto na impressão) */}
            <div className="fixed bottom-8 right-8 z-50 print:hidden sm:block hidden">
                <button
                    onClick={() => window.print()}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Imprimir / Salvar PDF
                </button>
            </div>

            <div className="w-full max-w-[210mm] mx-auto bg-white p-0 sm:p-8 lg:p-12 shadow-none sm:shadow-2xl print:shadow-none print:p-0">
                {/* ────── PRINT HEADER (Only visible on print) ────── */}
                <div className="hidden print:block fixed top-0 left-0 right-0 h-[20mm] border-b border-slate-200 px-[20mm] py-4 bg-white z-[100]">
                    <div className="flex justify-between items-center h-full">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-extrabold text-blue-800">T&S</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Treinamentos</span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 text-right uppercase tracking-widest">
                            Apostila Técnica — eSocial SST
                        </div>
                    </div>
                </div>

                {/* ────── PRINT FOOTER (Only visible on print) ────── */}
                <div className="hidden print:block fixed bottom-0 left-0 right-0 h-[15mm] border-t border-slate-100 px-[20mm] py-4 bg-white z-[100] text-center">
                    <div className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">
                        © {new Date().getFullYear()} T&S CURSOS • DOCUMENTO PARA USO DIDÁTICO • WWW.TES-TREINAMENTOS.VERCEL.APP
                    </div>
                </div>

                {/* ────── CAPA ────── */}
                <section className="min-h-[297mm] flex flex-col items-center justify-center text-center border-[20px] border-blue-900/5 p-12 relative overflow-hidden break-after-page print:border-none print:bg-white print:min-h-[257mm] print:pt-[20mm] print:pb-[15mm]">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 print:hidden" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 print:hidden" />

                    <div className="relative z-10">
                        <div className="flex items-center justify-center gap-3 mb-16">
                            <span className="text-6xl font-extrabold tracking-tighter">
                                <span className="text-blue-700">T</span>
                                <span className="text-slate-300 mx-px">&</span>
                                <span className="text-blue-700">S</span>
                            </span>
                            <div className="text-left print:hidden">
                                <div className="text-xl font-bold text-slate-800 tracking-widest uppercase">Treinamentos</div>
                                <div className="h-1 w-full bg-blue-700 mt-1" />
                            </div>
                        </div>

                        <h1 className="text-5xl font-black text-slate-900 leading-tight mb-8 print:text-6xl">
                            eSocial na Prática <br />
                            <span className="text-blue-700">Segurança e Saúde no Trabalho</span>
                        </h1>

                        <div className="w-24 h-2 bg-blue-700 mx-auto mb-12 rounded-full" />

                        <p className="text-xl text-slate-500 font-medium mb-24 uppercase tracking-[0.2em] print:mb-12">
                            Apostila Completa do Curso
                        </p>

                        <div className="grid grid-cols-3 gap-8 max-w-md mx-auto py-8 border-y border-slate-100 italic text-slate-400 print:max-w-none print:w-full">
                            <div>S-2210</div>
                            <div>S-2220</div>
                            <div>S-2240</div>
                        </div>
                    </div>

                    <div className="absolute bottom-12 text-slate-400 text-sm font-medium print:bottom-8">
                        © {new Date().getFullYear()} T&S Cursos • Tecnologia de Ensino
                    </div>
                </section>

                {/* ────── SUMÁRIO ────── */}
                <section className="py-16 px-12 break-after-page print:pt-[40mm] print:px-[20mm]">
                    <h2 className="text-3xl font-bold text-blue-900 mb-12 flex items-center gap-3">
                        Sumário 📚
                    </h2>
                    <nav className="space-y-6">
                        {[
                            { id: 'm1', title: 'Fundamentos do eSocial na SST', p: '01' },
                            { id: 'm2', title: 'S-2210 | Comunicação de Acidente de Trabalho (CAT)', p: '04' },
                            { id: 'm3', title: 'S-2220 | Monitoramento da Saúde Ocupacional (ASO)', p: '08' },
                            { id: 'm4', title: 'S-2240 | Condições Ambientais e Agentes Nocivos', p: '12' },
                            { id: 'm5', title: 'Considerações Finais e Checklist Prático', p: '16' },
                            { id: 'glos', title: 'Glossário de Termos Técnicos', p: '18' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-end gap-2 group cursor-pointer hover:text-blue-700 transition-colors">
                                <span className="text-blue-900 font-bold text-lg min-w-[20px]">{i + 1}.</span>
                                <span className="font-semibold text-slate-700 group-hover:text-blue-700 whitespace-nowrap">{item.title}</span>
                                <div className="flex-1 border-b-2 border-dotted border-slate-200 mb-1.5" />
                                <span className="text-slate-400 font-mono">{item.p}</span>
                            </div>
                        ))}
                    </nav>
                </section>

                {/* ────── MÓDULO 1 ────── */}
                <article className="py-16 px-12 break-after-page print:pt-[40mm] print:px-[20mm]">
                    <div className="text-blue-700 font-bold uppercase tracking-widest text-sm mb-4">Módulo 01</div>
                    <h2 className="text-4xl font-extrabold text-blue-900 mb-8 border-b-4 border-blue-100 pb-4">
                        Fundamentos do eSocial na SST
                    </h2>

                    <div className="prose prose-slate max-w-none">
                        <section className="mb-10 avoid-break-inside">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">O que é o eSocial?</h3>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                O <strong>eSocial</strong> (Sistema de Escrituração Digital das Obrigações Fiscais, Previdenciárias e Trabalhistas) é uma plataforma digital do Governo Federal que <strong>unifica o envio de informações</strong> trabalhistas, previdenciárias e fiscais dos empregadores em relação aos seus trabalhadores.
                            </p>
                            <div className="bg-blue-50 border-l-4 border-blue-700 p-6 rounded-r-xl my-6">
                                <p className="text-blue-900 italic font-medium">
                                    💡 <strong>Em resumo:</strong> o eSocial é o "Google Docs" das obrigações trabalhistas — tudo em um só lugar, atualizado em tempo real.
                                </p>
                            </div>
                        </section>

                        <section className="mb-10 avoid-break-inside">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">🎯 Objetivo na SST</h3>
                            <p className="text-slate-600 mb-4">
                                Na área de <strong>Segurança e Saúde no Trabalho (SST)</strong>, o eSocial tem o papel fundamental de digitalizar documentos históricos, substituindo processos manuais complexos por envios eletrônicos padronizados.
                            </p>
                            <ul className="space-y-3 list-none p-0">
                                {['Registrar acidentes de trabalho (evento S-2210)', 'Monitorar a saúde dos trabalhadores (evento S-2220)', 'Mapear condições ambientais e agentes nocivos (evento S-2240)'].map((text, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-700 p-3 bg-slate-50 rounded-lg">
                                        <div className="w-6 h-6 bg-blue-700 text-white rounded-full flex items-center justify-center text-[10px] font-bold">{i + 1}</div>
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">📜 Legislação e Bases Legais</h3>
                            <div className="grid grid-cols-1 gap-4 mb-6">
                                <div className="p-4 border border-slate-100 rounded-xl">
                                    <span className="font-bold text-blue-900">Decreto nº 8.373/2014:</span> Institui o eSocial como instrumento de unificação de obrigações.
                                </div>
                                <div className="p-4 border border-slate-100 rounded-xl">
                                    <span className="font-bold text-blue-900">NR-07 (PCMSO):</span> Define as diretrizes para o monitoramento da saúde (ASO).
                                </div>
                                <div className="p-4 border border-slate-100 rounded-xl">
                                    <span className="font-bold text-blue-900">NR-09 (PGR):</span> Estabelece a gestão de riscos que alimenta os dados de agentes nocivos.
                                </div>
                            </div>
                            <div className="bg-amber-50 text-amber-900 p-4 rounded-xl border-l-4 border-amber-500 text-sm">
                                ⚠️ <strong>Atenção:</strong> O não cumprimento dos prazos pode gerar multas pesadas. A conformidade não é apenas sobre o envio, mas sobre a consistência dos dados com os laudos físicos.
                            </div>
                        </section>
                    </div>
                </article>

                {/* ────── MÓDULO 2 ────── */}
                <article className="py-16 px-12 break-after-page print:pt-[40mm] print:px-[20mm]">
                    <div className="text-rose-600 font-bold uppercase tracking-widest text-sm mb-4">Módulo 02</div>
                    <h2 className="text-4xl font-extrabold text-blue-900 mb-8 border-b-4 border-rose-100 pb-4">
                        S-2210 | Comunicação de Acidente de Trabalho
                    </h2>

                    <div className="prose prose-slate max-w-none">
                        <section className="mb-10 avoid-break-inside text-justify">
                            <h3 className="text-xl font-bold text-slate-800 mb-4 font-display">O que é o S-2210?</h3>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                O <strong>S-2210</strong> é o evento do eSocial responsável por comunicar os acidentes de trabalho e doenças profissionais. Ele digitaliza a antiga CAT, permitindo que o governo fiscalize em tempo real a segurança nas empresas.
                            </p>

                            <h4 className="font-bold text-slate-800 mb-4">Categorias de Acidente:</h4>
                            <div className="grid grid-cols-2 gap-4 print:grid-cols-2">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <h4 className="font-bold text-rose-700 mb-1">Acidente Típico</h4>
                                    <p className="text-[11px] text-slate-500 font-medium">Ocorrendo durante a execução das tarefas laborais.</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <h4 className="font-bold text-rose-700 mb-1 text-sm">Acidente de Trajeto</h4>
                                    <p className="text-[11px] text-slate-500 font-medium">Entre a residência e o local de trabalho.</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <h4 className="font-bold text-rose-700 mb-1 text-sm">Doença Profissional</h4>
                                    <p className="text-[11px] text-slate-500 font-medium">Exclusivamente ligada à natureza do cargo.</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <h4 className="font-bold text-rose-700 mb-1 text-sm">Doença do Trabalho</h4>
                                    <p className="text-[11px] text-slate-500 font-medium">Causada pelas condições do ambiente laboral.</p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-10">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">📝 Passo a Passo do Preenchimento</h3>
                            <div className="space-y-3">
                                {[
                                    'Identificação do trabalhador (CPF)',
                                    'Data, hora e local do ocorrido',
                                    'Parte do corpo atingida (Tabela 13)',
                                    'Agente causador (Tabela 14)',
                                    'Descrição detalhada da situação',
                                    'Dados do atendimento médico (CID)',
                                    'Indicação de óbito ou afastamento',
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50">
                                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                                        <span className="text-slate-700 text-sm font-medium">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="mb-10 avoid-break-inside">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">⏰ Tabela de Prazos Cruciais</h3>
                            <div className="bg-white border-2 border-rose-100 rounded-3xl overflow-hidden print:border print:shadow-sm">
                                <div className="bg-rose-600 text-white p-4 font-black text-center uppercase tracking-widest text-xs">PRAZOS LEGAIS</div>
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-center pb-4 border-b border-slate-100 text-rose-900">
                                        <span className="font-bold">Com Óbito</span>
                                        <span className="bg-rose-100 px-3 py-1 rounded-full text-[10px] font-black uppercase">Imediato (24h)</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-700">
                                        <span className="font-bold">Sem Óbito</span>
                                        <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black uppercase">1º Dia Útil</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-700">
                                        <span className="font-bold">Doença Profissional</span>
                                        <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-black uppercase">1º Dia Útil</span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </article>

                {/* ────── MÓDULO 3 ────── */}
                <article className="py-16 px-12 break-after-page print:pt-[40mm] print:px-[20mm]">
                    <div className="text-teal-600 font-bold uppercase tracking-widest text-sm mb-4">Módulo 03</div>
                    <h2 className="text-4xl font-extrabold text-blue-900 mb-8 border-b-4 border-teal-100 pb-4">
                        S-2220 | Monitoramento da Saúde (ASO)
                    </h2>

                    <p className="text-slate-600 mb-10 leading-relaxed avoid-break-after">
                        Este evento registra as informações dos <strong>Atestados de Saúde Ocupacional (ASO)</strong>. É o elo entre o médico coordenador do PCMSO e a Receita Federal.
                    </p>

                    <h3 className="text-xl font-bold text-slate-800 mb-6 font-display uppercase tracking-wider">📚 Tipos de Exames Obrigatórios</h3>
                    <div className="avoid-break-inside mb-12">
                        <table className="w-full text-sm border-spacing-0">
                            <thead>
                                <tr className="bg-teal-700 text-white">
                                    <th className="p-4 text-left rounded-tl-2xl">Exame</th>
                                    <th className="p-4 text-left rounded-tr-2xl">Quando Realizar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-teal-50 border-x border-b border-teal-50">
                                <tr><td className="p-4 font-bold text-teal-900">Admissional</td><td className="p-4 text-slate-500">Antes do início das atividades laborais.</td></tr>
                                <tr className="bg-teal-50/30"><td className="p-4 font-bold text-teal-900">Periódico</td><td className="p-4 text-slate-500">Em intervalos regulares.</td></tr>
                                <tr><td className="p-4 font-bold text-teal-900">Demissional</td><td className="p-4 text-slate-500">Até a data do desligamento.</td></tr>
                                <tr className="bg-teal-50/30"><td className="p-4 font-bold text-teal-900">Retorno Trabalho</td><td className="p-4 text-slate-500">Após afastamento &gt; 30 dias.</td></tr>
                                <tr><td className="p-4 font-bold text-teal-900">Mudança de Risco</td><td className="p-4 text-slate-500">Sempre que houver alteração de cargo com novos riscos.</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex gap-8 mb-12">
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Informações do Médico</h3>
                            <ul className="space-y-2 text-slate-600">
                                <li className="flex items-start gap-2">• CRM e Nome do Médico examinador</li>
                                <li className="flex items-start gap-2">• Nome do Médico Coordenador (PCMSO)</li>
                                <li className="flex items-start gap-2">• Identificação completa da Clínica</li>
                            </ul>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Exames Complementares</h3>
                            <p className="text-sm text-slate-500 italic mb-4">Devem ser informados seguindo os códigos da **Tabela 27**:</p>
                            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                                <div className="p-2 bg-slate-50 border border-slate-100">0901 — Audiometria</div>
                                <div className="p-2 bg-slate-50 border border-slate-100">0905 — Acuidade</div>
                                <div className="p-2 bg-slate-50 border border-slate-100">0914 — Espirometria</div>
                                <div className="p-2 bg-slate-50 border border-slate-100">0901 — Hemograma</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl avoid-break-inside">
                        <div className="flex justify-between items-center gap-10">
                            <div>
                                <h4 className="text-2xl font-black text-teal-400 mb-3 uppercase tracking-tighter italic">Prazo S-2220</h4>
                                <p className="text-slate-400 text-sm font-medium">O envio deve ocorrer obrigatoriamente até o <strong>dia 15 do mês subsequente</strong> à data de realização do exame médico.</p>
                            </div>
                            <div className="text-6xl font-black text-white/5 select-none">15</div>
                        </div>
                    </div>
                </article>

                {/* ────── MÓDULO 4 ────── */}
                <article className="py-16 px-12 break-after-page print:pt-[40mm] print:px-[20mm]">
                    <div className="text-amber-600 font-bold uppercase tracking-widest text-sm mb-4">Módulo 04</div>
                    <h2 className="text-4xl font-extrabold text-blue-900 mb-8 border-b-4 border-amber-100 pb-4">
                        S-2240 | Condições Ambientais e Agentes Nocivos
                    </h2>

                    <div className="prose prose-slate max-w-none">
                        <section className="mb-12">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">Categorias de Agentes Nocivos</h3>
                            <div className="grid grid-cols-2 gap-6 avoid-break-inside">
                                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                                    <div className="text-lg font-bold mb-2">Químicos</div>
                                    <p className="text-[10px] text-amber-900/60 leading-relaxed font-medium">Poeiras, gases, vapores e substâncias tóxicas.</p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <div className="text-lg font-bold mb-2 text-slate-700">Físicos</div>
                                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">Ruído, vibrações, calor e radiações.</p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <div className="text-2xl mb-2 text-slate-700">Biológicos</div>
                                    <p className="text-xs text-slate-500 leading-relaxed">Micro-organismos como vírus, bactérias e fungos (comum em hospitais).</p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <div className="text-2xl mb-2 text-slate-700">Ergonômicos</div>
                                    <p className="text-xs text-slate-500 leading-relaxed">Repetitividade, posturas inadequadas e manuseio de carga excessiva.</p>
                                </div>
                            </div>
                        </section>

                        <section className="mb-12 avoid-break-inside">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">🛡️ Proteções (EPI e EPC)</h3>
                            <p className="text-slate-600 mb-6">No evento S-2240, é obrigatório informar o CA (Certificado de Aprovação) de cada EPI e declarar se a proteção é eficaz na atenuação dos riscos detectados.</p>
                            <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-lg">
                                <div className="grid grid-cols-2 gap-10">
                                    <div>
                                        <h4 className="font-bold text-amber-400 mb-4 text-xs uppercase tracking-widest">Controle Obrigatório</h4>
                                        <ul className="text-[10px] space-y-3 opacity-80 font-medium">
                                            <li>• CPF do Responsável Técnico</li>
                                            <li>• Registro Profissional (Eng/Med)</li>
                                            <li>• Intensidade mensurada</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-amber-400 mb-4 text-xs uppercase tracking-widest">Tabela 24</h4>
                                        <p className="text-[10px] opacity-70 leading-relaxed font-medium">Códigos de agentes nocivos para cruzamento com Aposentadoria Especial.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="p-8 bg-amber-100 border-2 border-amber-200 rounded-3xl text-amber-900 italic font-medium text-center">
                            "A ausência de agentes nocivos deve ser informada obrigatoriamente através do código correspondente de 'Ausência de Exposição'."
                        </div>
                    </div>
                </article>

                {/* ────── CONCLUSÃO ────── */}
                <article className="py-16 px-12 break-after-page">
                    <div className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-4">Módulo Final</div>
                    <h2 className="text-4xl font-extrabold text-blue-900 mb-8 border-b-4 border-indigo-100 pb-4 text-center font-display">
                        Checklist Estratégico SST
                    </h2>

                    <div className="p-10 bg-white border-2 border-slate-100 rounded-[40px] shadow-lg mb-12">
                        <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-4 italic underline decoration-blue-500">CONFORMIDADE DIÁRIA</h3>
                        <div className="space-y-6">
                            {[
                                { t: 'S-2210 (CAT)', d: 'Auditar se todos os acidentes típicos e de trajeto foram reportados em 24h.' },
                                { t: 'S-2220 (ASO)', d: 'Validar se todos os exames do mês anterior possuem protocolos de envio.' },
                                { t: 'S-2240 (Ambientes)', d: 'Revisar se houve mudança de cargo ou risco que exija novo envio.' },
                                { t: 'EPIs/EPCs', d: 'Conferir se o CA informado no eSocial ainda está dentro da validade legal.' },
                                { t: 'Laudos vs Digital', d: 'Garantir que os dados do PGR/LTCAT batem 100% com o que foi enviado.' },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className="w-8 h-8 border-2 border-blue-200 rounded-xl flex-shrink-0 flex items-center justify-center p-1 group-hover:border-blue-500 transition-colors">
                                        <div className="w-full h-full bg-slate-50 rounded-md group-hover:bg-blue-50" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg mb-1">{item.t}</h4>
                                        <p className="text-sm text-slate-500 leading-relaxed">{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-blue-800 p-12 rounded-[50px] text-white text-center shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px]" />
                        <h3 className="text-3xl font-black mb-4">Diploma de Especialista</h3>
                        <p className="text-blue-100 max-w-md mx-auto mb-10 text-lg">
                            Seu Certificado Digital já está disponível para emissão no Dashboard. Continue sua evolução com os estudos recomendados em NR-01, NR-07 e NR-15.
                        </p>
                        <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-xl px-10 py-4 rounded-3xl border border-white/20">
                            <span className="text-2xl">🎓</span>
                            <span className="font-black uppercase tracking-widest text-sm">T&S Cursos • {new Date().getFullYear()}</span>
                        </div>
                    </div>
                </article>

                {/* ────── GLOSSÁRIO ────── */}
                <section className="py-16 px-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12 flex items-center gap-3 italic">
                        Glossário de Termos SST 📖
                    </h2>
                    <div className="grid grid-cols-1 gap-6">
                        {[
                            { t: 'ASO', d: 'Atestado de Saúde Ocupacional. Documento que declara se o trabalhador está apto para a função.' },
                            { t: 'CAT', d: 'Comunicação de Acidente de Trabalho. Documento obrigatório para registrar acidentes ou doenças.' },
                            { t: 'PCMSO', d: 'Programa de Controle Médico de Saúde Ocupacional. Estabelecido pela NR-07.' },
                            { t: 'PGR', d: 'Programa de Gerenciamento de Riscos. Documento base para identificar perigos no ambiente.' },
                            { t: 'PPP', d: 'Perfil Profissiográfico Previdenciário. Histórico laboral que agora é digital via S-2240.' },
                            { t: 'LTCAT', d: 'Laudo Técnico das Condições Ambientais do Trabalho. Subsídio para aposentadoria especial.' },
                            { t: 'FAP', d: 'Fator Acidentário de Prevenção. Multiplicador sobre o RAT que depende da acidentalidade.' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-6 pb-6 border-b border-slate-50">
                                <div className="text-blue-700 font-black text-xl min-w-[100px]">{item.t}</div>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.d}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer de Página */}
                <footer className="mt-20 py-8 border-t border-slate-100 flex justify-between text-[10px] text-slate-300 font-bold uppercase tracking-widest px-12 print:hidden">
                    <div>T&S Cursos • Material Técnico Autorizado</div>
                    <div>Página {new Date().toLocaleDateString('pt-BR')}</div>
                </footer>
            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .break-after-page {
                        page-break-after: always;
                    }
                }
                .break-after-page {
                    break-after: page;
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}
