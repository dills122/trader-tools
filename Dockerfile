FROM mhart/alpine-node:12
MAINTAINER Dylan Steele "dylansteele57@gmail.com"

RUN apk add --update bash && rm -rf /var/cache/apk/*
RUN apk --update --upgrade add bash
COPY . ./build
RUN node build/common/scripts/install-run-rush.js install
RUN node build/common/scripts/install-run-rush.js build
RUN mkdir prod
RUN node build/common/scripts/install-run-rush.js deploy --target-folder ./prod
RUN rm -rf ./build
RUN cd ./prod
RUN source .env

WORKDIR /prod

CMD ["npm", "run", "--prefix", ".\\common\\deploy\\apps\\cron-app\\", "start"]
