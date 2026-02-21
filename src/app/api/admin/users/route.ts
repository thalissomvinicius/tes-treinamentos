import { getSupabaseAdmin } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Helper: verify admin from request
async function verifyAdmin(req: NextRequest) {
    const email = req.headers.get('x-user-email')
    if (!email) return null
    if (isAdmin(email)) return email

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.auth.admin.listUsers()
    if (error) {
        console.error('Error checking admin user:', error)
        return null
    }
    const adminMatch = data.users.find(user => user.email?.toLowerCase() === email.toLowerCase())
    if (adminMatch && isAdmin(email, adminMatch.user_metadata)) return email
    return null
}

function buildWelcomeEmailHtml(params: {
    name: string
    email: string
    password: string
    loginUrl: string
    grantAccess: boolean
}) {
    const { name, email, password, loginUrl, grantAccess } = params
    const accessLine = grantAccess
        ? 'Seu acesso já está liberado.'
        : 'Seu acesso será liberado assim que o pagamento for confirmado.'

    return `
        <div style="margin:0;padding:0;background:#e2e8f0;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
            <div style="max-width:640px;margin:0 auto;padding:26px 14px;">
                <div style="background:#0f172a;border-radius:22px 22px 18px 18px;padding:26px 22px;text-align:center;color:#ffffff;">
                    <div style="font-size:20px;font-weight:800;letter-spacing:0.08em;">T&amp;S CURSOS</div>
                    <div style="margin-top:6px;font-size:13px;color:#cbd5f5;">eSocial na Prática — SST</div>
                    <div style="margin-top:18px;">
                        <span style="display:inline-block;width:44px;height:44px;border-radius:999px;background:#1d4ed8;color:#ffffff;line-height:44px;text-align:center;font-size:20px;">👩‍💻</span>
                        <span style="display:inline-block;width:44px;height:44px;border-radius:999px;background:#2563eb;color:#ffffff;line-height:44px;text-align:center;font-size:20px;margin:0 6px;">🧑‍🏫</span>
                        <span style="display:inline-block;width:44px;height:44px;border-radius:999px;background:#1e40af;color:#ffffff;line-height:44px;text-align:center;font-size:20px;">🧑‍🎓</span>
                    </div>
                </div>
                <div style="background:#ffffff;border-radius:18px;padding:22px 20px;border:1px solid #e2e8f0;margin-top:-14px;box-shadow:0 14px 28px rgba(15,23,42,0.08);">
                    <h1 style="font-size:20px;margin:0 0 10px;color:#0f172a;">Olá${name ? `, ${name}` : ''}!</h1>
                    <p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#334155;">
                        Seu cadastro foi criado com sucesso. ${accessLine}
                    </p>
                    <div style="background:#eff6ff;border-radius:14px;padding:16px;border:1px solid #bfdbfe;margin:18px 0;">
                        <div style="font-size:12px;color:#1d4ed8;text-transform:uppercase;letter-spacing:0.08em;font-weight:700;margin-bottom:8px;">Dados de acesso</div>
                        <div style="font-size:14px;color:#0f172a;margin-bottom:6px;"><strong>E-mail:</strong> ${email}</div>
                        <div style="font-size:14px;color:#0f172a;"><strong>Senha:</strong> ${password}</div>
                    </div>
                    <a href="${loginUrl}" style="display:block;background:#1d4ed8;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 18px;border-radius:12px;font-size:14px;text-align:center;max-width:260px;margin:0 auto;">Acessar o painel</a>
                    <div style="margin-top:22px;">
                        <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:8px;">Gratificações do curso</div>
                        <ul style="padding-left:18px;margin:0;color:#475569;font-size:13px;line-height:1.7;">
                            <li>Certificado digital de 40 horas com código de validação</li>
                            <li>Acesso vitalício ao conteúdo e atualizações futuras</li>
                            <li>Quizzes de fixação por módulo</li>
                            <li>Apostila em PDF para estudo offline</li>
                            <li>Suporte direto pelo WhatsApp</li>
                        </ul>
                    </div>
                    <div style="margin-top:20px;font-size:12px;color:#64748b;line-height:1.6;">
                        Recomendamos que você altere sua senha após o primeiro acesso.
                    </div>
                </div>
                <div style="text-align:center;font-size:11px;color:#64748b;margin-top:14px;">
                    © ${new Date().getFullYear()} T&amp;S Cursos. Todos os direitos reservados.
                </div>
            </div>
        </div>
    `
}

function buildWelcomeEmailText(params: {
    name: string
    email: string
    password: string
    loginUrl: string
    grantAccess: boolean
}) {
    const { name, email, password, loginUrl, grantAccess } = params
    const accessLine = grantAccess
        ? 'Seu acesso já está liberado.'
        : 'Seu acesso será liberado assim que o pagamento for confirmado.'

    return [
        `Olá${name ? `, ${name}` : ''}!`,
        '',
        'Seu cadastro foi criado com sucesso.',
        accessLine,
        '',
        'Dados de acesso:',
        `E-mail: ${email}`,
        `Senha: ${password}`,
        '',
        `Acesse o painel: ${loginUrl}`,
        '',
        'Gratificações do curso:',
        '- Certificado digital de 40 horas com código de validação',
        '- Acesso vitalício ao conteúdo e atualizações futuras',
        '- Quizzes de fixação por módulo',
        '- Apostila em PDF para estudo offline',
        '- Suporte direto pelo WhatsApp',
        '',
        'Recomendamos que você altere sua senha após o primeiro acesso.',
    ].join('\n')
}

async function upsertPurchase(params: {
    supabase: ReturnType<typeof getSupabaseAdmin>
    userId: string
    email: string
    paid: boolean
}) {
    const payload = {
        email: params.email,
        user_id: params.userId,
        stripe_session_id: `admin-${Date.now()}`,
        stripe_customer_id: `manual-${params.userId}`,
        paid: params.paid,
    }

    const { data: existingByUser, error: findByUserError } = await params.supabase
        .from('purchases')
        .select('user_id, email')
        .eq('user_id', params.userId)
        .limit(1)

    if (findByUserError) {
        return { ok: false, error: findByUserError.message || 'Erro ao consultar acesso' }
    }

    if (existingByUser && existingByUser.length > 0) {
        const { error: updateError } = await params.supabase
            .from('purchases')
            .update(payload)
            .eq('user_id', params.userId)
        if (updateError) {
            return { ok: false, error: updateError.message || 'Erro ao atualizar acesso' }
        }
        return { ok: true }
    }

    if (params.email) {
        const { data: existingByEmail, error: findByEmailError } = await params.supabase
            .from('purchases')
            .select('user_id, email')
            .eq('email', params.email)
            .limit(1)

        if (findByEmailError) {
            return { ok: false, error: findByEmailError.message || 'Erro ao consultar acesso' }
        }

        if (existingByEmail && existingByEmail.length > 0) {
            const { error: updateByEmailError } = await params.supabase
                .from('purchases')
                .update(payload)
                .eq('email', params.email)
            if (updateByEmailError) {
                return { ok: false, error: updateByEmailError.message || 'Erro ao atualizar acesso' }
            }
            return { ok: true }
        }
    }

    const { error: insertError } = await params.supabase
        .from('purchases')
        .insert(payload)

    if (insertError) {
        return { ok: false, error: insertError.message || 'Erro ao liberar acesso' }
    }

    return { ok: true }
}

async function sendWelcomeEmail(params: {
    to: string
    name: string
    password: string
    grantAccess: boolean
    adminEmail: string
    origin: string
}) {
    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || 465)
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS

    if (!host || !user || !pass) {
        return { sent: false, error: 'SMTP não configurado' }
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    })

    const fromAddress = process.env.SMTP_FROM || user
    const loginUrl = `${params.origin}/login`

    try {
        await transporter.sendMail({
            from: `T&S Cursos <${fromAddress}>`,
            to: params.to,
            replyTo: params.adminEmail,
            subject: 'Bem-vindo à T&S Cursos — Dados de acesso',
            text: buildWelcomeEmailText({
                name: params.name,
                email: params.to,
                password: params.password,
                loginUrl,
                grantAccess: params.grantAccess,
            }),
            html: buildWelcomeEmailHtml({
                name: params.name,
                email: params.to,
                password: params.password,
                loginUrl,
                grantAccess: params.grantAccess,
            }),
        })
        return { sent: true }
    } catch (error) {
        console.error('Error sending welcome email:', error)
        return { sent: false, error: 'Falha ao enviar e-mail' }
    }
}

// GET — List all users with access status
export async function GET(req: NextRequest) {
    const adminEmail = await verifyAdmin(req)
    if (!adminEmail) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const supabase = getSupabaseAdmin()

    try {
        // List all users from Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers()

        if (authError) {
            console.error('Error listing users:', authError)
            return NextResponse.json({ error: 'Erro ao listar usuários' }, { status: 500 })
        }

        // Get all purchases
        const { data: purchases } = await supabase
            .from('purchases')
            .select('user_id, email, paid')

        // Merge data
        const users = authData.users
            .filter(u => !isAdmin(u.email, u.user_metadata))
            .map(u => {
                const purchase = purchases?.find(p => p.user_id === u.id || p.email === u.email)
                return {
                    id: u.id,
                    email: u.email || '',
                    name: u.user_metadata?.name || u.user_metadata?.full_name || '',
                    created_at: u.created_at,
                    has_access: purchase?.paid || false,
                    is_admin: !!u.user_metadata?.is_admin,
                }
            })

        return NextResponse.json({ users })
    } catch (error) {
        console.error('Error in GET /api/admin/users:', error)
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}

// POST — Create new user
export async function POST(req: NextRequest) {
    const adminEmail = await verifyAdmin(req)
    if (!adminEmail) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const supabase = getSupabaseAdmin()

    try {
        const { name, email, password, grantAccess, isAdminUser } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'E-mail e senha são obrigatórios' }, { status: 400 })
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Senha deve ter no mínimo 6 caracteres' }, { status: 400 })
        }

        // Create user in Supabase Auth
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Skip email verification
            user_metadata: { name: name || '', is_admin: !!isAdminUser },
        })

        if (authError) {
            if (authError.message.includes('already been registered')) {
                return NextResponse.json({ error: 'Este e-mail já está cadastrado' }, { status: 400 })
            }
            console.error('Error creating user:', authError)
            return NextResponse.json({ error: authError.message }, { status: 500 })
        }

        if (!authUser?.user) {
            return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 })
        }

        // If granting access, create purchase record
        let purchaseError: string | null = null
        if (grantAccess) {
            const purchaseResult = await upsertPurchase({
                supabase,
                userId: authUser.user.id,
                email,
                paid: true,
            })
            if (!purchaseResult.ok) {
                purchaseError = purchaseResult.error || 'Erro ao liberar acesso'
            }
        }

        const origin = new URL(req.url).origin
        const emailResult = await sendWelcomeEmail({
            to: email,
            name: name || '',
            password,
            grantAccess: !!grantAccess,
            adminEmail,
            origin,
        })

        console.log(`✅ User created by admin: ${email} (access: ${grantAccess ? 'yes' : 'no'})`)

        return NextResponse.json({
            user: {
                id: authUser.user.id,
                email,
                name: name || '',
                created_at: authUser.user.created_at,
                has_access: !!grantAccess && !purchaseError,
            },
            email_sent: emailResult.sent,
            email_error: emailResult.sent ? null : emailResult.error,
            purchase_error: purchaseError,
        })
    } catch (error) {
        console.error('Error in POST /api/admin/users:', error)
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}

// PATCH — Toggle access
export async function PATCH(req: NextRequest) {
    const adminEmail = await verifyAdmin(req)
    if (!adminEmail) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const supabase = getSupabaseAdmin()

    try {
        const { userId, email, grantAccess } = await req.json()

        if (!userId) {
            return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 })
        }

        const accessResult = grantAccess
        if (grantAccess) {
            const purchaseResult = await upsertPurchase({
                supabase,
                userId,
                email: email || '',
                paid: true,
            })
            if (!purchaseResult.ok) {
                return NextResponse.json({ error: purchaseResult.error || 'Erro ao liberar acesso' }, { status: 500 })
            }
        } else {
            const { data: revokedByUser, error: revokeError } = await supabase
                .from('purchases')
                .update({ paid: false })
                .eq('user_id', userId)
                .select('user_id')
            if (revokeError) {
                return NextResponse.json({ error: 'Erro ao revogar acesso' }, { status: 500 })
            }
            if ((!revokedByUser || revokedByUser.length === 0) && email) {
                const { error: revokeByEmailError } = await supabase
                    .from('purchases')
                    .update({ paid: false })
                    .eq('email', email)
                if (revokeByEmailError) {
                    return NextResponse.json({ error: 'Erro ao revogar acesso' }, { status: 500 })
                }
            }
        }

        console.log(`✅ Access ${grantAccess ? 'granted' : 'revoked'} for user ${userId}`)

        return NextResponse.json({ success: true, has_access: accessResult })
    } catch (error) {
        console.error('Error in PATCH /api/admin/users:', error)
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}

// DELETE — Remove user
export async function DELETE(req: NextRequest) {
    const adminEmail = await verifyAdmin(req)
    if (!adminEmail) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
    }

    const supabase = getSupabaseAdmin()

    try {
        const { userId } = await req.json()

        if (!userId) {
            return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 })
        }

        // Delete purchase record
        await supabase.from('purchases').delete().eq('user_id', userId)

        // Delete progress records
        await supabase.from('progress').delete().eq('user_id', userId)

        // Delete from Supabase Auth
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)

        if (deleteError) {
            console.error('Error deleting user:', deleteError)
            return NextResponse.json({ error: 'Erro ao excluir usuário' }, { status: 500 })
        }

        console.log(`✅ User deleted: ${userId}`)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in DELETE /api/admin/users:', error)
        return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
    }
}
