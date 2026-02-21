'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { supabase } from '@/lib/supabase'

const WHATSAPP_NUMBER = '5591992770425'
const WHATSAPP_MESSAGE = encodeURIComponent('Olá! Tenho interesse no curso eSocial na Prática — SST da T&S Cursos. Gostaria de mais informações sobre como adquirir.')
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

const MODULES = [
  {
    icon: '📋',
    title: 'Fundamentos do eSocial',
    desc: 'O que é o eSocial, legislação e importância para o Técnico em SST.',
  },
  {
    icon: '🚨',
    title: 'S-2210 — CAT',
    desc: 'Comunicação de Acidente de Trabalho: prazos, preenchimento e impactos.',
  },
  {
    icon: '🩺',
    title: 'S-2220 — ASO',
    desc: 'Monitoramento da Saúde Ocupacional: exames, Tabela 27 e prazos.',
  },
  {
    icon: '⚠️',
    title: 'S-2240 — Agentes Nocivos',
    desc: 'Condições Ambientais: agentes nocivos, Tabela 24, EPI/EPC.',
  },
  {
    icon: '🎓',
    title: 'Considerações Finais',
    desc: 'Síntese dos eventos, checklist prático e emissão do certificado T&S Cursos.',
  },
]

const FAQ_ITEMS = [
  {
    q: 'Para quem é este curso?',
    a: 'Para Técnicos em Segurança do Trabalho (iniciantes ou em atuação), estudantes da área e profissionais que precisam dominar o eSocial na SST.',
  },
  {
    q: 'Preciso de experiência prévia?',
    a: 'Não! O curso foi pensado para ser acessível mesmo para quem está começando. Explicamos tudo do zero com linguagem clara e exemplos práticos.',
  },
  {
    q: 'O certificado é reconhecido?',
    a: 'O certificado T&S Cursos é um documento digital com código de validação único, emitido após a conclusão de todos os módulos e quizzes. É um certificado de curso livre.',
  },
  {
    q: 'Por quanto tempo tenho acesso?',
    a: 'Acesso vitalício! Uma vez comprado, o curso e o certificado ficam disponíveis para sempre.',
  },
  {
    q: 'Qual a forma de pagamento?',
    a: 'Aceitamos PIX e cartões de crédito/débito via link de pagamento direto. É rápido, seguro e com aprovação instantânea. Basta nos chamar no WhatsApp!',
  },
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyResult, setVerifyResult] = useState<{ user_name: string; created_at: string } | null>(null)
  const [verifyError, setVerifyError] = useState('')

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = verifyCode.trim()
    if (!trimmed || verifyLoading) return

    setVerifyLoading(true)
    setVerifyError('')
    setVerifyResult(null)

    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('user_name, created_at')
        .eq('code', trimmed)
        .single()

      if (error || !data) {
        setVerifyError('Certificado não encontrado. Verifique o código e tente novamente.')
      } else {
        setVerifyResult(data)
      }
    } catch {
      setVerifyError('Erro ao validar. Tente novamente.')
    } finally {
      setVerifyLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* ───── HERO ───── */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-6 animate-fade-in-up">
            <span className="w-2 h-2 bg-blue-700 rounded-full animate-pulse" />
            Curso 100% online • Certificado incluso
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6 animate-fade-in-up delay-100">
            Domine o <span className="text-blue-700">eSocial</span> na
            <br />
            Segurança do Trabalho
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up delay-200">
            Curso prático e completo para{' '}
            <strong className="text-slate-700">Técnicos em SST</strong>. Aprenda a preencher
            e enviar os eventos S-2210, S-2220 e S-2240 com confiança.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all shadow-lg shadow-green-200/50 hover:shadow-green-300/50 hover:-translate-y-0.5 flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Comprar pelo WhatsApp
            </a>
            <a
              href="#modulos"
              className="text-slate-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 transition"
            >
              Ver conteúdo do curso
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-8 max-w-md mx-auto animate-fade-in-up delay-400">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-blue-700">5</div>
              <div className="text-xs text-slate-500 mt-1">Módulos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-blue-700">15</div>
              <div className="text-xs text-slate-500 mt-1">Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-extrabold text-blue-700">🎓</div>
              <div className="text-xs text-slate-500 mt-1">Certificado</div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── PARA QUEM É ───── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-800 text-center mb-4">
            Para quem é este curso?
          </h2>
          <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">
            Se você se identifica com algum desses perfis, este curso foi feito pra você.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                emoji: '👷',
                title: 'Técnicos iniciantes',
                desc: 'Que estão começando na área e querem entender o eSocial do zero.',
              },
              {
                emoji: '📚',
                title: 'Profissionais em atuação',
                desc: 'Que precisam se atualizar e dominar os eventos de SST no eSocial.',
              },
              {
                emoji: '🎯',
                title: 'Quem quer se destacar',
                desc: 'Profissionais que querem o certificado e diferencial competitivo no mercado.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group"
              >
                <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">
                  {item.emoji}
                </span>
                <h3 className="font-bold text-lg text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── MÓDULOS ───── */}
      <section id="modulos" className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-800 text-center mb-4">
            O que você vai aprender
          </h2>
          <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">
            5 módulos práticos cobrindo tudo que o Técnico em SST precisa saber sobre o eSocial.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((mod, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
              >
                {/* Number badge */}
                <span className="absolute top-4 right-4 text-6xl font-extrabold text-slate-100 group-hover:text-blue-50 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="text-3xl block mb-4 relative z-10">{mod.icon}</span>
                <h3 className="font-bold text-lg text-slate-800 mb-2 relative z-10 group-hover:text-blue-700 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed relative z-10">
                  {mod.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CERTIFICADO ───── */}
      <section id="certificado" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 rounded-3xl p-10 sm:p-14 text-center text-white relative overflow-hidden">
            {/* Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <span className="text-6xl mb-6 block animate-float">🎓</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 relative z-10">
              Certificado Digital T&S Cursos
            </h2>
            <p className="text-blue-200 text-lg max-w-xl mx-auto mb-8 leading-relaxed relative z-10">
              Ao concluir todos os módulos e quizzes, você recebe um{' '}
              <strong className="text-white">certificado digital em PDF</strong> com código de
              validação único, emitido pela T&S Cursos.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 max-w-lg mx-auto relative z-10">
              {[
                { icon: '✅', text: 'PDF profissional' },
                { icon: '🔐', text: 'Código de validação' },
                { icon: '♾️', text: 'Acesso vitalício' },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                  <span className="text-lg">{item.icon}</span>
                  <p className="text-sm font-semibold mt-1">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="validar" className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-blue-100/30 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold mb-2">Validador de Certificados</h2>
              <p className="text-blue-100/80 text-sm">Verifique a autenticidade do certificado pelo código.</p>
            </div>

            <div className="p-8">
              <form onSubmit={handleVerify} className="space-y-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Código de Validação
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    placeholder="Ex: TES-1716234567890-ABCD12"
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-slate-700 font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={verifyLoading}
                    className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {verifyLoading ? 'Verificando...' : 'Verificar'}
                  </button>
                </div>
              </form>

              {verifyError && (
                <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm font-semibold">
                  {verifyError}
                </div>
              )}

              {verifyResult && (
                <div className="mt-6 bg-green-50 border border-green-200 text-green-800 rounded-2xl p-5 text-sm">
                  <div className="font-bold text-green-700 mb-2">Certificado válido</div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-4 border border-green-100">
                      <div className="text-[11px] font-bold uppercase tracking-widest text-green-600 mb-1">Aluno</div>
                      <div className="font-semibold text-slate-800">{verifyResult.user_name}</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-green-100">
                      <div className="text-[11px] font-bold uppercase tracking-widest text-green-600 mb-1">Emissão</div>
                      <div className="font-semibold text-slate-800">{new Date(verifyResult.created_at).toLocaleDateString('pt-BR')}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ───── PREÇO ───── */}
      <section id="preco" className="py-20 px-4 bg-slate-50">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-3xl border-2 border-blue-200 shadow-xl shadow-blue-100/30 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-8 text-center text-white">
              <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-2">
                Acesso completo + Certificado
              </p>
              <h3 className="text-2xl font-extrabold">eSocial na Prática — SST</h3>
            </div>

            {/* Price */}
            <div className="px-8 py-10 text-center">
              <div className="mb-2">
                <span className="text-sm text-slate-400 line-through">R$ 197,00</span>
              </div>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-sm text-slate-500 font-semibold">R$</span>
                <span className="text-5xl font-extrabold text-slate-900">99</span>
                <span className="text-lg text-slate-500">,90</span>
              </div>
              <p className="text-slate-400 text-sm mb-8">
                Pagamento único • Acesso vitalício
              </p>

              {/* Features */}
              <ul className="text-left space-y-3 mb-8">
                {[
                  '5 módulos completos',
                  'Quizzes de fixação por módulo',
                  'Certificado digital T&S Cursos',
                  'Código de validação único',
                  'Acesso vitalício ao conteúdo',
                  'Atualizações futuras inclusas',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* WhatsApp Buy Button */}
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg shadow-green-200/50 hover:shadow-green-300/50"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Comprar pelo WhatsApp
              </a>

              {/* Payment methods */}
              <div className="mt-4 flex items-center justify-center gap-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Pagamento seguro
                </div>
                <span className="text-slate-200">|</span>
                <span className="text-xs text-slate-400">PIX</span>
                <span className="text-slate-200">|</span>
                <span className="text-xs text-slate-400">Cartões</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section id="faq" className="py-20 px-4 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-800 text-center mb-12">
            Perguntas Frequentes
          </h2>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition"
                >
                  <span className="font-semibold text-slate-800 text-sm">{item.q}</span>
                  <svg
                    className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${openFaq === i ? 'rotate-180' : ''
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-slate-500 text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA FINAL ───── */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Comece agora sua jornada no eSocial
          </h2>
          <p className="text-blue-200 text-lg mb-8 leading-relaxed">
            Domine os eventos de SST, garanta conformidade legal e destaque-se no mercado de trabalho.
          </p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all shadow-lg hover:-translate-y-0.5"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Fale conosco no WhatsApp
          </a>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="py-10 px-4 bg-slate-900 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-2xl font-extrabold mb-2">
            <span className="text-blue-500">T</span>
            <span className="text-slate-400 text-sm font-semibold">&</span>
            <span className="text-blue-500">S</span>
            <span className="text-slate-400 text-sm font-semibold ml-1">Cursos</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} T&S Cursos. Todos os direitos reservados.
          </p>
          <p className="text-slate-600 text-xs mt-2">
            Curso livre. Certificado de conclusão emitido pela T&S Cursos.
          </p>
        </div>
      </footer>
    </div>
  )
}
