# Job ticket reference

The job ticket is the key element of PDFHummus services. It describes how the PDF should look like, how it should be named, and some management data.

The job ticket is a javascript object. This entry will describe its root elements, and provide pointers to other sub-elements. 

# Job ticket root

A general schema of a job ticket looks like this:

````
{
    [externals] : /* object containing external links */,
    [title]: /* file title */
    [meta]: /* job metadata */,
    document: /* PDF document description or a template description */,    
    [variableData]: /* variable data to be combined with template description */,
}
````

All elements but `document`, describing the document to create, are optional. The following entries describe each element.


## externals

The optional `externals` element provides information about all the external references in the document. If you want to use a font or an image, you will have to add a reference
to it here. 

The structure of `externals` is relatively simple. It is a key value dictionary where the key is a label and the value is a url. The label should be used in the document 
when you wish to refer to the element referred by the url. For example: 

````
"externals": {
		"gaLogo": "{{siteUrlRoot}}/images/profileImage.jpg"
	}
````

This structure contains a single referenced image, calling it `gaLogo`.

For type 1 fonts it is normally the right thing to provide both pfm and pfb files. In this case you can provide an array of two urls as the value, instead of a single url string.

For the quick thinkers in the crowd - yeah keeping it small is a good idea if you want your files to be completed quickly.

## title

`title`'s value is a string which is the PDF file name that you want to use, for example `"title" : "myfile.pdf"`. You can drop the title if you don't care about the end result pdf title, or don't intend
to provide it for download via PDFHummus services.

 ## meta

`meta` is an optional object containing some job generation options:

````
"meta" : {
    "private": true/false,
    "label": "some label",
    "deleteFileAfter": time in milliseconds
}
```` 

The `private` key should be used in the case that you **dont** want the file to be available for public download. In this case a public download key will not be created
and you will not be able to send the public download url to a 3rd party. It's a good option to use if you don't need this feature, keeping your PDFs safe and private. By default, the value is `false`.

The `label` key is useful for defining a label which can be searched by via the API or the console management search bar. Provide a description of the job, or just the date it was created on, so it is easy to look it up.

`deleteFileAfter` is a mechanism for saving your used disk space. If you want to have the file deleted some time after its 
creation, you can use this parameter with the number of milliseconds after which you want the file to be deleted.

## document

The `document` element is the most important of the keys, and is the only required one. The value of `document` is a description of the PDF file to create - it's pages, and their content.

`document` may contain an embedded document description. As an alternative it will have a reference to a remote document description. The former
option is good for a one time product of a tailored document. The latter option is good in case when you are using a template document with the variable data feature. In this case
the document is actualy a template and is therefore reusable and as such there's a point to save a library of these and refer to them on demand.

If you wish to use an embedded document the `document` element should have a single entry named `embedded` which value is either a string or an object describing the document.
If you wish to use a document reference, the `document` element should have a single entry named `referenced` which value is a string.
This string is a key matching a url in the `externals` table refering to the document description.

As for the document itself it can be a JSON string or an object. In either case it is a document description which will be rendered upon.
You can read more about the document object contents in [The document object](/documentation/job-ticket/document).

There's a slight change of things if you are using the *variable data* feature, more on that in the next entry.


## variableData

Being a javascript object, you can build the document programmatically very easily to fit different scenarios and templates.
Still, in some cases it will be more convenient for you to provide a template + data combination to PDFHummus Services and let it compute
the document object itself.

A possible method to do so is that the document is not really a JSON or a javascript object. Rather it will be a [mustache](https://mustache.github.io/) template string. 
In this case you will also provide a `variableData` entry to the job ticket object, complementing the template. Togather they are expected to generate a JSON string that is a document.  
In the case that you are using template, using the reference option for the `document` may make sense.

The creation of the document uses `Mustache.render` method where the `document` value comes as the template, and the view is the value of `variableData` (see [here](https://github.com/janl/mustache.js/#usage) for more).


# Next

The most interesting part of the jobticket is the document itself, normally provided via `document.embedded`. To learn about its structure go to [The document object](/documentation/job-ticket/document).