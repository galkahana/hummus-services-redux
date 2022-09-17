import React from 'react'

import PublicBase from '@components/public-base'

const About = () => {
    return <PublicBase>
        <div className="container">
            <h1>A cloud based PDF generation service</h1>

            <p>Good for any application that requires creation of PDF documents. A perfect match to any developer that doesn't want the hassle.      </p>

            <p>Simple to use - Use REST, NodeJS or your client Javascript code to send a job description to PDFHummus Services. A PDF file will be created on our servers, and in return you'll get back a URL that you can download the file from.  </p>

            <p>You can use this URL to either download this PDF to your server, or send it directly to your end customer through email.  </p>

            <h1>It is your Choice for Generating PDF files</h1>

            <ol>
                <li>The job description is a Javascript object. Simple to create programatically. Very easy to introduce variable data and create templates. </li>
                <li>The service API is good for any application, using a simple REST procotol. And we got some helper libs for NodeJS and Client Javascript. Since our servers do all the hard PDF crunching - you can easily introduce PDF creation to your lightweight apps, and even your wordpress sites.</li>
                <li>Generation is fast thanks to a very efficient engine, so you can create the PDFs on demand.</li>
                <li>PDF files can be stored for as long as you like them to be.</li>
                <li>You pay as you go - according to how large the PDFs are, and how many times they are accessed.</li>
            </ol>

            <h1>More ...</h1>

            <p>PDFHummus services is powered by <a href="https://www.npmjs.com/package/hummus">HummusJS</a>, A NodeJS open source module for PDF generation and parsing. In turn it is dependent on the <a href="https://github.com/galkahana/PDF-Writer">PDFHummus C++ library</a> which has been around since 2011, serving many successful projects. </p>

        </div>
    </PublicBase>

}

export default About