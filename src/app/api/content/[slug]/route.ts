import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params

    const filePath = path.join(process.cwd(), 'content', `${slug}.mdx`)

    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'Módulo não encontrado' }, { status: 404 })
    }

    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)

    // Convert markdown to HTML
    const result = await remark().use(remarkGfm).use(remarkHtml).process(content)

    return NextResponse.json({
        title: data.title || slug,
        slug: data.slug || slug,
        description: data.description || '',
        icon: data.icon || '📖',
        content: result.toString(),
    })
}
