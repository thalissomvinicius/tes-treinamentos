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

        // Verify all modules completed
        const TOTAL_MODULES = 5
        const { data: progressData } = await supabaseAdmin
            .from('progress')
            .select('module_slug')
            .eq('user_id', userId)
            .eq('completed', true)

        if (!progressData || progressData.length < TOTAL_MODULES) {
            return NextResponse.json(
                {
                    error: `Conclua todos os módulos para emitir o certificado. Progresso: ${progressData?.length || 0}/${TOTAL_MODULES}.`,
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
