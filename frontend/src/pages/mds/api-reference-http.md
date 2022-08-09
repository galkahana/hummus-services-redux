# REST API Reference

PDFHummus Services mainstream API can is implemented as a set of REST APIs. The API allows for generating PDF files based on 
a delivery of a job ticket, as well as managing the resulting jobs and files.

For example, generating a PDF goes through a REST call to create a job, followed by recurring calls to get the job and check its status.
Finally you can download the result PDF file throught a third RESt call. you can read about this cycle and the relevant REST calls in [Getting Started/REST](/documentation/getting-started/#rest).

Other than the public download REST calls, all calls require providing key (implemented as a bearer token). Some activities require a public key, and so are suitable
for both fronted and backed clients, and some require a private key and are suited for backend only. 
To create private and public keys go to the users settings page api keys tab - [here](/console/account). 

The following provides a reference to all calls available through REST API. The ones available for public usage or public key will be noted. All activities are good for usage with a private key.

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

### GET /generation-jobs/:id 

Get a job object by its ID.

- **METHOD**: GET
- **URL**: {{apiUrl}}/generation-jobs/:id?[full=true]
- **HEADERS**:   
Authorization: Bearer /\* The Private/Public Key \*/

For `:id` use the job ID.
Provide an extra `full=true` parameter if you want `generatedFile` to contain the file object, instead of just its ID.
The response body will contain the respective job object.

### POST /generation-jobs

Create a new Job.

- **METHOD**: POST
- **URL**: {{apiUrl}}/generation-jobs
- **HEADERS**:   
Authorization: Bearer /\* The Private/Public Key \*/    
Content-type: application/json; charset=utf-8
- **BODY**: /\* The Ticket \*/

The Job ticket described the PDF to be created. To learn about how it should look like read about the [Job Ticket](/documentation/job-ticket).
The response body will contain the new job object.

### GET /generation-jobs 

Get a list of jobs per query parameters. You can get all jobs for your user, or by search term looked for in their labels, or by dete rangeds, or simply query for a list of jobs by pointing their IDs.

- **METHOD**: GET
- **URL**: {{apiUrl}}/generation-jobs?full=true&&[searchTerm=string&dateRangeFrom=date&dateRangeTo=date&in=array]
- **HEADERS**:   
Authorization: Bearer /\* The Private Key \*/

You can optionally provide as query param:

- `searchTerm` - a partial string to look for in the jobs label. Jobs label is set by the job ticket that created them.
- `dataRangeFrom`, `dateRangeTo` - dates to get jobs that were either created or updated in this range. You can provide just one of them to get till or from only.
- `in` - array (use `in` multiple times) of ids to get their matching job objects.

The response body will have an array of job objects that are matching to the criteria.

### GET /generation-jb/:id

Get a single generation job by id. useful for inspecting its status and getting generated file data. The ID is the UID member you got on creation or search.

- **METHOD**: GET
- **URL**: {{apiUrl}}/generation-jobs/:id?full=true
- **HEADERS**:   
Authorization: Bearer /\* The Private Key \*/

### POST /generation-jobs/delete-jobs

Delete one or more jobs by their IDs.


- **METHOD**: POST
- **URL**: {{apiUrl}}/generation-jobs/delete-jobs
- **HEADERS**:   
Authorization: Bearer /\* The Private Key \*/    
Content-type: application/json; charset=utf-8
- **BODY**:   
        {
            items: [job ids]
        }  

The response body will contain `{ok:true}` on succseful completion.

### POST /generation-jobs/delete-files

Delete files for jobs (without deleting the job records themselves).


- **METHOD**: POST
- **URL**: {{apiUrl}}/generation-jobs/delete-files
- **HEADERS**:   
Authorization: Bearer /\* The Private Key \*/    
Content-type: application/json; charset=utf-8
- **BODY**:   
        {
            items: [job ids]
        }  

The response body will contain `{ok:true}` on succseful completion.


## Files management

Files are created as a result of creating a job and completing it succesfuly. The files objects in the PDFHummus services system represent hosted files that can be downloaded by end users.
It is useful to learn about activities around files to allow downloading them, as well as carrying out a cleanup every now and then to cut down hosting costs.

### The file Object

The file object has the following members:

- `uid` : File ID.
- `downloadTitle` : A string describing the file name. This is set by the job ticket `title` member.
- `publicDownloadId` : An ID that can be used to construct a download URL that you can share with a 3rd party (e.g. person) to downlaod this PDF file from. That URL would be : `{{apiUrl}}/public/:publicDownloadId` 

### GET /generated-files/:id 

Get a file object by its ID.

- **METHOD**: GET
- **URL**: {{apiUrl}}/generated-files/:id?[full=true]
- **HEADERS**:   
Authorization: Bearer /\* The Private/Public Key \*/

For `:id` use the file ID.
The response body will contain the respective file object.

### GET /generated-files

Get a list of files per query parameters. You can get all files for your user, or by dete rangeds, or simply query for a list of files by pointing their IDs.

- **METHOD**: GET
- **URL**: {{apiUrl}}/generated-files?[dateRangeFrom=date&dateRangeTo=date&in=array]
- **HEADERS**:   
Authorization: Bearer /\* The Private Key \*/

You can optionally provide as query param:

- `dataRangeFrom`, `dateRangeTo` - dates to get files that were either created or updated in this range. You can provide just one of them to get till or from only.
- `in` - array (use `in` multiple times) of ids to get their matching file objects.

The response body will have an array of file objects that are matching to the criteria.

### DELETE /generated-files/:id 

Delete a file object by its ID.

- **METHOD**: DELETE
- **URL**: {{apiUrl}}/generated-files/:id
- **HEADERS**:   
Authorization: Bearer /\* The Private \*/

For `:id` use the file ID.
The response will have status 204 on succesful delete.
The respective job object will now have `null` as the value of its `generatedFile` entry.

### GET /generated-files/:id/download

Get a PDF file matching the file object which id is provided. This call returns a PDF as an attachment content disposition where the file name is the PDF title.

- **METHOD**: GET
- **URL**: {{apiUrl}}/generated-files/:id/download
- **HEADERS**:   
Authorization: Bearer /\* The Private \*/

The return body will contain the PDF file. Note that this is a *private* method to download a PDF. This is meant to be used in scenarios where you only wish to use PDFHummus Services as a PDF generation engine, without
also using its public PDF hosting services. If you want a public download link, see below in **Public Links**.

### GET /generated-files/:id/embed

Get a PDF file matching the file object which id is provided. This call returns a PDF without content disposition header. This is suitable for scenarios where you don't want to download
the PDF but rather display it in an iframe on a page (for server usages this doesn't matter).

- **METHOD**: GET
- **URL**: {{apiUrl}}/generated-files/:id/embed
- **HEADERS**:   
Authorization: Bearer /\* The Private \*/

The return body will contain the PDF file. Note that this is a *private* method to download a PDF. This is meant to be used in scenarios where you only wish to use PDFHummus Services as a PDF generation engine, without
also using its public PDF hosting services. If you want a public embed link, see below in **Public Links**.

## Public download links

You may use PDFHummus services as a host for public downloads or embeding of the PDF files that you created. This way you can provide download links to your customers for their PDF without having to take care
of the hosting yourself. You can turn of this option for a particular job via the ticket for this job (by default it is on).
The following `GET` calls can be made *without* providing any key.

### GET /public/:publicDownloadId/download

Get a PDF file matching the public download ID provided as parameter. This call returns a PDF as an attachment content disposition where the file name is the PDF title.

- **METHOD**: GET
- **URL**: {{apiUrl}}/public/:publicDownloadId/download

The `publicDownloadId` is available as a member of the matching file object *and is NOT the file object ID*.
The return result is the PDF file matching this public ID.

### GET /public/:publicDownloadId/embed

Get a PDF file matching the public download ID provided as parameter. This call returns a PDF without content disposition header. This is suitable for scenarios where you don't want to download
the PDF but rather display it in an iframe on a page.

- **METHOD**: GET
- **URL**: {{apiUrl}}/public/:publicDownloadId/embed

The `publicDownloadId` is available as a member of the matching file object *and is NOT the file object ID*.
The return result is the PDF file matching this public ID.
