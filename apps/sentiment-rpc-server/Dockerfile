FROM ghcr.io/dills122/rushjs-base-img:edge
WORKDIR /tmp
COPY . .

RUN adduser -S app
RUN rm -rf ./common/temp \
    && rush install -f sentiment-rpc-server -p \
    && rush build --to sentiment-rpc-server
RUN mkdir ./prod \
    && rush deploy --project sentiment-rpc-server --target-folder ./prod \
    && cp ./.env ./prod/
WORKDIR /tmp/prod/apps/sentiment-rpc-server
RUN chown -R app /tmp/prod
USER app

CMD ["pm2-runtime", "start", "processes.json", "--env", "production"]
