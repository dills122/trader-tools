FROM node:12-alpine
WORKDIR /trader-tools
COPY . .

# Add bash for testing and being able to run shell in container
RUN apk add --update bash && rm -rf /var/cache/apk/*

RUN npm install -g @microsoft/rush
RUN rush unlink
RUN rm -rf common/temp
RUN rush update --purge
RUN rush install
RUN rush build
RUN mkdir ../prod
RUN rush deploy --target-folder ../prod
RUN cp ./.env ../prod/
WORKDIR /prod
# RUN source /.env I think its not getting copied over on the deploy build or something


CMD ["npm", "run", "--prefix", ".\\common\\deploy\\apps\\cron-app\\", "start"]
