Welcome to hummus services. A simple SAAS service over [hummus-reports](https://github.com/galkahana/hummus-reports), A layout engine using [hummus](https://github.com/galkahana/hummusjs) module to generate PDF files.

The server API allows to generate PDF jobs and later download the resultant files. All with api tokens. There's also job management, accounting information and other useful stuff.

# Structure
There's `backend` folder for the server and `frontend` for the web app. 

The `backend` folder has the hummus server backend code, as well as several scripts, including ./scripts/delete-timedout-files which is used as a cronjob to occasionally delete files that were marked with expiration date.


`frontend` is a react application (created with create-react-app) implementing a console application for users to test jobs, review job history and their account details.

# Installing

make sure you got [nvm](https://github.com/nvm-sh/nvm) installed with node `16.15`.

## Installing the backend

1. `cd backend`
2. `npm install`

## Installing the frontend

1. `cd frontend`
2. `npm install`

# Running the backend

The following setup provides instructions for:
- being able to run the main hummus services server
- being able to run the scripts (e.g. deleting timedout files)

To run also the frontend side from the backend see below under **Runnning the frontend**

## Pre-reqs

You will need:
1. Mongo instance to work with. it'll be the service db
2. AWS buckets which will serve for storing the generated files

For signup and signin functionality you will also need a google recaptcha account (though you cant turn it off).
If you want emails to be triggered from the service when a user signs up, you'll also need a sendgrid account.

## Setting up the envs vars

You'll need the following env vars to run the service:
- `MONGODB_URI` - mongo db uri for where to store the site data.
- `JWT_KEY` - secret to use for creating the jwt tokens.
- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` - aws tokens with permissions to upload and download and list a target bucket which will contain all the generated files.
- Optionally define `AWS_BUCKET` as the target bucket name (by default it's `hummus-services`) and `AWS_REGION` which is the account region (by default it's `us-west-2`)

This should suffice for minimal running with jobs generation and downloads.

There are also additional variables required for specific functionality.

For login and signup you'll need to provide google recaptcha credentials. Use `RECAPTCHA_KEY` and `RECAPTCHA_SECRET`. Note that this will render direct api calls to the relevant apis of login and signup disfunctional and only UI operation will be available (cause you need to do the captcha). If you want to avoid captcha, especially while developing, then adding an env var named `NO_RECAPTCHA` with the value of `true` should disable it and neither the client will show it, or the backend require it.


For signup there's some email setup, so the server greets newcommers and lets the admin know someone joined:
    - `SENDGRID_API_KEY` - is the sendgrid api key to allow sending keys
    - `ADMIN_EMAIL` and `JOIN_EMAIL` are from emails used by the service to send email to the service join email, and the service join email to the signed up user, telling that a user joined, and welcoming them, respectively. In the email to the user `SUPPORT_EMAIL` is used for letting the user know who to send email to for questions. `SERVICE_URL` is used as the root url of the service for providing urls in the email, to let user know where to got to to sign in to the site, and to read the online documentation.



## Running dev service

To run the service for dev purposes use `npm run dev`. You can also use the VSCode debug functionality. _watching_ is provided.

# Other verbs on the backend

- `npm run lint`: run eslint with automatic fixing
- `npm run check-tsc`: run typescript validation (without building)
- `npm run check`: combines lint and typescript validation to make sure you got everything right
- `npm run build`: build the resultant javascript dist folder used to actually run the service on production
- `npm run clean`: clean the dist folder
- `npm run dummy`: create an initial dummy user you can then use for demoing
- `npm run delete-timedout-files`: delete files for which their timeout setup expired. This is to be used as a cron job on the final service.
- `npm start`: run the site built in dist. so build it first with `npm run build`.

_you will notice that testing is missing. cause i don't. cause i don't have to. that's why. i got secret ways to make sure things work. very secret._


# Making API calls

There's an available postman collection that you can use to familiarise yourself with the server api and run calls to the server [here](https://www.postman.com/collections/6e41a7902cad96913af2).

The collection relies on some variables that you can define in your local postman env to get it going:
- `hummus_server_url` - the server url. if running locally that's be `http://localhost:8080`. When running the below minikube setup and using its ingress, `http://hummus` is the right way to go.
- `hummus_usename` and `hummus_password` are the login credentials for a user who's on behalf you'd be making api calls. It is useful to run `npm run dummy` to create a dummy user, and then you can use their credentials: `a.a@hotmail.com` and `test`, respectively.

Make sure to call `sign in` which will get you tokens, and on occasion go `refresh token` to get a fresh one. The apis' will ask for authentication when it's not fresh, so you'll know when. After you generated a job with `generate job`, use `get job` to retrieve job data and in that file download info that you can later use to download the file. The collection holds tests scripts to keep json output data feeding later apis, which should give you a nice XP when going through them one by one.

# Running the frontend

The frontend folder contains the frontend site for hummus services. 
There are several methods of running the frontend in the dev environment:
- As an independent app making api calls to the backend server
- As served content from the backend


You would normally choose the first option when working on developing the frontend, and the latter option only to make sure the it works when served...which is how it will be in its final built form.

To run as an independent app:

```bash
cd frontend
npm start
```

This will launch the react app on http://localhost:3000.  
You can also debug the code from VSCode after this is done, if you are interested, by choosing the "Debug frontend (after npm start)" option.
There's more options available with the react app, and they are all in the generated create react app documentation [here](./frontend/docs/create-react-app.md).

To be able to run the content from the backend, do the following:
```bash
cd frontend
npm run build-on-backend
```
This will build the frontend and copy it to a destination on the backend folder which will allow its serving via the root of the url. For example, if running the backend via dev, use http://localhost:8080 from the browser to view the UI.

Note that you can also view the built content running independently via the frontend with:
```bash
cd frontend
npm run build
npx serve -s build
```
(this uses the "serve" program installed as dev dependency in the frontend folder).

## Env vars on client
There's no env vars that you need to define on the client code. Nothing. 
So this section is about what you may see and interpret as env vars and how client side configuration is achieved anyways.

The frontend project defines a single env var in either it's `.env` or `.env.development` files and it is `REACT_APP_API_URL`. It's intended to allow the frontend to work with the backend while devleoping. so in `.env.development` it's value is `"http://127.0.0.1:8080"`, pointing to your backend service, and in `.env` it's set to `""` cause the frontend is served from backend and so they share the url.

That's it.
Any other configuration is provided by the `index.html` page including a `config.js` script which is rendered (as a mustache rendering engine view) on the server side providing what configuration is necessary. Note that anything you put in here is visible to anyone...so don't expose here what shouldn't be exposed.

Doing the env vars injection this way for the client code, as opposed to requiring actual env vars allows building a docker image for the whole server without build vars, which were otherwise required while building the frontend part. So it's the same image for all environments, and you only need to provide env vars for running it. makes it easy to reuse it.

# Build a docker image

There's a dockerfile for building an image of the service. The image include both backend api and frontend, where the frontend is served via the root api urls (http://example.com) and the backend api is served via an api prefix - (http://example.com/api).

Build:

```bash
docker build --label hummus --tag hummus:latest .
```

Run: 

```bash
docker run --env-file ./backend/.env -p 8080:8080  --name hummus  --detach hummus
```

# Installing on Minikube (or...a k8s cluster)

[Minikube](https://minikube.sigs.k8s.io/docs/) is an tool to run k8s clusters on your home computer. It can serve as an actual method to run stuff, or a preparation method to test matters prior to load stuff to the cloud. Placing hummus in a k8s cluster allows both running the server and running any cronjob internally in there. With a simple deployment method i can easily recreate this setup anywhere i can put a minikube on. cool.

There's two methods to install hummus on minikube provided here (or any cluster for that matter...though you might need to edit stuff a bit...it is aimed at running locally and is very basic on permissions and such...and no certmgr):
- installing with manifests. This provides the basic installation of hummus server and a cronjob for deleting old files
- installing with helm, which is faster than going through applying one manifest after the other + includes basic logging with EFK and metrics with prometheus and grafana (very basic...i did some more effort on the logging, with some fluentd adaptation to fit this scenario...and there's historgram api duration spewing for prometheus...but that's it..it was mostly about being able to do it...plus im quite happy with what i managed to get on logging. but might be basic to others though.).

You'll probably want to use the helm method. It's easier and provides a fairly good centralized logging mechanism. I'll describe installing with both methods below, after a bit of common steps.

## Minikube setup

Here's some setup instructions for minikube to get the most of hummus

Addons:
    - `minikube addons enable ingress` to setup the ngynx ingress controller for hummus ingress (and kibana and grafana for logging and metrics for the helm setup)
    - `minikube addons enable metrics-server` to show up cpu and memory consumption in minikube dashboard
If you will be wanting to use the centralized logging capability then to have elasticsearch functioning properly there's two more addons:
    - `minikube addons enable default-storageclass`
    - `minikube addons enable storage-provisioner`

Also for elasticsearch you'll want to make sure there's sufficient memory and CPU for your minikube instance. 4 cpus and 8gbs is what's normally recommended. So prior to starting minikube go:
    - `minikube config set memory 8192`
    - `minikube config set cpus 4`
(they can also be provided on the first `minikube start` as `minikube start --memory 8192 --cpus 4` with some drivers allowing you to do so also post the first start).

Either with or without elastic search it is recommended to speed up kubelet housekeeping so CPU tracking in the minikube dashbaord works properly. So start minikube with:
`minikube start --extra-config=kubelet.housekeeping-interval=10s`.

## Building docker image and pushing to minikube

Easiest way to make a docker image available to minikube (other than making it available online of course) is to build it within the minikube docker context, like this:
```bash
eval $(minikube docker-env)
docker build --label hummus --tag hummus:latest .
```

you can use a different tag or add another tag...and then make sure to update the setup files (manifests or helm) as they currently point to latest...which is obviously not the best method when deploying to the cloud...but serves local development well enough.

## Deployment

From here the instructions differ a bit if you are looking to use the helm method or install the manifests individually.
We'll start with manifests and then helm.

oh. one thing. when looking to use yr computers mongo instance, use `host.minikube.internal` instead of `localhost`. So the pods won't search for mongo in their own container but rather on the host.

### Installing with manifests

The ./deployment/manifests/hummus folder holds manifest files to allow you to install hummus api server and a cronjob to delete old files. You will need to create a secret file with some of the env vars in ./deployment/manifests/hummus/secret.yaml, and you can use ./deployment/manifests/hummus/secret.yaml.tpl to figure out the formats. The values are following the env vars which are expected to be "Secret" on a "real" implementation. you can edit the configmap in ./deployment/manifests/hummus/configmap.yaml for the rest of them. both cronjob and the api server deployment share them...so no need to repeat for each. Note that both assume the latest tag on hummus image and that it's local, so update if you got it in some other place.


Then it's just a matter of repeated `kubectl apply -f XXXXX`. For best results do it in this order:
    - namespace.yaml
    - configmap.yaml, secret.yaml (don't run secret.yaml.tpl!)
    - serviceaccount.yaml
    - deployment.yaml, cronjob.yaml
    - service.yaml
    - ingress.yaml
    - (mongo-service.yaml is an example yaml for cases when you want to use "mongo" as service name and the mongo instance is on yr host. you probably dont need it.)
The setup will be created wholly in the `hummus` namespace.

you can track the deployment with the minikube dashboard (`minikube dashboard`) or via kubectl.
to access the service go port forwarding...or go ingress, in which case:
- go `minikube tunnel` to allow ingress calls into minikube to happen on yr 127.0.0.1.
- edit yr hosts file (`/etc/hosts` on unixlikes) and add `127.0.0.1 hummus`

Now `curl http://hummus/api/health` should provide you with a friendly message.
When using the postman collection, make sure to change the `hummus_server_url` value to `http://hummus`.

And yeah, the UI should be available via `http://hummus` in yr browser.


### Installing with helm

helm charts make it really simple to pack your installation and install with a single command. plus there's all these available charts to just install alongside, it makes one wants more. So with this helm chart setup for hummus sitting in ./deployments/helm i also threw in logging with EFK (elasticsearch, fluentd and kibana) as well as metrics (prometheus and grafana) using the absolutely most basic setup on those additionals other than some tweaking on fluentd to get the json logs coming out from hummus to translate to proper attributes.

What you are left to do with is just install it. Go to ./deployments/helm and create a `values.yaml` file for your env vars values (and some more). You can follow the template provided in `values.yaml.sample`. 

Then just:

```bash
helm install hummus-local hummus -n hummus-helm --create-namespace  -f ./values.yaml
```

This will create a namespace named hummus-helm and will install everything there. The helm release name is hummus-local in this example.

you can track the deployment with the minikube dashboard (`minikube dashboard`) or via kubectl.
to access the service go port forwarding...or go ingress, in which case:
- go `minikube tunnel` to allow ingress calls into minikube to happen on yr 127.0.0.1.
- edit yr hosts file (`/etc/hosts` on unixlikes) and add `127.0.0.1 hummus`

Now `curl http://hummus/api/health` should provide you with a friendly message.
When using the postman collection, make sure to change the `hummus_server_url` value to `http://hummus`.
And yeah, the UI should be available via `http://hummus` in yr browser.

Now, if you are looking to use logging and/or metrics you will want to also expose kibana (for logging) and grafana (for metrics). actually prometheus is also exposed via ingress by default. So edit your hosts file to also include them. So in total:

```
# Gal: for my minikube app
127.0.0.1 hummus
127.0.0.1 prometheus
127.0.0.1 grafana
127.0.0.1 kibana
```

Turning on logging is done by including the following section in your values.yaml file (or other method of setting values when installing):
```
logging:
  enabled: true
```

With this in place the EFK elements will be installed with mostly default settings, but fluentd which configuration is adapted to properly read json logs of hummus, and provide a meaningful logs to elasticsearch.
To be able to view hummus logs in kibana (which if ingress is setup should be with `http://kibana`), do the following:
- login to kibana
- go to Stack management->Index management using the upper left menu and make sure "fluetnd" is there. there? good.
- go back to Stack management, and then into Index patterns. Create a new index pattern to be based on fluetnd (fluentd* is a good name)


When logging into kibana (which if ingress is setup should be with `http://kibana`), create a fluentd* index. The time field is `time`. Now you can go into discover and you will see the logs. filter by `kubernetes.labels.app_kubernetes_io/name` is `hummus` to filter only the hummus (and hummus cron job) messages. useful columns are: Time, message, resource (for the api handler) and `kubernetes.labels.app_kubernetes_io/name`. 
Good luck.


You can turn on the basic prometheus/grafana setup with:
```
metrics:
  enabled: true
```

With ingress you can now access `http://grafana` or `http://prometheus` and check out p95 stats for the api calls (For example) with the following query:
```
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[30m])) by (le, service, route, method))
```
(the p95 quantile of http_request_duration_seconds metric for the past 30 minutes, showing measure service, route (handler) and method)
