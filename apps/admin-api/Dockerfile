FROM ghcr.io/dills122/rushjs-base-img:edge
WORKDIR /tmp
COPY . .

RUN adduser -S app
RUN rm -rf ./common/temp \
    && rush install -f admin-api -p \
    && rush build --to admin-api
RUN mkdir ./prod \
    && rush deploy --project admin-api --target-folder ./prod \
    && cp ./.env ./prod/
WORKDIR /tmp/prod/apps/admin-api
RUN chown -R app /tmp/prod
USER app

CMD ["pm2-runtime", "start", "processes.json", "--env", "production"]
