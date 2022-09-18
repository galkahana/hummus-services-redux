import { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

import Document from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {

    /**
     * workaround to avoid issues with flickering styled components. solution provided here:
     * https://github.com/vercel/next.js/blob/deprecated-main/examples/with-styled-components/pages/_document.js
     * 
     * originally got there through here:
     * https://stackoverflow.com/questions/60841540/flash-of-unstyled-text-fout-on-reload-using-next-js-and-styled-components
     */

    static async getInitialProps(ctx: DocumentContext) {
        const sheet = new ServerStyleSheet()
        const originalRenderPage = ctx.renderPage

        try {
            ctx.renderPage = () =>
                originalRenderPage({
                    enhanceApp: (App) => (props) =>
                        sheet.collectStyles(<App {...props} />),
                })

            const initialProps = await Document.getInitialProps(ctx)
            return {
                ...initialProps,
                styles: (
                    <>
                        {initialProps.styles}
                        {sheet.getStyleElement()}
                    </>
                ),
            }
        } finally {
            sheet.seal()
        }
    }

    /**
     * So kinda wierd but i cant put those links in the _app.jsx head otherwise the boostrap icons go banans.
     * ok i guess.
     */

    render() {
        return (
            <Html>
                <Head>
                    <link rel="icon" href="/favicon.ico" />
                    <link rel="apple-touch-icon" href="/logo192.png" />
                    <link rel="manifest" href="/manifest.json" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}