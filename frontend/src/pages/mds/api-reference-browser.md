
# Browser API Reference

PDFHummus Services allows you to generate PDF directly from the browser client code. 
Those can be simple invoices or any sample files that you wish to create based on the user client activity.
With this method  you can avoid using any server code in the implementation of creating PDF files. 
This feature makes it perfect for serverless enviornments such as Wix, tumblr or Wordpress.

While you can use REST calls directly to do the job, most of the times you can utilize the simple client library of PDFHummus Services. the client library provides
a simple call to generate a PDF file.


## Including the library

include the library by adding a script tag which source is `{{siteUrlRoot}}/hummus/hummusservice.js`, Like this:

````
 <script type="text/javascript" src="{{siteUrlRoot}}/hummus/hummusservice.js"></script>
 ````

## Using the library

The library creates a single object named `hummusService` that has a single method named `generatePDFDocument`.
`generatePDFDocument` generates a PDF document on hummus services and when done calls provided callbacks with the results.
It allows for the following arguments:

1. service url - the service url api root ({{apiUrl}} is a good choice, unless you got an independent setup).
2. key - your public key.
3. job ticket - a job ticket object or string defining the PDF that you wish to create. To learn about the job ticket look in [Job Ticket](/documentation/job-ticket).
4. [success callback] - success callback. optional. `function(downloadURL,embedURL){}` where downloadURL is a download url for the file, and embedURL is for embedding.
5. [failure callback] - failure callback. optional. `function(response){}` where response is the error response.

A call should look something like this:

````
hummusService.generatePDFDocument( 
    '{{apiUrl}}', // the service url                           
     /* Your public key */,
     /* The ticket */,
     function(urlDownload,urlEmbed){
         /* success */
     });
````

## Downloading and embedding the result PDF files

The success callback returns 2 urls, `urlDownload` and `urlEmbed`. Use the former for downloading scenarios. You can either use it in as a simple clickable link, to allow for manual download,
or plant code for automatic download. Something like this should do the trick:
````
<iframe width="1" height="1" frameborder="0" src="urlDownload"></iframe>
````
(Your javascript code should set this iframe `src` attribute to `urlDownload`).

The latter parameter, `urlEmbed`, can be used in an event that you want to show the result PDF in the HTML page itself. In this case the following code should do the trick:
````
<object data="urlEmbed" type="application/pdf">
    This browser does not support PDF preview. <a href="urlDownload">download</a> 
</object>
````
(Your javascript code should out this, after replacing `urlEmbed` and `urlDownload` with the callback result, a an `innerHTML` of some div once you get the callback).

Note that some browsers don't support the native viewing of PDF files, which is why there's the `a` element there with the download URL.