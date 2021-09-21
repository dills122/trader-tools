FROM ghcr.io/dills122/trader-tools:master
WORKDIR /tmp
COPY ../ .

RUN sh ./scripts/docker-build.sh admin-ui
WORKDIR /tmp/prod/apps/admin-api
RUN chown -R app /tmp/prod
USER app
# RUN source /.env I think its not getting copied over on the deploy build or something

CMD ["pm2-runtime", "start", "processes.json"]
