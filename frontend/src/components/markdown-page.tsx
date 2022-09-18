import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'

export type MarkdownPageProps = {
    content: string,
}



const MarkdownPage = ({ content }: MarkdownPageProps) => {
    return (
        <div className="markdown-page">
            <ReactMarkdown children={content} rehypePlugins={[ rehypeRaw, rehypeSlug ]} />
        </div>
    )
}

export default MarkdownPage