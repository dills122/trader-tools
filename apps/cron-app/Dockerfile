FROM ghcr.io/dills122/rushjs-base-img:edge
WORKDIR /tmp
COPY . .

RUN adduser -S app
RUN rm -rf ./common/temp \
    && rush install -f cron-app -p \
    && rush build --to cron-app
RUN mkdir ./prod \
    && rush deploy --project cron-app --target-folder ./prod \
    && cp ./.env ./prod/
WORKDIR /tmp/prod/apps/cron-app
RUN chown -R app /tmp/prod
USER app

CMD ["pm2-runtime", "start", "processes.json", "--env", "production"]
