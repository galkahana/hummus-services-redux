Welcome to hummus services. A simple SAAS over [hummus-reports](https://github.com/galkahana/hummus-reports), A layout engine using [hummus](https://github.com/galkahana/hummusjs) module to generate PDF files.

Through the server API you can create PDF generation jobs and later download the resultant files. All with api tokens. There's also job management, accounting information and other useful stuff.

The project repo includes the backend code, frontend code and k8s deployment code via helm charts or regular manifests.

And if i didn't take it down yet there's a live demo at [https://services.pdfhummus.com](https://services.pdfhummus.com).

**Table of Contents**
- [Structure](#structure)
- [Installing](#installing)
  * [Installing the backend](#installing-the-backend)
  * [Installing the frontend](#installing-the-frontend)
- [Running the backend](#running-the-backend)
  * [Pre-reqs](#pre-reqs)
  * [Setting up the envs vars](#setting-up-the-envs-vars)
  * [Running dev service](#running-dev-service)
- [Other verbs on the backend](#other-verbs-on-the-backend)
- [Making API calls](#making-api-calls)
- [Running the frontend](#running-the-frontend)
  * [Env vars on client](#env-vars-on-client)
- [Build a docker image](#build-a-docker-image)
  * [Building locally](#building-locally)
  * [Github action](#github-action)
- [Deployment](#deployment)
  * [Deploying to k8s, starting with Minikube](#deploying-to-k8s--starting-with-minikube)
    + [Minikube setup](#minikube-setup)
    + [Building a docker image and pushing it to minikube](#building-a-docker-image-and-pushing-it-to-minikube)
    + [Deploying on minikube](#deploying-on-minikube)
    + [Manifests](#manifests)
    + [Helm](#helm)
  * [Deploying on GKE](#deploying-on-gke)
    + [An initial setup](#an-initial-setup)
    + [Adding ingress](#adding-ingress)
  * [Serving Backend and Frontend Separately](#serving-backend-and-frontend-separately)
    + [Setting up backend for separate serving](#setting-up-backend-for-separate-serving)
    + [Setting up frontend for separate serving](#setting-up-frontend-for-separate-serving)

# Structure
There's `backend` folder for the server and `frontend` for the web app. 

The `backend` folder has the hummus server backend code, as well as several scripts, including ./scripts/delete-timedout-files which is used as a cronjob to occasionally delete files that were marked with expiration date.


`frontend` is a react application (created with create-react-app and then converted to NextJS) implementing a console application for users to test jobs, review job history and their account details, as well as serving documentation. This frontend can either be served from the backned server or separately as a static site.

`deployment` holds either `manifests` or `helm` for either deployment methods. 

# Installing

make sure you got [nvm](https://github.com/nvm-sh/nvm) installed with node `16.20`.

## Installing the backend

1. `cd backend`
2. `npm install`

## Installing the frontend

1. `cd frontend`
2. `npm install`

# Running the backend

The following setup provides instructions for:
- being able to run the main hummus services server
- being able to run the scripts (e.g. deleting timed-out files)

To run also the frontend side from the backend see below under **Running the frontend**

## Pre-reqs

You will need:
1. Mongo instance to work with. it'll be the service db
2. AWS buckets which will serve for storing the generated files

For sign-up and sign-in functionality you will also need a google recaptcha account (though you can turn it off).
If you want emails to be triggered from the service when a user signs up, you'll also need a sendgrid account.

## Setting up the envs vars

You'll need the following env vars to run the service:
- `MONGODB_URI` - mongo db URI for where to store the site data.
- `JWT_KEY` - secret to use for creating the jwt tokens.
- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` - aws tokens with permissions to upload and download and list a target bucket which will contain all the generated files.
- Optionally define `AWS_BUCKET` as the target bucket name (by default it's `hummus-services`) and `AWS_REGION` which is the account region (by default it's `us-west-2`)

This should suffice for minimal running with jobs generation and downloads.

There are also additional variables required for specific functionality.

For login and signup you'll need to provide google recaptcha credentials. Use `RECAPTCHA_KEY` and `RECAPTCHA_SECRET`. Note that this will render direct api calls to the relevant apis of login and signup dysfunctional and only UI operation will be available (cause you need to do the captcha). If you want to avoid captcha, especially while developing, then adding an env var named `NO_RECAPTCHA` with the value of `true` should disable it and neither the client will show it, or the backend require it.


For signup there's some email setup, so the server greets newcomers and lets the admin know someone joined:
    - `SENDGRID_API_KEY` - is the sendgrid api key to allow sending keys
    - `ADMIN_EMAIL` and `JOIN_EMAIL` are from emails used by the service to send email to the service join email, and the service join email to the signed up user, telling that a user joined, and welcoming them, respectively. In the email to the user `SUPPORT_EMAIL` is used for letting the user know who to send email to for questions. `SERVICE_URL` is used as the root url of the service for providing urls in the email, to let user know where to got to to sign in to the site, and to read the online documentation.


One last thing. You may want to restrict the usage of the site tokens, which among other things can be used to generate pdfs, to be just used in the site. A simple domain restriction implementation exists. You may want to use it when going online. `TOKEN_SERVICE_DOMAINS` is a comma separated list of hosts (include the port!) to restrict the site token to. It's multiple so you can test it locally where some urls are per the dev frontend (localhost:3000, if you stick to the default) and some are of the backend (127.0.0.1:8080, again if you stick to the default).

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


# Making API calls

There's an available postman collection that you can use to familiarize yourself with the server api and run calls to the server [here](./etc/postman/backend-api.postman_collection.json).

The collection relies on some variables that you can define in your local postman env to get it going:
- `hummus_server_url` - the server url. if running locally that's be `http://localhost:8080`. When running the below minikube setup and using its ingress, `http://hummus` is the right way to go.
- `hummus_username` and `hummus_password` are the login credentials for a user who's on behalf you'd be making api calls. It is useful to run `npm run dummy` to create a dummy user, and then you can use its username and password to login: `a.a@hotmail.com` and `test` respectively.

Make sure to call `sign in` which will get you tokens, and on occasion go `refresh token` to get a fresh one. The apis' will ask for authentication when it's not fresh, so you'll know when. After you generated a job with `generate job`, use `get job` to retrieve job data and in that file download info that you can later use to download the file. The collection holds tests scripts to keep json output data feeding later apis, which should give you a nice XP when going through them one by one.

# Running the frontend

The frontend folder contains the frontend site for hummus services. 
You can run the frontend either via the server or independently.
The frontend site is now based on NextJS, and even though such apps may be served from a node server, it should be possible to also run it as a static site with some minimal support of redirect rules (urls are folders that should redirect to their respective index.html, and there's a 404 page if you want it).

When developing you can run the frontend dev server like this:

```bash
cd frontend
npm run dev
```

This will launch the react app on http://localhost:3000.  
You can also debug the code from VSCode after this is done, if you are interested, by choosing the "Debug frontend (after npm run dev)" option.
There's more options available with the next app, and you can read about them up in next site.

To be able to serve the content from the backend, do the following:
```bash
cd frontend
npm run build-on-backend
```
This will build the frontend ready to be served by the server and copy it to a destination on the backend folder which will allow its serving via the root of the url. For example, if running the backend via dev, use http://localhost:8080 from the browser to view the UI.

Note that you can also view the built content in its static form running independently via the frontend with:
```bash
cd frontend
NEXT_PUBLIC_API_URL="http://127.0.0.1:8080" npm run build
npx http-server out -p 3000
```

The `npm run build` command, with the provided env var override, will create a static site from the app in the `out` folder, and later http-server (a dev dependency of this repo) is used to serve the site on port 3000. You should be able to visit this on http://localhost:3000.

(note: originally i used `serve` utility to serve the site however it does not agree with the static nextjs setup and navigation was faulty, moving to the index.html file when intending to go to other links, so switched to `http-server` which behaves better).

## Env vars on client and special configuration
The frontend app build is controlled by a small number of env vars that can be used to create a slightly different behavior.
The default behavior of the app is set up by the .env and .env.development files in the frontend root. You can add .env.local with your own configuration to modify the local behvior prior to making it an official policy. 

Here's a list of the available configuration vars:
- `NEXT_PUBLIC_API_URL` - The backend url to use as base for API calls. When developing locally this would be `"http://127.0.0.1:8080"`, which per the definition on `.env.development` is what's going to be on when running `npm run dev`. When building, unless you override this value, the end result site will assume that the api url is the same as the site url, and the value would be `""`. You can absolutely customize this value, to match where you'll end up running the server from in relation to the frontend site.
- `NEXT_PUBLIC_NO_BACKEND`, `NEXT_PUBLIC_NO_BACKEND_PROJECT_URL` - Those env vars allow one to create a frontend site build that will NOT access the backend. This is useful for when i'm not wishing to pay for the backend run, but still want the documentation part of the site running (i mean the whole site...but the documentaiton is part of it). It will display a useful message pointing to the github repo for more instructions, when not being able to access the server. End result is that the site can be ran with no backend, still serving documentaiton, context, about n such...and providing useful info for what required the server. cool.

To deal with configuration variances between environment when running the docker image, the current policy is to move the problem to runtime, and having the config info provided via a config query to the server as the site loads. see usage and definition of of `useConfig` to utilize per your requirements.

# Build a docker image

The default docker image build creates a server that handles both the backend and serving the frontend site. If you want to bulid a server that ONLY serves the backend provide a `FRONTEND_BUILDER_SOURCE` build arg with the value of `none` (`--build-arg FRONTEND_BUILDER_SOURCE=none`).

## Building locally

There's a dockerfile for building an image of the service. The image include both backend api and frontend, where the frontend is served via the root api urls (http://example.com) and the backend api is served via an api prefix - (http://example.com/api).

Build:

```bash
docker build --label hummus --tag hummus:latest .
```

Run: 

```bash
docker run --env-file ./backend/.env -p 8080:8080  --name hummus  --detach hummus
```

## Github action

If you look at the project you can see a [github action](./github/workflows/docker-image.yml) definition to build images on pushing tags starting with `v`.
Point is to create && push a version tags (e.g. v1.0.3), and this will generate a new image and push it to github packages registry. This means that:
1. There's image available, see "Packages" for what's on
2. You can use this to build yr own images when forking

Also - there's a commented out part there that will provide arm64 builds. You'll need that to run the images on your New macs. But it make a build of 3.5mts take an hour. There's some issues reported about this in the push github action...hopefully it'll resolve sometime.

# Deployment

The "deployment" folder of the project includes code that allows you to deploy the project to a Kubernetes cluster. You're asking, why bother? well i already got a server here, and a cron job...and it's might nice to be able to just ship it a is.
Started with manifests, then moved to using helm, and you can choose.

There's instructions for minikube and gke below.

## Deploying to k8s, starting with Minikube

[Minikube](https://minikube.sigs.k8s.io/docs/) is k8s cluster you can run on your home computer. It can serve as an actual method to run stuff, or a preparation method to test matters prior to load stuff to the cloud. Placing hummus in a k8s cluster allows both running the server and running any cronjob internally in there. With a simple deployment method i can easily recreate this setup anywhere i can put a minikube on. cool.

There's two methods to install hummus on minikube provided here (or any cluster for that matter...though you might need to edit stuff a bit...it is aimed at running locally and is very basic on permissions and such...and no certmgr):
- installing with manifests. This provides the basic installation of hummus server and a cronjob for deleting old files
- installing with helm, which is faster than going through applying one manifest after the other + includes basic logging with EFK and metrics with prometheus and grafana (very basic...i did some more effort on the logging, with some fluentd adaptation to fit this scenario...and there's historgram api duration spewing for prometheus...but that's it..it was mostly about being able to do it...plus im quite happy with what i managed to get on logging. but might be basic to others though.).

You'll probably want to use the helm method. It's easier and provides a fairly good centralized logging mechanism. I'll describe installing with both methods below, after a bit of common steps.

### Minikube setup

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

Either with or without elastic search it is recommended to speed up kubelet housekeeping so CPU tracking in the minikube dashboard works properly. So start minikube with:
`minikube start --extra-config=kubelet.housekeeping-interval=10s`.

### Building a docker image and pushing it to minikube

Easiest way to make a docker image available to minikube (other than making it available online of course) is to build it within the minikube docker context, like this:
```bash
eval $(minikube docker-env)
docker build --label hummus --tag hummus:latest .
```

you can use a different tag or add another tag...and then make sure to update the setup files (manifests or helm) as they currently point to latest...which is obviously not the best method when deploying to the cloud...but serves local development well enough.

### Deploying on minikube

From here the instructions differ a bit if you are looking to use the helm method or install the manifests individually.
We'll start with manifests and then helm.

oh. one thing. when looking to use yr computers mongo instance, use `host.minikube.internal` instead of `localhost`. So the pods won't search for mongo in their own container but rather on the host.

### Manifests

The ./deployment/manifests/hummus folder holds manifest files to allow you to install hummus api server and a cronjob to delete old files. You will need to create a secret file with some of the env vars in ./deployment/manifests/hummus/secret.yaml, and you can use ./deployment/manifests/hummus/secret.yaml.tpl to figure out the formats. The values are following the env vars which are expected to be "Secret" on a "real" implementation. you can edit the configmap in ./deployment/manifests/hummus/configmap.yaml for the rest of them. both cronjob and the api server deployment share them...so no need to repeat for each. Note that both assume the latest tag on hummus image and that it's local, so update if you got it in some other place.


Then it's just a matter of repeated `kubectl apply -f XXXXX`. For best results do it in this order:
    - namespace.yaml
    - configmap.yaml, secret.yaml (don't run secret.yaml.tpl!)
    - serviceaccount.yaml
    - deployment.yaml, cronjob.yaml
    - service.yaml
    - ingress.yaml
    - (mongo-service.yaml is an example yaml for cases when you want to use "mongo" as service name and the mongo instance is on yr host. you probably don't need it.)
The setup will be created wholly in the `hummus` namespace.

you can track the deployment with the minikube dashboard (`minikube dashboard`) or via kubectl.
to access the service go port forwarding...or go ingress, in which case:
- go `minikube tunnel` to allow ingress calls into minikube to happen on yr 127.0.0.1.
- edit yr hosts file (`/etc/hosts` on unixlikes) and add `127.0.0.1 hummus`

Now `curl http://hummus/api/health` should provide you with a friendly message.
When using the postman collection, make sure to change the `hummus_server_url` value to `http://hummus`.

And yeah, the UI should be available via `http://hummus` in yr browser.


### Helm

helm charts make it really simple to pack your installation and install with a single command. plus there's all these available charts to just install alongside, it makes one wants more. So with this helm chart setup for hummus sitting in ./deployments/helm i also threw in logging with EFK (elasticsearch, fluentd and kibana) as well as metrics (prometheus and grafana) using the absolutely most basic setup on those additionals other than some tweaking on fluentd to get the json logs coming out from hummus to translate to proper attributes.

What you are left to do with is just install it. Go to ./deployments/helm and create a `values.yaml` file for your env vars values (and some more). You can follow the template provided in `values.yaml.sample`. 

Then just:

```bash
helm install hummus-local hummus -n hummus-helm --create-namespace  -f ./values.yaml
```

This will create a namespace named hummus-helm and will install everything there. The helm release name is hummus-local in this example.

You can track the deployment with the minikube dashboard (`minikube dashboard`) or via kubectl.
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


## Deploying on GKE

You can use the helm chart discussed in "Helm" to also deploy to other k8s clusters, with some adaptations. I'm going to describe below how to deploy on GKE, based on how I did it.

### An initial setup

Here's what we'll need:
- A remote DB. cause we can no longer use our local mongo instance.
- A docker image for the hummus service and cron job. Got that with the Package.
- A GKE cluster.

In the GKE cluster, than other than just `helm install`ing the thing we'll also have an ngynx ingress controller (like the one used in minikube), and a cert manager.

I don't have anything to special to say about how to achieve those, so just some links for those in need:
- Got me an [Atlas db](https://www.mongodb.com/atlas/database) instance for the remote mongo. Once I had it set up, updated the local vars at the backend folder and ran `npm run dummy` to create a dummy user so I can later login with it.
- The GKE setup I use is a very simple one, create cluster with Autopilot and that's it. [This](https://cloud.google.com/kubernetes-engine/docs/deploy-app-cluster) did the trick.

To test this setup you can install a no ingress version of the helm chart included in this project, with the values customized to:
- take the docker image from github repo, and not local
- ingress enabled: false (to temporarily disable ingress)
- did _not_ enable log, metrics, to move quickly
- updated mongo value, and also emailServiceUrl which should have the expected domain.

And then:
- connect to your GKE cluster form the terminal (for connection instructions go to the GKE cluster and "Connect").
- install with the custom values for remote install, something like `helm install hummus-local hummus -n hummus-helm --create-namespace  -f ./values.gke.yaml`, provided that the custom values are in a file named `values.gke.yaml` and yr running it from ./deployments/helm.


Testing this is possible even without ingress using port forwarding.

### Adding ingress

To expose the service to the outside world one can setup ingress. The default values for the helm setup are good for minikube, so you'll have to change them to set up on GKE with a proper domain like [services.pdfhummus.com](https://services.pdfhummus.com).

The setup I did for GKE includes Nginx ingress controller and cert manager. The setup is kinda simple and one can pretty much follow the [cert manager instructions](https://cert-manager.io/docs/tutorials/acme/nginx-ingress/) start to end to carry out all the necessary task and end up with a live domain.
Only note i'd say is that currently one has to adhere to [these](https://github.com/cert-manager/cert-manager/issues/3717#issuecomment-975031637) instructions when first installing cert manager via helm on a cluster created with autopilot. Or else the issuer won't be created.

Going through all this you will end up with something like this for the ingress values file for the helm install:
```
ingress:
  enabled: true
  annotations:
      kubernetes.io/ingress.class: nginx
      cert-manager.io/issuer: "letsencrypt-prod"
  hosts:
    - host: <YOUR DOMAIN>
      paths:
        - path: /
          pathType: Prefix
          backendService: hummus
          backendPort: 8080
  tls:
    - secretName: hummus-ingress-tls
      hosts:
        - <YOUR DOMAIN>
```

With all this in place your site should work no problems.

Got too many redirects with Cloudflare (if you are running on Cloudflare)? [this](https://support.cloudflare.com/hc/en-us/articles/115000219871-Troubleshooting-redirect-loop-errors-#h_dfa85774-c19f-4f49-b11b-bf9bacf6e831) might be the solution to your problem.


## Serving Backend and Frontend Separately

It is possible to serve the backend and frontend separately. This would allow better utilization of the backend in that it handles only API calls, and
the frontend may be handled by a dedicated service that runs frontend apps, which can include also CDN and Edge support. Given that the frontend is based on NextJS you can use any option available for NextJs apps. Note that the frontend build can also be ran on a semi-static setup like AWS buckets + AWS cloudfront. Some redirect rules are needed so we can keep the urls nice and support 404 cases.

### Setting up backend for separate serving

The backend expects a "frontend-build" folder to server frontend, and if it's not there it wont serve it.
To create such a setup with the docker image, add the build arg `FRONTEND_BUILDER_SOURCE` with the value of `none`, for example like this:

```bash
docker build --label hummus --tag hummus:latest --build-arg FRONTEND_BUILDER_SOURCE=none .
```

This will make sure that the image does not build the frontend and that the server doesn't serve it.
The rest of the backend deployment works the same, with note on ingress


### Setting up frontend for separate serving

The frontend can be build separately...and you will want to use the `NEXT_PUBLIC_API_URL` var to point to the backend site. So if you are serving the backend from `api.pdfhumnus.com` just go:

```bash
cd frontend
NEXT_PUBLIC_API_URL="https://api.pdfhumnus.com" npm run build
```

The build result will be in out folder and you can server it from a static service. sort of. some redirect rules are required.
Note: you can use `next build` to just build the service and later serve it on a node server with `next start`. This is the default method of running a NextJS app and it works in this case as well. The following instructions discuss what you need to do in order to completment the site code and run it on a semi static site.


You should take care of 2 things:
- redirect urls that don't end with extension (i.e. not specific files) to the same url respective `index.html` file.
- redirect 404 or any similar error to `/404/index.html` so you get the page not found page to appear properly.

In AWS you can use a Bucket to put the out folder content in and then a CloudFront setup to take care of https as well as the required redirects.
here's sample code for a CloudFront function implementing the first redirect:

```javascript
function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    if (uri.endsWith('/')) {
        request.uri += "index.html"
    }
    else if (!uri.includes('.')) {
        request.uri += "/index.html"
    }
    
    return request;
}
```

and to get the 404 behavior you can customize the 404 and 403 error codes to redirect to `/404/index.html` (and possibly also have the http response code changed to 404, when it's not).
