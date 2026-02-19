export default function ContentBlock({ children }: { children: React.ReactNode }) {
    return (
        <article className="prose prose-slate prose-lg max-w-none
      prose-headings:text-slate-800 prose-headings:font-bold
      prose-h1:text-3xl prose-h1:mb-6 prose-h1:pb-4 prose-h1:border-b prose-h1:border-slate-200
      prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
      prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
      prose-p:text-slate-600 prose-p:leading-relaxed
      prose-strong:text-slate-800
      prose-a:text-blue-700 prose-a:no-underline hover:prose-a:underline
      prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic
      prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
      prose-table:rounded-xl prose-table:overflow-hidden
      prose-th:bg-blue-700 prose-th:text-white prose-th:font-semibold prose-th:text-sm prose-th:py-3
      prose-td:text-sm prose-td:py-2.5 prose-td:border-slate-100
      prose-li:text-slate-600 prose-li:marker:text-blue-700
      prose-img:rounded-xl prose-img:shadow-lg
    ">
            {children}
        </article>
    )
}
