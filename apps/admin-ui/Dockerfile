FROM ghcr.io/dills122/trader-tools:master
WORKDIR /tmp
COPY ../ .

# Add bash for testing and being able to run shell in container
RUN apk add --update bash && rm -rf /var/cache/apk/*
RUN adduser -S app
RUN rm -rf ./common/temp
RUN rush update --purge
RUN rush build
RUN mkdir ./prod
RUN rush deploy --project admin-ui --target-folder ./prod
RUN cp ./.env ./prod/
WORKDIR /tmp/prod/apps/admin-ui
RUN chown -R app /tmp/prod
USER app
# RUN source /.env I think its not getting copied over on the deploy build or something

CMD ["pm2-runtime", "start", "processes.json"]
