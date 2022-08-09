# PDFHummus Services Documentation

Welcome To PDFHummus Services!

PDFHummus Services is a cloud based PDF Generation Service for your backend and frontend applications.

Use REST, NodeJS or your client Javascript code to send a job ticket to PDFHummus Services. A PDF file will be created on our servers, 
and your appliction can download it. As an alternative, it can provide a public download link to a 3rd party, for example sending this link in an email to a person.
PDFHummus services will provide the engines to create the PDF and the hosting capability. 

The PDF files remain hosted on our servers until you want them no longer, so you don't have to worry about storage as well.

You can also use backend code to manage jobs and files, for regular cleanups.

# Getting Started

Once you setup your account with PDFHummus services you can start creating PDFs by: 

1. Creating an API key. Create either a public key for browsers applications, or a private key for backend applications.
2. Determine API  
    1. **Client Javascript** - for browser applications. Can generate PDFs using the public key.
    2. **NodeJS** - for backend applications using PDFHummus Services NodeJS module. Can generate PDFs and manage generation jobs.
    3. **HTTP** - for backed applications where there's no existing module. Can generate PDFs and manage generation jobs.
3. Construct a job ticket JSON for your PDF
4. Where the applications is to create the PDF, plant the API call for generating the PDF.

For specific instructions for each platform go to [Getting Started](/documentation/getting-started).  
To setup an account with PDFHummus services, mail us at [join@pdfhummus.com](mailto:join@pdfhummus.com).

# PDF Features

PDFHummus Services  tickets supports many features of PDF creation . Mainly:

1. Generating PDFs from scratch.
2. Modifying existing documents by adding pages to them, or adding content to their existing pages.
3. Usign images - jpgs, tiffs, and embedded PDFs. Images can be transformed to fit or fill a define area.
4. Text - using True type, Open type or Type 1 fonts. Right to left and Left to right writing directions supported.
5. Shapes - add polygons, circles, rectangles.
6. Streams - combine text, shapes and images and flow them in a constrained area.  
7. Links - URL links can be placed on images and text
8. Encryption - You can create PDF files that require password entry to view or print, or edit.
9. Variable Information - You can provide a template document and data. This allows you to plan a document one time, and create many. 

To learn how to construct a Job ticket for generating PDFs with those features go to [Job Ticket](/documentation/job-ticket).