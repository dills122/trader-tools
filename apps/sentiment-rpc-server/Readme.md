# Sentiment Api

## Getting Started

For this repo there are some initial setup you'll need to do on your machine before it will work properly.

You'll need yarn for some of the commands run in this repo

You can install that with this command `npm i yarn -g`

You'll also need to use bash for some of the build commands so make sure you have a bash terminal.

### Windows

Check your system to see if you have the command `protoc` available, if not follow the steps below

1. Navigate to the protobuf release [page](https://github.com/protocolbuffers/protobuf/releases) and download the correct release for your system (`protoc-[VERSION]-win64.zip`)
2. Unzip and move to `%APPDATA%`
3. Add the full path to the new folder for `protoc` up to the `bin` folder inside
4. test the command on the console to make sure its mapped in the path correctly

## Building Protos

Whenever you make changes or create a new route you'll need to do some code generation. This will generate all the required files for gRPC.

```bash
npm run build:proto
```

All generated files will be in the `~/generated` directory under its package name.

## Creating SSL Certs

This repo is SSL protected and will require SSL certs to be generated before it will work.

If you just want to do a quick test before setting this up you can set the ENV value `isInsecure` to true and it will bypass the SSL.

To generate your certs you'll need to ensure you have `openssl` installed. (You can use `Homebrew` or `Chocolatey` package managers based on your machine type to install this CLI)

Once you have ensured `openssl` is installed you can run the command below to generate your certs

> Note these are currently tied to my domain and all that so if you want it tied to yours or a different one for development, you'll need to edit the script `~/scripts/cert-gen/generate.sh`

```bash
npm run cert:gen
```
