import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-datepicker/dist/react-datepicker.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import '@pages-styles/styles.css'

import { AppProps } from 'next/app'
import { NextPageWithLayout } from '@components/layout-types'
import AppLayout from '@components/app-layout'

  
type AppPropsWithLayout = AppProps & {
Component: NextPageWithLayout
}
  

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout ?? ((page) => page)

    return <AppLayout>
        {getLayout(<Component {...pageProps} />)}
    </AppLayout>
}