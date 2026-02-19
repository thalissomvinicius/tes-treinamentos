import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface ModuleData {
    slug: string
    title: string
    order: number
    description: string
    icon: string
    content: string
}

const MODULES_DIR = path.join(process.cwd(), 'content')

export function getModuleSlugs(): string[] {
    if (!fs.existsSync(MODULES_DIR)) return []
    return fs
        .readdirSync(MODULES_DIR)
        .filter((f) => f.endsWith('.mdx'))
        .map((f) => f.replace('.mdx', ''))
}

export function getModuleBySlug(slug: string): ModuleData | null {
    const filePath = path.join(MODULES_DIR, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) return null

    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)

    return {
        slug,
        title: data.title || slug,
        order: data.order || 0,
        description: data.description || '',
        icon: data.icon || '📖',
        content,
    }
}

export function getAllModules(): ModuleData[] {
    return getModuleSlugs()
        .map(getModuleBySlug)
        .filter(Boolean)
        .sort((a, b) => (a!.order - b!.order)) as ModuleData[]
}

export const MODULES_LIST = [
    { slug: 'modulo-1-esocial', title: 'Fundamentos do eSocial', icon: '📋', order: 1 },
    { slug: 'modulo-2-s2210', title: 'S-2210 | CAT', icon: '🚨', order: 2 },
    { slug: 'modulo-3-s2220', title: 'S-2220 | ASO', icon: '🩺', order: 3 },
    { slug: 'modulo-4-s2240', title: 'S-2240 | Agentes Nocivos', icon: '⚠️', order: 4 },
    { slug: 'modulo-5-conclusao', title: 'Considerações Finais', icon: '🎓', order: 5 },
]
