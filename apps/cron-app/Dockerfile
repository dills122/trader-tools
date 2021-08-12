FROM node:12-alpine
WORKDIR /tmp
COPY ../ .

# Add bash for testing and being able to run shell in container
RUN apk add --update bash && rm -rf /var/cache/apk/*
RUN adduser -S app
RUN sh ./apps/cron-app/
RUN cp ./.env ../prod/
WORKDIR /prod
RUN chown -R app /prod
USER app
# RUN source /.env I think its not getting copied over on the deploy build or something

CMD ["npm", "run", "--prefix", ".\\common\\deploy\\apps\\cron-app\\", "pm2"]
