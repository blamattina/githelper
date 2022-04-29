require('dotenv').config();

const proxy = require('express-http-proxy');
const app = require('express')();

const port = 3001;

app.use(
  '/github',
  proxy(process.env.GITHUB_SERVER_HOST, {
    https: true,
    proxyReqPathResolver(req) {
      if (process.env.GITHUB_SERVER_HOST != 'api.github.com') {
        return encodeURI(`/api${req.url}`);
      }

      return encodeURI(req.url);
    },
    proxyReqOptDecorator(proxyReqOpts, srcReq) {
      proxyReqOpts.headers[
        'Authorization'
      ] = `Bearer ${process.env.GITHUB_PERSONAL_AUTH_TOKEN}`;
      return proxyReqOpts;
    },
  })
);

app.listen(port, () => {
  console.log(`Proxy app listening on ${port}`);
});
