import rpc from './src/services/generic/generic.rpc';

(async () => {
  try {
    await rpc({
      analyzer: 'natural',
      serviceAnalysisType: 'front-page',
      socialSource: 'reddit',
      subreddit: 'wallstreetbets'
    });
  } catch (err) {
    console.error(err);
  }
})();
