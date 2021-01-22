# Trader Tools

This mono-repo contains various tools and apps all centered around stocks/equities/cryptos.

## Basic Structure

This is mono-repo is setup with an overall basic folder structure that will be explained below.
### Folders

* `apps` - where all of the apps will be stored (crons, web-apps, clis', etc)
* `lib` - where shared core data and services are to live (`core-sdk`)
* `services` - external outreach services and individual jobs
* `.github` - where the `Github Actions` are stored

## Getting Started

You'll need to install `rush` globally first.

```bash
npm i -g rush
```

Install all the repo's dependencies.

```bash
rush install
```

**Important** Do NOT use `npm` for installing or updating deps. [Read Here](https://rushjs.io/pages/developer/new_developer/)

### Other Setup Items

You'll need to create a couple `.env` files to ensure all the services work correctly.

In `~/services/api-services` create an `.env` file with the following parameters:

```env
IEXCLOUD_PUBLIC_KEY=PUBLIC_KEY
IEXCLOUD_API_VERSION=stable
```

To get the required data points sign up for an `iex cloud` api account [here](https://iexcloud.io/) and for more info on how to work with the api read [here](https://intercom.help/iexcloud/en/articles/2851957-how-to-use-the-iex-cloud-api).

In `~/lib/trader-sdk` create an `.env` file with the following parameters:

```env
EMAIL_USERNAME=GMAIL_EMAIL
EMAIL_PASSWORD=GMAIL_PASSWORD
```
You'll need to sign-up for a new Gmail account to use this feature and if any authentication issue refer to these common [issues](https://github.com/alykoshin/gmail-send#preparation-step---configure-your-gmail-account).

### Other Important Commands

Compile all of the repos Typescript files

```bash
rush compile
```

Clean Up all the compilation files

```bash
rush clean
```

## Important Info

When submitting PRs **always** remember to run `rush clean` before submitting a PR and merging it. We do **NOT** want auto generated files in the source code to reduce noise.

## Container Development

Building the docker container

```bash
sudo docker build -t "repo:tagHere" ./
```

Run container with port open

```bash
sudo docker run -p 8080:8080 "containerId" &
```

Run container and remote into it

```bash
sudo docker run -it "containerId" /bin/bash
```

## Deployments

Currently you'll only be able to deploy this via the command line, no CD integration is setup yet.

You'll need to re-build the container before every deployment.
