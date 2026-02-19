// Admin configuration
export const ADMIN_EMAIL = 'thalissomvinicius7@gmail.com'

export function isAdmin(email: string | undefined | null): boolean {
    if (!email) return false
    return email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
}
