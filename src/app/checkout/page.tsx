'use client'

import Navbar from '@/components/Navbar'

const WHATSAPP_NUMBER = '5591992770425'
const WHATSAPP_MESSAGE = encodeURIComponent('Olá! Tenho interesse no curso eSocial na Prática — SST da T&S Cursos. Gostaria de adquirir o acesso.')
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            <Navbar />

            <main className="pt-32 pb-20 px-4">
                <div className="max-w-lg mx-auto text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-extrabold text-slate-800 mb-3">
                        Adquira seu acesso
                    </h1>
                    <p className="text-slate-500 leading-relaxed mb-8 max-w-md mx-auto">
                        Para comprar o curso <strong className="text-slate-700">eSocial na Prática — SST</strong>,
                        entre em contato diretamente conosco pelo WhatsApp. Aceitamos pagamento
                        via <strong className="text-blue-700">PIX</strong> e <strong className="text-blue-700">cartões</strong> por link direto.
                    </p>

                    {/* Price card */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 mb-8">
                        <div className="mb-2">
                            <span className="text-sm text-slate-400 line-through">R$ 197,00</span>
                        </div>
                        <div className="flex items-baseline justify-center gap-1 mb-4">
                            <span className="text-sm text-slate-500 font-semibold">R$</span>
                            <span className="text-5xl font-extrabold text-slate-900">97</span>
                            <span className="text-lg text-slate-500">,00</span>
                        </div>
                        <p className="text-slate-400 text-sm mb-6">
                            Pagamento único • Acesso vitalício
                        </p>

                        {/* WhatsApp Button */}
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
                        <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            PIX • Cartões • Link direto
                        </div>
                    </div>

                    {/* How it works */}
                    <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-6 text-left">
                        <h3 className="font-bold text-blue-800 text-sm mb-4 flex items-center gap-2">
                            <span className="text-lg">📋</span> Como funciona?
                        </h3>
                        <ol className="space-y-3">
                            {[
                                'Clique no botão e fale conosco pelo WhatsApp',
                                'Enviamos o link de pagamento (PIX ou cartão)',
                                'Após confirmação, liberamos seu acesso ao curso',
                                'Pronto! Acesse o painel e comece a estudar',
                            ].map((step, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-blue-700">
                                    <span className="w-6 h-6 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                        {i + 1}
                                    </span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </main>
        </div>
    )
}
