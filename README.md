Welcome to hummus services. A simple SAAS service over [hummus-reports](https://github.com/galkahana/hummus-reports), A layout engine using [hummus](https://github.com/galkahana/hummusjs) module to generate PDF files.

# Structure
There's `backend` folder for the server and `frontend` for the web app. 

The `backend` folder has the hummus server backend code, as well as several scripts, including ./scripts/delete-timedout-files which can be used as cronjob to occasionally delete files that were marked with expiration date.


TBD on `frontend`.

# Installing

make sure you got [nvm](https://github.com/nvm-sh/nvm) installed with node `16.15`.

## Installing the backend

1. `cd backend`
2. `npm install`

# Running

The following setup provides instructions for:
- being able to run the main hummus services server
- being able to run the scripts (e.g. deleting timedout files)

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

This should suffice for minimal running with jobs generation and downloads.

There are also additional variables required for specific functionality.

- For signup, you'll want the following
    - Signup functionality requires google recaptcha setup. use `RECAPTCHA_KEY` and `RECAPTCHA_SECRET` to provide the recaptcha credentials
    - Also for signup there's some email setup:
        - `SENDGRID_API_KEY` - is the sendgrid api key to allow sending keys
        - `ADMIN_EMAIL` and `JOIN_EMAIL` are from emails used by the service to send email to the service join email, and the service join email to the signed up user, telling that a user joined, and welcoming them, respectively. In the email to the user `SUPPORT_EMAIL` is used for letting the user know who to send email to for questions. `SERVICE_URL` is used as the root url of the service for providing urls in the email, to let user know where to got to to sign in to the site, and to read the online documentation.


## Running dev service

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

_you will notice that testing is missing. cause i don't. cause i don't have to. that's why. i got secret ways to make sure things work. very secret._
# Build a docker image

There's a dockerfile for building an image of the service.

Build:

```bash
docker build --label hummus --tag hummus:latest .
```

Run: 

```bash
docker run --env-file ./backend/.env -p 8080:8080  --name hummus  --detach hummus
```

# Installing on Minikube

You can install the service on minikube using the provided manifests in ./deployment/manifests/hummus and a docker image.

## Preparation
- You'll need to create your ./deployment/manifests/hummus/secret.yaml based on the secret values (same from .env) and the secret template in ./deployment/manifests/hummus/secret.yaml.tpl. The secrets refet to similarly named env vars, so use what values you'd use for regular running. what's not in there is in the configmap.yaml, which you can edit to your hearts content.

- Make sure you got a minikube instance install, and then run those few commands to adapt it to hummus:
    - `minikube addons enable ingress` to setup the ngynx ingress controller
    - `minikube addons enable metrics-servicer` to show up cpu and memory consumption in minikube dashboard
    - `minikube start --extra-config=kubelet.housekeeping-interval=10s` to start it off (faster housekeeping so CPU data is shown properly)

- Build a docker image using minikube docker deamon:
    ```bash
    eval $(minikube docker-env)
    ```
    and then run the docker build command to build the image, something like:
    ```bash
    docker build --label hummus --tag hummus:latest .
    ```

## Applying and using the result
- `kubectl apply -f XXXXX` to all the .yaml files, including the secret you prepared. should go by this order:
    - namespace.yaml
    - configmap.yaml, secret.yaml (don't run secret.yaml.tpl!)
    - serviceaccount.yaml
    - deployment.yaml, cronjob.yaml
    - service.yaml
    - ingress.yaml
    - (mongo-service.yaml is an example yaml for cases when you want to use "mongo" as service name and the mongo instance is on yr host. you probably dont need it.)
- go `minikube tunnel` to have the ingress setup available on yr 127.0.0.1
- add `hummus` to yr `/etc/hosts` as `127.0.0.1 hummus` so you can properly use the ingress host name, like this `curl http://hummus/api/health` 

Good. you should be ready now.
