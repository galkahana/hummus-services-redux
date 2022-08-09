# NodeJS API Reference

`hummus-client` is a NodeJS module providing a simple API client for PDFHummus Services.  
The module provides the basic submit job - download ready PDF workflow, as well as the ability to manage jobs 
after the initial creation (including downloading files again, deleting, getting data etc.), and the ability to manage
created files.

The module is implemented as a simple layer on top of the service HTTP calls, so where lacking you can always call 
HTTP directly. To learn more about the HTTP calls read - [HTTP API reference](/documentation/api/http).

## Installing the module

Install `hummus-client` with:
````
npm install hummus-client
````

## Creating a client instance

To start working with the module you should create an instance of PDFHummus services client. You can do so like this:

````
var hc = require('hummus-client')('/* your private key */', '{{apiUrl}}');
````

As a parameter provide your private key. Note that while it is possible to work with the public key as well, it will limit
the range of operations that you can execute with the module.

As a result of this call `hc` will now contain an object with two members: `hc.jobs` is an object containing methods
for creating and managing PDF Generation jobs. `hc.files` is an object containing methods for managing hosted PDF files
that were created.

## Jobs management

To create a PDF file with PDFHummus services you create a job object. Once created you can check its status over time, and when the status
is done, this would mean the PDF file is created and you can download its based on the file ID (private or public, we'll get to that later).


### The job Object

The job object has the following members:

- `uid` : Job ID.
- `status` : Job status, 0 for done (good, has a PDF available). 1 for in progress. 2 for finished with failure.
- `label` : Job label. It is set by the job ticket meta.label member.
- `ticket`  : Job ticket string used to create this job.
- `generatedFile` : generated file object. It includes its ID as `uid` member. Using this ID you can access the file via the files management API. 

### `hc.jobs` methods

`hc.jobs` has the following methods:

#### get(jobID,cb)
Get job object.

**parameters**
- *jobID* - the job object ID
- *cb* - callback method of the signature `function(err,job)`, accepting error and job object.

#### create(jobTicket,cb)
Start a job. 

**parameters**
- *jobTicket* - Job ticket string. To learn about the job ticket look in [Job Ticket](/documentation/job-ticket).
- *cb* - callback method of the signature `function(err,job)`, accepting error and job object.It is possible that already at this point the job is already at finished state.

#### list(queryObject,cb)
Query for jobs. You can query by job ID, a job label search term or by date ranges.

**parameters**
- *queryObject* - query descriptor object. It may have one or more of the following members:
    - `in` : array of job IDs. To retrieve specific jobs via their IDs.
    - `searchTerm`: a string. To retrieve jobs that have this string as part of their label.
    - `dateRangeFrom`: a date. To retrieve jobs that were created or updated since this date.
    - `dateRangeTo`: a date. To retrieve jobs that were created or updated before this date. 
- *cb* - callback method of the signature `function(err,jobs)`, accepting error and jobs array.

#### delete(jobID[s], cb) 
Delete one or more jobs.

**parameters**
- *jobID[s]* - a job ID or an array with job IDs. 
- *cb* - callback method of the signature `function(err)`, accepting error.

#### createAndDownload(jobticket,cb)

Simple method for starting a job and waiting till it is finished.

**parameters**
- *jobticket* - job ticket string. 
- *cb* - callback method of the signature `function(err, readable)`, accepting error and a NodeJS readable stream.

You can use the returned readable stream to download the result file via pipe, Like this:

````
hc.jobs.createAndDownload(inJobTicket,function(err,readable) {
    if(err) {
        console.log('error',err);
    }
    else {
        readable
        .on('response', function(response) {
            console.log('status code:',response.statusCode)
            console.log('content type:',response.headers['content-type']) 
        })
        .on('error', function(err) {
            console.log('error',err);
        })        
        .pipe(fs.createWriteStream('./output/basicResult.pdf'));
    }
}); 
````

The method implementation creates the job, and then periodically gets the job object to check its status.
When done, starts a readable stream for the downloaded content. 

## Files management

Files are managed via `hc.files` object. You can use this API to download ready files or get their public download URLs, or clear storage place for old files.

### The file Object

The file object has the following members:

- `uid` : File ID.
- `downloadTitle` : A string describing the file name. This is set by the job ticket `title` member.
- `publicDownloadId` : An ID that can be used to construct a download URL that you can share with a 3rd party (e.g. person) to downlaod this PDF file from. That URL would be : `{{apiUrl}}/public/:publicDownloadId` 

### `hc.files` methods

`hc.files` has the following methods:

#### get(fileID,cb)
Get job object.

**parameters**
- *fileID* - the file object ID
- *cb* - callback method of the signature `function(err,file)`, accepting error and file object.

#### list(queryObject,cb)
Query for files. You can query by file ID or by date ranges.

**parameters**
- *queryObject* - query descriptor object. It may have one or more of the following members:
    - `in` : array of file IDs. To retrieve specific files via their IDs.
    - `dateRangeFrom`: a date. To retrieve files that were created or updated since this date.
    - `dateRangeTo`: a date. To retrieve files that were created or updated before this date. 
- *cb* - callback method of the signature `function(err,files)`, accepting error and files array.

#### delete(fileID, cb) 
Delete a file. Will set the referencing Job fie ID to null.

**parameters**
- *fileID* - a file ID to delete. 
- *cb* - callback method of the signature `function(err)`, accepting error.


#### download(fileID, cb)
Download a file. Note that this download method will work *even* if public downlaod is cancelled for this job (remember? you got a private key
for this). 

**parameters**
- *fileID* - a file ID to download. 
- *cb* - callback method of the signature `function(readable)`, accepting a NodeJS readable stream. You can use it to download the file via pipe.

