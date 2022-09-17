import React from 'react'

import PublicBase from 'components/public-base'
import { useConfig } from 'lib/config'

const Contact = () => {
    const config = useConfig()

    return <PublicBase>
        <div className="container">
            <p>PDFHummus services is now in beta. If you think that you have a project where our service can fit, 
drop us a note at <a href={`mailto:${config?.joinEmail}`}>{config?.joinEmail}</a>. We will get back to you as soon as possible.</p>

            <p>For support email <a href={`mailto:${config?.supportEmail}`}>{config?.supportEmail}</a>.</p>
        </div>
    </PublicBase>

}

export default Contact