import { Html, Head, Main, NextScript } from 'next/document'

/**
 * So kinda wierd but i cant put those links in the _app.jsx head otherwise the boostrap icons go banans.
 * ok i guess.
 */

export default function Document() {
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