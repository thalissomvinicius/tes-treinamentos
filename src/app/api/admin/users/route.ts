import { getSupabaseAdmin } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'
import { NextRequest, NextResponse } from 'next/server'

// Helper: verify admin from request
async function verifyAdmin(req: NextRequest) {
    // Check the x-user-email header sent by the client
    const email = req.headers.get('x-user-email')
    console.log('[Admin API] x-user-email header:', email, '| isAdmin:', isAdmin(email))
    if (!email || !isAdmin(email)) return null
    return email
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
            .filter(u => !isAdmin(u.email)) // Don't show admin in the list
            .map(u => {
                const purchase = purchases?.find(p => p.user_id === u.id || p.email === u.email)
                return {
                    id: u.id,
                    email: u.email || '',
                    name: u.user_metadata?.name || u.user_metadata?.full_name || '',
                    created_at: u.created_at,
                    has_access: purchase?.paid || false,
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
        const { name, email, password, grantAccess } = await req.json()

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
            user_metadata: { name: name || '' },
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
        if (grantAccess) {
            await supabase.from('purchases').upsert(
                {
                    email,
                    user_id: authUser.user.id,
                    stripe_session_id: `admin-${Date.now()}`,
                    stripe_customer_id: `manual-${authUser.user.id}`,
                    paid: true,
                },
                { onConflict: 'user_id' }
            )
        }

        console.log(`✅ User created by admin: ${email} (access: ${grantAccess ? 'yes' : 'no'})`)

        return NextResponse.json({
            user: {
                id: authUser.user.id,
                email,
                name: name || '',
                created_at: authUser.user.created_at,
                has_access: grantAccess || false,
            },
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

        if (grantAccess) {
            // Grant access — upsert purchase
            await supabase.from('purchases').upsert(
                {
                    email: email || '',
                    user_id: userId,
                    stripe_session_id: `admin-${Date.now()}`,
                    stripe_customer_id: `manual-${userId}`,
                    paid: true,
                },
                { onConflict: 'user_id' }
            )
        } else {
            // Revoke access — update paid to false
            await supabase
                .from('purchases')
                .update({ paid: false })
                .eq('user_id', userId)
        }

        console.log(`✅ Access ${grantAccess ? 'granted' : 'revoked'} for user ${userId}`)

        return NextResponse.json({ success: true, has_access: grantAccess })
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
