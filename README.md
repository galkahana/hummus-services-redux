Welcome to hummus services. A simple SAAS service over [hummus-reports](https://github.com/galkahana/hummus-reports), A layout engine using [hummus](https://github.com/galkahana/hummusjs) module to generate PDF files.

# Structure
There's `backend` folder for the server and `frontend` for the web app. backend runs frontend (yeah yeah CDN) and there's a main `Dockerfile` to create an image to run both.

# Installing

make sure you got [nvm](https://github.com/nvm-sh/nvm) installed with node `16.15`.

## Installing the backend

1. `cd backend`
2. `npm install`

# Preparing to run

## Pre-reqs

You will need:
1. Mongo instance to work with. it'll be the service db
2. AWS buckets which will serve for storing the generated files

For signup functionality (still to be implemented here) you will also need a google recaptcha account.
If you want emails to be triggered from the service, you'll also need a sendgrid account.

## Setting up the envs vars

You'll need the following env vars to run the service:
- `MONGODB_URI` - mongo db uri for where to store the site data.
- `JWT_KEY` - secret to use for creating the jwt tokens.
- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` - aws tokens with permissions to upload and download and list a target bucket which will contain all the generated files.
- Optionally define `AWS_BUCKET` as the target bucket name (by default it's `hummus-services`) and `AWS_REGION` which is the account region (by default it's `us-west-2`)
- Signup functionality requires google recaptcha setup. use `RECAPTCHA_KEY` and `RECAPTCHA_SECRET` to provide the recaptcha credentials
- Also for signup there's some email setup:
    - `SENDGRID_API_KEY` - is the sendgrid api key to allow sending keys
    - `ADMIN_EMAIL` and `JOIN_EMAIL` are from emails used by the service to send email to the service join email, and the service join email to the signed up user, telling that a user joined, and welcoming them, respectively. In the email to the user `SUPPORT_EMAIL` is used for letting the user know who to send email to for questions. `SERVICE_URL` is used as the root url of the service for providing urls in the email, to let user know where to got to to sign in to the site, and to read the online documentation.

Note that if you don't run signup process, you don't need all the signup related stuff.

# Running dev service

To run the service for dev purposes use `npm run dev`. You can also use the VSCode debug functionality. _watching_ is provided.

# Other verbs

- `npm run lint`: run eslint with automatic fixing
- `npm run check-tsc`: run typescript validation (without building)
- `npm run check`: combines lint and typescript validation to make sure you got everything right
- `npm run build`: build the resultant javascript dist folder used to actually run the service on production
- `npm run clean`: clean the dist folder
- `npm run dummy`: create an initial dummy user you can then use for demoing
- `npm run delete-timedout-files`: delete files for which their timeout setup expired. This is to be used as a cron job on the final service.
- `npm start`: run the site built in dist. so build it first with `npm run build`.

_you will notice the stark missing part! test. cause i don't. cause i don't have to. that's why. i got secret ways to make sure things work. very secret._
# Docker setup

There's a dockerfile for building an image of the service.

Build:

```bash
docker build --label hummus --tag hummus:latest .
```


Run: 

```bash
docker run --env-file ./backend/.env -p 8080:8080  --name hummus  --detach hummus
```