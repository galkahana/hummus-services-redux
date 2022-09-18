import React from 'react'

import PublicBase from '@components/public-base'
import Link from 'next/link'

const NotFound = () => {
    return <PublicBase>
        <div className="container">
            <h1>404 - Page not found</h1>
            <p>Seems like y'r a little lost, try one of the following</p>
            <ul>
                <li><Link href="/">Site home</Link></li>
                <li><Link href="/console/">Dashboard</Link></li>
            </ul>
        </div>
    </PublicBase>

}

export default NotFound