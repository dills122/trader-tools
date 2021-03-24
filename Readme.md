# Trader Tools

This mono-repo contains various tools and apps all centered around stocks/equities/cryptos.

# Table of Contents
- [Trader Tools](#trader-tools)
- [Table of Contents](#table-of-contents)
  - [Basic Structure](#basic-structure)
    - [Folders](#folders)
  - [Getting Started](#getting-started)
    - [Other Setup Items](#other-setup-items)
      - [External Services Setup](#external-services-setup)
    - [Other Important Commands](#other-important-commands)
  - [Important Info](#important-info)
  - [Container Development](#container-development)
  - [Deployments](#deployments)

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

You'll need to create an `.env` file with a few key-value pair to ensure all the services work correctly.

In `~/` create an `.env` file, if one doesn't already exist. You'll need to follow the proceeding steps to finish setting up the external services and the `.env` items

#### External Services Setup

1. IEX Cloud - Used for stock historical data and reference data, along with crypto
   1. You'll need to create an account [here](https://iexcloud.io/cloud-login?r=https%3A%2F%2Fiexcloud.io%2Fconsole%2F#/register)
   2. Once you created your account you'll need to add two new entries to your .env file
      1. `IEXCLOUD_PUBLIC_KEY=PUBLIC_KEY`
      2. `IEXCLOUD_PUBLIC_KEY_TEST=PUBLIC_TEST_KEY`
      3. `IEXCLOUD_API_VERSION=stable`
   3. More info about the API available [here](https://intercom.help/iexcloud/en/articles/2851957-how-to-use-the-iex-cloud-api)
2. Gmail - Used to send all email based reports and correspondence
   1. You'll need a Google account, if you don't have one or want a new one for this [here is a link](https://accounts.google.com/signup/v2/webcreateaccount?service=mail&continue=https%3A%2F%2Fmail.google.com%2Fmail&hl=en&dsh=S-1711203018%3A1615436234382827&gmb=exp&biz=false&flowName=GlifWebSignIn&flowEntry=SignUp)
   2. Add the following parameters to the `.env` file
      1. `EMAIL_USERNAME=GMAIL_EMAIL`
      2. `EMAIL_PASSWORD=GMAIL_PASSWORD`
   3. if any authentication issue refer to these common [issues](https://github.com/alykoshin/gmail-send#preparation-step---configure-your-gmail-account)
3. Polygon.io - Used for historic stock data and reference data
   1. You'll need to create an account [here](https://polygon.io/dashboard/signup)
   2. Once you've created your account, you'll need to add a few items to your `.env` file
      1. `POLYGONIO_PUBLIC_KEY`
   3. For more info on the API, check [here](https://polygon.io/docs)
4. Social Sentiment.io - Used for daily sentiment analysis data
   1. You can create an account [here](https://socialsentiment.io/register/)
   2. Once you do that you'll need to add a few `.env` file entries:
      1. `SOCIAL_SENTIMENT_API`
      2. `SOCIAL_SENTIMENT_API_VERSION`
   3. Note: as of 03-11-21 this is not used and can really be skipped for now
5. Reddit.com - Used to pull data from their subreddits
   1. You can create an account [here](https://www.reddit.com/register/)
   2. Register a new application [here](https://www.reddit.com/prefs/apps)
   3. Create a valid User-Agent string by the rules defined [here](https://github.com/reddit-archive/reddit/wiki/API)
   4. Once all that is setup add the following entries to the `.env` file:
      1. `REDDIT_USER_AGENT`
      2. `REDDIT_CLIENT_ID` - found in the application registration
      3. `REDDIT_CLIENT_SECRET` - found in the application registration
      4. `REDDIT_USERNAME`
      5. `REDDIT_PASSWORD`

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

When submitting PRs **always** remember to run `rush clean` before submitting a PR and merging it. We do **NOT** want auto generated files in the source code to reduce noise. If you forget to run this command, there is now an automated Action that will alert you when it finds any of the build files present on a PR branch.

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
