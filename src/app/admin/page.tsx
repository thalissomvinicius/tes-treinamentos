'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { ADMIN_EMAIL } from '@/lib/admin'
import Navbar from '@/components/Navbar'

interface User {
    id: string
    email: string
    name: string
    created_at: string
    has_access: boolean
    is_admin: boolean
}

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [adminEmail, setAdminEmail] = useState('')

    // Form state
    const [showForm, setShowForm] = useState(false)
    const [formName, setFormName] = useState('')
    const [formEmail, setFormEmail] = useState('')
    const [formPassword, setFormPassword] = useState('')
    const [formAccess, setFormAccess] = useState(true)
    const [formIsAdmin, setFormIsAdmin] = useState(false)
    const [formLoading, setFormLoading] = useState(false)
    const [formError, setFormError] = useState('')
    const [formSuccess, setFormSuccess] = useState('')

    // Delete confirm
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    // Search/filter
    const [search, setSearch] = useState('')

    const loadUsers = useCallback(async () => {
        if (!adminEmail) return

        try {
            const res = await fetch('/api/admin/users', {
                headers: { 'x-user-email': adminEmail },
            })
            const data = await res.json()
            if (res.ok) {
                setUsers(data.users || [])
            }
        } catch {
            console.error('Erro ao carregar usuários')
        } finally {
            setLoading(false)
        }
    }, [adminEmail])

    useEffect(() => {
        async function init() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user?.email) {
                    console.log('[Admin] Logged in as:', user.email)
                    setAdminEmail(user.email)
                    return
                }
            } catch (err) {
                console.log('[Admin] No session, using fallback:', err)
            }
            // Fallback — no session (test mode or not logged in)
            console.log('[Admin] Using fallback admin email:', ADMIN_EMAIL)
            setAdminEmail(ADMIN_EMAIL)
        }
        init()
    }, [])

    useEffect(() => {
        if (adminEmail) loadUsers()
    }, [adminEmail, loadUsers])

    async function handleCreateUser(e: React.FormEvent) {
        e.preventDefault()
        setFormLoading(true)
        setFormError('')
        setFormSuccess('')

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-email': adminEmail,
                },
                body: JSON.stringify({
                    name: formName,
                    email: formEmail,
                    password: formPassword,
                    grantAccess: formAccess,
                    isAdminUser: formIsAdmin,
                }),
            })
            const data = await res.json()

            if (res.ok) {
                const emailFailed = !data.email_sent
                const emailStatus = data.email_sent
                    ? ' E-mail enviado com sucesso.'
                    : ` Usuário criado, mas o e-mail não foi enviado. ${data.email_error || ''}`.trim()
                if (data.purchase_error) {
                    setFormError(`Usuário criado, mas o acesso não foi liberado. ${data.purchase_error}`)
                } else if (emailFailed) {
                    setFormError(emailStatus.replace(/^Usuário criado, mas /, ''))
                } else {
                    setFormSuccess(`✅ Usuário ${formEmail} criado com sucesso!${emailStatus}`)
                }
                setFormName('')
                setFormEmail('')
                setFormPassword('')
                setFormAccess(true)
                setFormIsAdmin(false)
                loadUsers()
                if (!data.purchase_error && !emailFailed) {
                    setTimeout(() => {
                        setShowForm(false)
                        setFormSuccess('')
                    }, 2000)
                }
            } else {
                setFormError(data.error || 'Erro ao criar usuário')
            }
        } catch {
            setFormError('Erro de conexão')
        } finally {
            setFormLoading(false)
        }
    }

    async function handleSetAccess(user: User, grantAccess: boolean) {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-email': adminEmail,
                },
                body: JSON.stringify({
                    userId: user.id,
                    email: user.email,
                    grantAccess,
                }),
            })

            if (res.ok) {
                const data = await res.json()
                setUsers(prev =>
                    prev.map(u =>
                        u.id === user.id ? { ...u, has_access: !!data.has_access } : u
                    )
                )
            }
        } catch {
            console.error('Erro ao alterar acesso')
        }
    }

    async function handleDeleteUser(userId: string) {
        try {
            const res = await fetch('/api/admin/users', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-email': adminEmail,
                },
                body: JSON.stringify({ userId }),
            })

            if (res.ok) {
                setUsers(prev => prev.filter(u => u.id !== userId))
                setDeleteConfirm(null)
            }
        } catch {
            console.error('Erro ao excluir usuário')
        }
    }

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar isLoggedIn />

            <main className="pt-24 pb-16 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
                                <span className="text-2xl">🔧</span>
                                Painel Admin
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">
                                Gerencie usuários e acesso ao curso
                            </p>
                        </div>
                        <button
                            onClick={() => { setShowForm(!showForm); setFormError(''); setFormSuccess('') }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-200/50 flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Novo Usuário
                        </button>
                    </div>

                    {/* Create User Form */}
                    {showForm && (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-blue-50/50 p-6 mb-8 animate-in fade-in">
                            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span>👤</span> Criar Novo Usuário
                            </h2>
                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="admin-name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            Nome do aluno
                                        </label>
                                        <input
                                            id="admin-name"
                                            type="text"
                                            placeholder="João da Silva"
                                            value={formName}
                                            onChange={e => setFormName(e.target.value)}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="admin-email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            E-mail *
                                        </label>
                                        <input
                                            id="admin-email"
                                            type="email"
                                            required
                                            placeholder="aluno@email.com"
                                            value={formEmail}
                                            onChange={e => setFormEmail(e.target.value)}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="admin-password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            Senha * (mín. 6 caracteres)
                                        </label>
                                        <input
                                            id="admin-password"
                                            type="password"
                                            required
                                            placeholder="senha123"
                                            value={formPassword}
                                            onChange={e => setFormPassword(e.target.value)}
                                            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm font-mono"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3 justify-end">
                                        <label className="flex items-center gap-3 cursor-pointer px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 w-full hover:bg-slate-100 transition">
                                            <input
                                                type="checkbox"
                                                checked={formAccess}
                                                onChange={e => setFormAccess(e.target.checked)}
                                                className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-semibold text-slate-700">
                                                Liberar acesso ao curso
                                            </span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer px-4 py-3 bg-amber-50 rounded-xl border border-amber-200 w-full hover:bg-amber-100 transition">
                                            <input
                                                type="checkbox"
                                                checked={formIsAdmin}
                                                onChange={e => setFormIsAdmin(e.target.checked)}
                                                className="w-5 h-5 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-amber-800">
                                                    Usuário Administrador
                                                </span>
                                                <span className="text-[10px] text-amber-600 font-medium">
                                                    Acesso total ao painel
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="flex items-end">
                                        <label className="flex items-center gap-3 cursor-pointer px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 w-full">
                                            <input
                                                type="checkbox"
                                                checked={formIsAdmin}
                                                onChange={e => setFormIsAdmin(e.target.checked)}
                                                className="w-5 h-5 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
                                            />
                                            <span className="text-sm font-semibold text-slate-700">
                                                Definir como administrador
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {formError && (
                                    <p className="text-red-500 text-sm bg-red-50 rounded-lg p-3">{formError}</p>
                                )}
                                {formSuccess && (
                                    <p className="text-green-600 text-sm bg-green-50 rounded-lg p-3">{formSuccess}</p>
                                )}

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        disabled={formLoading || !formEmail || !formPassword}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all disabled:opacity-50"
                                    >
                                        {formLoading ? 'Criando...' : 'Criar Usuário'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="text-slate-500 hover:text-slate-700 font-medium text-sm px-4 py-2.5 transition"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
                            <p className="text-2xl font-extrabold text-slate-800">{users.length}</p>
                            <p className="text-xs text-slate-500 font-medium mt-1">Total de alunos</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
                            <p className="text-2xl font-extrabold text-green-600">
                                {users.filter(u => u.has_access).length}
                            </p>
                            <p className="text-xs text-slate-500 font-medium mt-1">Com acesso</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-100 p-4 text-center">
                            <p className="text-2xl font-extrabold text-red-500">
                                {users.filter(u => !u.has_access).length}
                            </p>
                            <p className="text-xs text-slate-500 font-medium mt-1">Sem acesso</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="🔍 Buscar por nome ou e-mail..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>

                    {/* Users Table */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="p-12 text-center">
                                <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-slate-500 text-sm">Carregando usuários...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-4xl mb-3">📭</p>
                                <p className="text-slate-500 font-medium">
                                    {search ? 'Nenhum usuário encontrado' : 'Nenhum aluno cadastrado ainda'}
                                </p>
                                <p className="text-slate-400 text-sm mt-1">
                                    {!search && 'Clique em "Novo Usuário" para começar'}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden md:block">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-100">
                                                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">
                                                    Aluno
                                                </th>
                                                <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">
                                                    Cadastrado em
                                                </th>
                                                <th className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">
                                                    Acesso
                                                </th>
                                                <th className="text-right text-xs font-bold text-slate-500 uppercase tracking-wider px-6 py-3">
                                                    Ações
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map(user => (
                                            <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                                                    <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-slate-800 text-sm">
                                                            {user.name || '—'}
                                                        </p>
                                                        {user.is_admin && (
                                                            <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                                                                Admin
                                                            </span>
                                                        )}
                                                    </div>
                                                        <p className="text-slate-500 text-xs mt-0.5">{user.email}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-slate-500 text-sm">
                                                            {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => handleSetAccess(user, !user.has_access)}
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${user.has_access
                                                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                : 'bg-red-100 text-red-600 hover:bg-red-200'
                                                                }`}
                                                        >
                                                            <span className={`w-2 h-2 rounded-full ${user.has_access ? 'bg-green-500' : 'bg-red-400'}`} />
                                                            {user.has_access ? 'Ativo' : 'Inativo'}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {deleteConfirm === user.id ? (
                                                            <div className="flex items-center justify-end gap-2">
                                                                <span className="text-xs text-red-500 font-medium">Confirmar?</span>
                                                                <button
                                                                    onClick={() => handleDeleteUser(user.id)}
                                                                    className="text-xs bg-red-500 hover:bg-red-600 text-white font-bold px-3 py-1.5 rounded-lg transition"
                                                                >
                                                                    Sim
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteConfirm(null)}
                                                                    className="text-xs text-slate-500 hover:text-slate-700 font-medium px-2 py-1.5 transition"
                                                                >
                                                                    Não
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleSetAccess(user, !user.has_access)}
                                                                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${user.has_access
                                                                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                                                                        }`}
                                                                >
                                                                    {user.has_access ? 'Remover acesso' : 'Liberar acesso'}
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteConfirm(user.id)}
                                                                    className="text-slate-400 hover:text-red-500 transition"
                                                                    title="Excluir usuário"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="md:hidden divide-y divide-slate-100">
                                    {filteredUsers.map(user => (
                                        <div key={user.id} className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-slate-800 text-sm">{user.name || '—'}</p>
                                                        {user.is_admin && (
                                                            <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                                                                Admin
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-slate-500 text-xs">{user.email}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleSetAccess(user, !user.has_access)}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${user.has_access
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-600'
                                                        }`}
                                                >
                                                    <span className={`w-2 h-2 rounded-full ${user.has_access ? 'bg-green-500' : 'bg-red-400'}`} />
                                                    {user.has_access ? 'Ativo' : 'Inativo'}
                                                </button>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-slate-400 text-xs">
                                                    Cadastrado em {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                                </p>
                                                {deleteConfirm === user.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            className="text-xs bg-red-500 text-white font-bold px-3 py-1 rounded-lg"
                                                        >
                                                            Excluir
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(null)}
                                                            className="text-xs text-slate-500 font-medium px-2 py-1"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleSetAccess(user, !user.has_access)}
                                                            className={`text-xs font-semibold px-3 py-1 rounded-lg ${user.has_access
                                                                ? 'bg-red-50 text-red-600'
                                                                : 'bg-green-50 text-green-700'
                                                                }`}
                                                        >
                                                            {user.has_access ? 'Remover acesso' : 'Liberar acesso'}
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(user.id)}
                                                            className="text-slate-400 hover:text-red-500 transition"
                                                            title="Excluir Usuário"
                                                            aria-label="Excluir Usuário"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
