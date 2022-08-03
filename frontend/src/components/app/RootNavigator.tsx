import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'

const Welcome = lazy(() => import('pages/welcome'))

const RootNavigator = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <Routes>
            <Route path="/" element={<Welcome/>}/>

        </Routes>
    </Suspense>
)

export default RootNavigator