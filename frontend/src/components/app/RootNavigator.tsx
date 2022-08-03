import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

const Welcome = lazy(() => import('pages/welcome'))
const About = lazy(() => import('pages/about'))
const Contact = lazy(() => import('pages/contact'))

const RootNavigator = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <Routes>
            <Route path="/" element={<Welcome/>}/>
            <Route path="about" element={<About/>}/>
            <Route path="contact" element={<Contact/>}/>

        </Routes>
    </Suspense>
)

export default RootNavigator