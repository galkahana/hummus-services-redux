import { PrincipalProvider } from 'lib/principal'
import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ModalAlertProvider } from './modal-alert/context'
import { ModalConfirmProvider } from './modal-confirm/context'
import { ToastProvider } from './toast'

const NoMatch = lazy(() => import('components/no-match'))
const ProtectedPage = lazy(() => import('components/protected-page'))

const Welcome = lazy(() => import('pages/welcome'))
const About = lazy(() => import('pages/about'))
const Contact = lazy(() => import('pages/contact'))
const Login = lazy(() => import('pages/login'))
const Home = lazy(() => import('pages/home'))
const Playground = lazy(()=> import('pages/playground'))
const Jobs = lazy(() => import('pages/jobs'))
const Account = lazy(() => import('pages/account'))

const RootNavigator = () => (
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
                            <Route path="*" element={<NoMatch/>}/>
                        </Routes>
                    </ModalConfirmProvider>
                </ModalAlertProvider>
            </ToastProvider>
        </PrincipalProvider>
    </Suspense>
)

export default RootNavigator