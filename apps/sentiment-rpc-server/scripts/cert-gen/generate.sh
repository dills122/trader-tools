#!/bin/bash

mkdir -p ./certs

pushd ./certs

openssl genrsa -out ca.key 4096

openssl req -x509 -newkey rsa:4096 -days 365 -nodes -keyout ca.key -out ca.cert -subj "/C=US/ST=Michigan/L=Detroit/O=Steele Inc/OU=IT/CN=*.dsteele.dev/emailAddress=dylansteele57@gmail.com"

openssl genrsa -out service.key 4096

openssl req -new -key service.key -out service.csr -config ../local.cert.conf

openssl x509 -req -in service.csr -CA ca.cert -CAkey ca.key -CAcreateserial -out service.pem -days 365 -sha256 -extfile ../local.cert.conf -extensions req_ext

popd
