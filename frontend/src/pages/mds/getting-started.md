# Getting Started

Generating a PDF with the services requires:

- Building a job ticket, which is a plain JSON.
- Make API call to the service via REST or via a language specific libs with the job ticket.
- User other API calls to track the job progress and end. Specific libs may build on top of this and provide convenience methods for async callbacks for job end state.

## Build a job ticket 

The most basic job ticket contains a description of a document. Here is an example:

````
{
	"document": {
		"embedded": {
			"pages": [
				{
					"width": 595,
					"height": 842,
					"boxes": [
						{
							"bottom": 500,
							"left": 10,
							"text": {
								"text": "hello world!",
								"options": {
									"fontSource": "arial",
									"size": 40,
									"color": "pink"
								}
							}
						}
					]
				}
			]
		}
    }
}

````

The job ticket defines a document which description is embedded in the job ticket (it could refer a url, as an alternative).
The document has a single page of 595 points width and 842 points hight (point = 1/72 inch).
The single page has a single box which shows the text "hello world!" in pink, with the font arial at size 40pts.

You would normally pass this object to the service generation APIs as a string, and not an object, so you'll call `JSON.stringify(myObject)` in the case
that you build this as an object.

## Make API Calls 

You can always use REST to work with the services. We created specialized libs for browser based Javascript (client) and NodeJS. 

### Browser 

Create A PDF file directly in browser client code by following these steps:

1. Acquire a public api key. You can do this through users settings api keys tab - [here](/console/account).
2. In your web page include hummus client library by adding a script tag:
````
	<script type="text/javascript" src="{{siteUrlRoot}}/hummus/hummusservice.js"></script>
````
3. Where relevant make a call to hummusService.generatePDFDocument to generate the PDF file, like this:
````
hummusService.generatePDFDocument(                            
        '{{apiUrl}}'
        /* Your public key */,
        /* The ticket */,
        function(urlDownload,urlEmbed){
            /* success */
        },
        function(){
            /* error */
        });
````

Provide the public api key as the first parameter.     
Provide the job ticket string as the second parameter, and then a callback for success and one for failure.

The success callback accepts two parameters. 
urlDownload can be used for downloading the PDF file. 
urlEmbed can be used for opening the PDF in a window or embedding in a page.

### NodeJS 

Create A PDF file with NodeJS by following these steps:

1. Acquire a private api key. You can do this through users settings api keys tab - [here](/console/account).
2. Install `hummus-client` with:
````
npm install hummus-client
````
3. Create a hummus client instance with you private API token like this:
````
var hc = require('hummus-client')('/* your private key */');
````
4. Where relevant make a call to hc.jobs.createAndDownload:
````
hc.jobs.createAndDownload(/* The ticket */,function(err,readable) {
    if(err) {
        // handle error
    }
    else {
        // do something with the readable stream, containing the new pdf
        readable
            .on('response', function(response) {
                // use for getting general resonse data
            })
            .on('error', function(err) {
                // handle stream reading error
            })        
            .pipe(fs.createWriteStream(/* some file path */));
    }
});
````

Provide the ticket string as the first parameter. 
The second parameter is a callback to be executed when the job is finished

In the callback the first parameter is a general error object. The second parameters is a readable stream of the resulting PDF, 
allowing you to write the PDF result to wherever you want. In this example the readable stream is piped to a file stream.

Note that with the private key, and with the NodeJS client you can also manage jobs and file. For full API reference go to [NodeJS API](/documentaiton/api/nodejs).

### HTTP

You can create a PDF file from either client or server using REST calls to Hummus Services:

#### Acquire a key
First, acquire either a public or private API keys You can do this through users settings api keys tab - [here](/console/account).

#### Start a Job 
start a PDF creation job with the following REST call:    
- **METHOD**: POST
- **URL**: {{apiUrl}}/generation-jobs
- **HEADERS**:   
Authorization: Bearer /* The Private Key */    
Content-type: application/json; charset=utf-8
- **BODY**: /\* The Ticket \*/

The response body will contain the new job data. For example:  
````
{
    uid:"The Job ID"
    status:1
    /* other items of lesser importance */
}
````
The Job ID can be used to track this job later. Status of 1 marks that job is still in progress.

#### Track Job Progress
Check the job status on occasion with this REST call:

- **METHOD**: GET
- **URL**: {{apiUrl}}/generation-jobs/:id?full=true
- **HEADERS**:   
Authorization: Bearer /\* The Private Key \*/

For ":id" use the job ID that you recieved as response from the initial creation call.

The response body will contain the current job data. For example:
````
{
    uid:"The Job ID"
    status:0
    generatedFileObject : {
        uid: "The File ID", 
        publicDownloadId: "The Public Download ID"
    }
    /* other items of lesser importance */
}
````
Status can be either 1 (in progress), 2 (done) or 3 (error). If the status is 2, then an additional property is added - generatedFileObject. This object uid property is the file ID that can be used for downloading with another rest call. publicDownloadId, if exists can be used with public download url, that does not require a Bearer token.

#### Download ready PDF 

Finally, download the file with this REST call:

- **METHOD**: GET
- **URL**: {{apiUrl}}/generated-files/:id/download
- **HEADERS**:   
Authorization: Bearer /\* The Private Key \*/

For ":id" use the file ID that you recieved as response from the job status call.

The response would be the PDF content.

Alternatively, use the publicDownloadId with the public download URL like this:
````
{{apiUrl}}/public/:publicDownloadId
````
This form is useful if you want to send the PDF file as a download link to someone.