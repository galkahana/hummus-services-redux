import React, { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

// md pages (use as documentation), import will only get the url...so don't bother with lazyloading
import hummusReportsJobTicketBoxes from 'pages/mds/hummus-reports/job-ticket-boxes.md'
import hummusReportsJobTicketDocument from 'pages/mds/hummus-reports/job-ticket-document.md'
import hummusReportsJobTicketImages from 'pages/mds/hummus-reports/job-ticket-images.md'
import hummusReportsJobTicketModicifation from 'pages/mds/hummus-reports/job-ticket-modification.md'
import hummusReportsJobTicketPages from 'pages/mds/hummus-reports/job-ticket-pages.md'
import hummusReportsJobTicketProtection from 'pages/mds/hummus-reports/job-ticket-protection.md'
import hummusReportsJobTicketShapes from 'pages/mds/hummus-reports/job-ticket-shapes.md'
import hummusReportsJobTicketStreams from 'pages/mds/hummus-reports/job-ticket-streams.md'
import hummusReportsJobTicketText from 'pages/mds/hummus-reports/job-ticket-text.md'
import apiRefrenceBrowser from 'pages/mds/api-reference-browser.md'
import apiRefrenceHTTP from 'pages/mds/api-reference-http.md'
import apiRefrenceNodejs from 'pages/mds/api-reference-nodejs.md'
import apiRefrence from 'pages/mds/api-reference.md'
import gettingStarted from 'pages/mds/getting-started.md'
import introduction from 'pages/mds/introduction.md'
import jobTickt from 'pages/mds/job-ticket.md'

import { PrincipalProvider } from 'lib/principal'
import { ModalAlertProvider } from './modal-alert/context'
import { ModalConfirmProvider } from './modal-confirm/context'
import { ToastProvider } from './toast'

const NoMatch = lazy(() => import('components/no-match'))
const ProtectedPage = lazy(() => import('components/protected-page'))
const MarkdownPage = lazy(() => import('pages/documentation-page/markdown-page'))

const Welcome = lazy(() => import('pages/welcome'))
const About = lazy(() => import('pages/about'))
const Contact = lazy(() => import('pages/contact'))
const Login = lazy(() => import('pages/login'))
const Home = lazy(() => import('pages/home'))
const Playground = lazy(()=> import('pages/playground'))
const Jobs = lazy(() => import('pages/jobs'))
const Account = lazy(() => import('pages/account'))
const DocumentationPage = lazy(() => import('pages/documentation-page'))


const RootNavigator = () => {
    const  location= useLocation()
    const { pathname, hash, key } = location

    // so hashes (anchor by name!) work when url directly holds a hash
    useEffect(() => {
        if (!hash)
            return // used to be...but just stay where you damn are. window.scrollTo(0, 0)

        setTimeout(() => {
            // convering both names and ids
            const id = hash.replace('#', '')
            const elements = document.getElementsByName(id)
            const element = elements.length > 0 ? elements[0]: document.getElementById(id)
            if (element) {
                element.scrollIntoView()
            }
        }, 100)
    }, [ pathname, hash, key, location ])
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PrincipalProvider>
                <ToastProvider>
                    <ModalAlertProvider>
                        <ModalConfirmProvider>
                            <Routes>
                                <Route path="/" element={<Welcome/>}/>
                                <Route path="about" element={<About/>}/>
                                <Route path="contact" element={<Contact/>}/>
                                <Route path="login" element={<Login/>}/>
                                <Route path="console">
                                    <Route index element={<ProtectedPage><Home/></ProtectedPage>}/>
                                    <Route path="playground" element={<ProtectedPage><Playground/></ProtectedPage>}/>
                                    <Route path="jobs" element={<ProtectedPage><Jobs/></ProtectedPage>}/>
                                    <Route path="account" element={<ProtectedPage><Account/></ProtectedPage>}/>
                                </Route>
                                <Route path="documentation" element={<DocumentationPage/>}>
                                    <Route index element={<MarkdownPage src={introduction}/>}/>
                                    <Route path="getting-started" element={<MarkdownPage src={gettingStarted}/>}/>
                                    <Route path="api">
                                        <Route index element={<MarkdownPage src={apiRefrence}/>}/>
                                        <Route path="browser" element={<MarkdownPage src={apiRefrenceBrowser}/>}/>
                                        <Route path="nodejs" element={<MarkdownPage src={apiRefrenceNodejs}/>}/>
                                        <Route path="http" element={<MarkdownPage src={apiRefrenceHTTP}/>}/>
                                    </Route>
                                    <Route path="job-ticket">
                                        <Route index element={<MarkdownPage src={jobTickt}/>}/>
                                        <Route path="boxes" element={<MarkdownPage src={hummusReportsJobTicketBoxes}/>}/>
                                        <Route path="document" element={<MarkdownPage src={hummusReportsJobTicketDocument}/>}/>
                                        <Route path="images" element={<MarkdownPage src={hummusReportsJobTicketImages}/>}/>
                                        <Route path="modification" element={<MarkdownPage src={hummusReportsJobTicketModicifation}/>}/>
                                        <Route path="pages" element={<MarkdownPage src={hummusReportsJobTicketPages}/>}/>
                                        <Route path="protection" element={<MarkdownPage src={hummusReportsJobTicketProtection}/>}/>
                                        <Route path="shapes" element={<MarkdownPage src={hummusReportsJobTicketShapes}/>}/>
                                        <Route path="streams" element={<MarkdownPage src={hummusReportsJobTicketStreams}/>}/>
                                        <Route path="text" element={<MarkdownPage src={hummusReportsJobTicketText}/>}/>
                                    </Route>

                                </Route>
                                <Route path="*" element={<NoMatch/>}/>
                            </Routes>
                        </ModalConfirmProvider>
                    </ModalAlertProvider>
                </ToastProvider>
            </PrincipalProvider>
        </Suspense>
    )
}

export default RootNavigator