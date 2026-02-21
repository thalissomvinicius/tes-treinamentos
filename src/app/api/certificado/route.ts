import { getSupabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import { generateCertificatePDF } from '@/lib/certificate'

export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json()

        if (!userId) {
            return NextResponse.json(
                { error: 'userId é obrigatório.' },
                { status: 400 }
            )
        }

        const supabaseAdmin = getSupabaseAdmin()

        // Fetch user data directly from Auth for security
        const { data: { user: authUser }, error: authUserError } = await supabaseAdmin.auth.admin.getUserById(userId)

        if (authUserError || !authUser) {
            return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 })
        }

        const userName = authUser.user_metadata?.name || authUser.user_metadata?.full_name

        if (!userName) {
            return NextResponse.json(
                { error: 'Nome do usuário não encontrado no cadastro. Por favor, entre em contato com o suporte.' },
                { status: 400 }
            )
        }

        const requiredModules = [
            'modulo-1-esocial',
            'modulo-2-s2210',
            'modulo-3-s2220',
            'modulo-4-s2240',
            'modulo-5-conclusao',
            'prova-final',
        ]
        const { data: progressData } = await supabaseAdmin
            .from('progress')
            .select('module_slug')
            .eq('user_id', userId)
            .eq('completed', true)
            .in('module_slug', requiredModules)

        const completedSlugs = new Set(progressData?.map((item) => item.module_slug) || [])
        if (completedSlugs.size < requiredModules.length) {
            return NextResponse.json(
                {
                    error: `Conclua todos os módulos e a Prova Final para emitir o certificado. Progresso: ${completedSlugs.size}/${requiredModules.length}.`,
                },
                { status: 400 }
            )
        }

        // Check if certificate already exists
        const { data: existing } = await supabaseAdmin
            .from('certificates')
            .select('code')
            .eq('user_id', userId)
            .single()

        let code = existing?.code

        if (!code) {
            // Generate unique validation code
            code = `TES-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

            const { error: insertError } = await supabaseAdmin.from('certificates').insert({
                user_id: userId,
                user_name: userName,
                code,
            })

            if (insertError) {
                console.error('Error inserting certificate:', insertError)
                return NextResponse.json(
                    { error: 'Erro ao salvar certificado.' },
                    { status: 500 }
                )
            }
        }

        // Generate PDF
        const origin = new URL(req.url).origin
        const verifyUrl = `${origin}/validar?codigo=${encodeURIComponent(code)}`
        const pdfBuffer = await generateCertificatePDF({
            userName,
            courseName: 'eSocial na Prática — SST',
            issuedBy: 'T&S Cursos',
            code,
            date: new Date().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }),
            verifyUrl,
        })

        return new Response(pdfBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="certificado-tes-cursos.pdf"',
            },
        })
    } catch (error) {
        console.error('Certificate error:', error)
        return NextResponse.json(
            { error: 'Erro interno ao gerar certificado.' },
            { status: 500 }
        )
    }
}
