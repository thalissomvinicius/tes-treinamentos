export const ADMIN_EMAILS = ['thalissomvinicius7@gmail.com']
export const ADMIN_EMAIL = ADMIN_EMAILS[0]

export function isAdmin(
    email: string | undefined | null,
    metadata?: { is_admin?: boolean | null }
): boolean {
    if (metadata?.is_admin) return true
    if (!email) return false
    return ADMIN_EMAILS.some(adminEmail => adminEmail.toLowerCase() === email.toLowerCase())
}
