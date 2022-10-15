import path from 'path'
import fs from 'fs'

import React, { useEffect, useState, ReactElement } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'

import mustache from '@lib/mustache'
import { siteUrlRoot, apiUrl } from '@lib/urls'
import { useConfig } from '@lib/config'

import DocumentationLayout from '@components/documentation-layout'
import { NextPageWithLayout } from '@components/layout-types'

type DocumentationPageProps = {
    content: string
}

// rehypeRaw is for allowing input markdown to contain inline html
// rehypeSlug is to create slugs for titles (anchor links)

const DocumentationPage: NextPageWithLayout<DocumentationPageProps> = ({ content }: DocumentationPageProps) => {
    const [ values, setValues ] = useState<any>({})
    const config = useConfig()


    useEffect(() => {
        setValues({ siteUrlRoot, apiUrl, joinEmail: config?.joinEmail })
    }, [ config ])

    return (
        <ReactMarkdown children={mustache.render(content, values)} rehypePlugins={[ rehypeRaw, rehypeSlug ]} />
    )
}

DocumentationPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <DocumentationLayout>
            {page}
        </DocumentationLayout>
    )
}

export default DocumentationPage

const PATHES_TO_MDS: { [key: string]: string } = {
    '': 'introduction.md',
    'getting-started': 'getting-started.md',
    'api': 'api-reference.md',
    'api/browser': 'api-reference-browser.md',
    'api/nodejs': 'api-reference-nodejs.md',
    'api/http': 'api-reference-http.md',
    'job-ticket': 'job-ticket.md',
    'job-ticket/boxes': 'hummus-reports/job-ticket-boxes.md',
    'job-ticket/document': 'hummus-reports/job-ticket-document.md',
    'job-ticket/images': 'hummus-reports/job-ticket-images.md',
    'job-ticket/modification': 'hummus-reports/job-ticket-modification.md',
    'job-ticket/pages': 'hummus-reports/job-ticket-pages.md',
    'job-ticket/protection': 'hummus-reports/job-ticket-protection.md',
    'job-ticket/shapes': 'hummus-reports/job-ticket-shapes.md',
    'job-ticket/streams': 'hummus-reports/job-ticket-streams.md',
    'job-ticket/text': 'hummus-reports/job-ticket-text.md',
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = Object.keys(PATHES_TO_MDS).map((key) => ({ params: { id: key.split('/') } }))
    return {
        paths,
        fallback: false
    }
}

const assetsPath = path.resolve(process.cwd(), 'src/assets/mds')

export const getStaticProps: GetStaticProps = async ({ params }) => {
    return {
        props: {
            content: fs.readFileSync(path.resolve(assetsPath, PATHES_TO_MDS[(params?.id as string[] || []).join('/')]), 'utf8')
        }
    }
}