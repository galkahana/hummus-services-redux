/* eslint-disable no-unused-vars */
var hummusService = {

    /*
        generatePDFDocument - generate a PDF document on hummus services and callback when done with
        a download url.
        
        inServiceUrl - the service API url
        inAccessToken - a token to identify the user. either the publicAPI token, or a private API token.
        inJobTicket - a job ticket object defining the PDF
        [inSuccessCB] - success callback. function(downloadURL,embedURL){} where downloadURL is a download url for the file, and embedURL is for embedding
        [inFailureCB] - failure callback. function(response){} where response is the error response
    */

	generatePDFDocument:function(inServiceUrl, inAccessToken,inJobTicket,successCB,failureCB)
	{
        var accessToken = inAccessToken;
        
        
    
        // defaults        
		failureCB = failureCB || noOp;
		successCB = successCB || noOp;
        
		function openPDFWhenDone(inData,successCB,failureCB)
		{
			if(inData.status === 0)
			{
                var baseURL = inServiceUrl + 
                            '/public/' + 
                            encodeURIComponent(inData.generatedFileObject.publicDownloadId);
                successCB(baseURL + '/download',baseURL + '/embed',{generatedFileId:inData.generatedFileObject.uid});
			}
			else if(inData.status === 2 && failureCB)
			{
				failureCB(inData);
			}
			else
			{
				window.setTimeout(function()
				{
                    sendXHR({
                            url:inServiceUrl + '/generation-jobs/' + inData.uid + '?full=true',
                            headers: [['Authorization', 'Bearer ' + accessToken]]},
                            function(responseText){
                                openPDFWhenDone(JSON.parse(responseText),successCB,failureCB);
                            },
                            failureCB);
				},1000);
			}
		}

        function sendXHR(options,success,failure) {
            if(typeof options == 'string') {
                options = {url:options};
            }
            var xhr = new XMLHttpRequest();
            xhr.open(options.method || 'GET', options.url, options.async === undefined ? true:options.async);
            if(options.headers) {
                options.headers.forEach(function(el) {
                    xhr.setRequestHeader(el[0],el[1]);
                })
            }
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if(xhr.status < 400)
                        success(xhr.responseText);
                    else
                        failure({xhr:xhr});
                }
            }
            xhr.send(options.data);
        }
		
        sendXHR( {
                    method:'POST',
                    url:inServiceUrl + '/generation-jobs',
                    headers: [
                        ['Content-type','application/json; charset=utf-8'],
                        ['Authorization', 'Bearer ' + accessToken]
                    ],
                    data:JSON.stringify(forcePublic(((typeof inJobTicket == 'string') ? JSON.parse(inJobTicket):inJobTicket)))
                },
                function(responseText){
                    openPDFWhenDone(JSON.parse(responseText),successCB,failureCB);
                },
                failureCB);
	}
}

function noOp(){}

function forcePublic(ticket) {
    if(!ticket.meta) {
        ticket.meta = {}
    }

    ticket.meta.public = true

    return ticket
}