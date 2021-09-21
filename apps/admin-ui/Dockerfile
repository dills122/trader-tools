FROM ghcr.io/dills122/trader-tools:master
WORKDIR /tmp
COPY ../ .

RUN sh ./scripts/docker-build.sh admin-ui
WORKDIR /tmp/prod/apps/admin-ui
RUN npm i -g @angular/cli
RUN chown -R app /tmp/prod
USER app
# RUN source /.env I think its not getting copied over on the deploy build or something

CMD ["npm", "run", "start:docker"]
