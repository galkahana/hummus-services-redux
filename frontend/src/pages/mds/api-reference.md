# API Reference

To access PDFHummus service you will use a simple HTTP REST based protocol. For NodeJS and Browser Javascript we implemented libraries that you can use instead of making
the REST calls direclty.

You can find full reference for the calls that you can make here:
- [Browser](/documentation/api/browser)
- [NodeJS](/documentation/api/nodejs)
- [HTTP](/documentation/api/http)

All calls made to PDFHummus Services require the usage of keys. 
A Key can be either public or private.

A public key can be used in browser environment. Only a limited number of calls can be used if a public key is provided, all relating to the generation of a PDF file. 
Actions that are excluded are those in charge of managing jobs and files. You will have to use a private key in order for them to be allowed.

The separation between private and public keys allows you to create PDF files from browser code but still retain some level of safety regarding how your account can be used in case this key is used outside the scope
of your intended usage. You can avoid the issue altogather by not creating a public key and making calls only with a private key. *but you must not use a private key in browser code*.

Each account can create a single private key and a single public key. You can easily create, re-create and delete keys through your console. Once you have an account set up,  
head over to [the account page](/console/account) and select the **API Keys** tab. You will then be able to manage your API keys.
