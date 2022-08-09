import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import { useOutletContext } from 'react-router-dom'

import mustache from 'lib/mustache'

// juss saying that when i used angular one with my own webpack i could just use the md files as pages by requiring them. is all.

export type MarkdownPageProps = {
    src: string
}  



const MarkdownPage = ({ src } : MarkdownPageProps) => {
    const [ body, setBody ] = useState<string>('')

    const { values } = useOutletContext<any>()

    useEffect(() => {
        if(!src)
            setBody('')

        fetch(src)
            .then((res) => res.text())
            .then((md) => {
                setBody(mustache.render(md, values))
            })
    }, [ src, values ])

    return (
        <div className="markdown-page">
            <ReactMarkdown children={body} rehypePlugins={[ rehypeRaw, rehypeSlug ]} />
        </div>
    )
}

export default MarkdownPage