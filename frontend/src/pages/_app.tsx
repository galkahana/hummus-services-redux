import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-datepicker/dist/react-datepicker.css'
import '../pages-styles/styles.css'

import Head from 'next/head'
import { AppProps } from 'next/app'
import { PrincipalProvider } from '@lib/principal'
import { ModalAlertProvider } from '@components/modal-alert/context'
import { ModalConfirmProvider } from '@components/modal-confirm/context'
import { ToastProvider } from '@components/toast'
import { ConfigProvider } from '@lib/config'


export default function MyApp({ Component, pageProps }: AppProps) {
    return <ConfigProvider>
        <PrincipalProvider>
            <ToastProvider>
                <ModalAlertProvider>
                    <ModalConfirmProvider>
                        <Head>
                            <title>PDFHummus Services</title>
                            <meta name="viewport" content="width=device-width, initial-scale=1" />
                            <meta name="theme-color" content="#000000" />
                            <meta name="copyright" content="© 2022 GAL KAHANA ALL RIGHTS RESERVED" />
                            <meta name="description"
                                content="Create your PDF files over the cloud with PDFHummus Services. Your software sends description, and gets back a download URL" />
                            <meta name="keywords" content="PDFHummus, Cloud, PDF, Create, Modify, Services, Hummus" />

                            <meta property="og:title" content="PDFHummus Services" />
                            <meta property="og:type" content="website" />
                            <meta property="og:image" content="https://s3-us-west-2.amazonaws.com/hummus-services/assets/logo.png" />
                            <meta property="og:description"
                                content="Create your PDF files over the cloud with PDFHummus Services. Your software sends description, and gets back a download URL" />
                            <meta property="og:site_name" content="PDFHummus" />
                        </Head>
                        <Component {...pageProps} />
                    </ModalConfirmProvider>
                </ModalAlertProvider>
            </ToastProvider>
        </PrincipalProvider>
    </ConfigProvider>
}