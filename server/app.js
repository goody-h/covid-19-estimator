import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';


const app = express();

const getDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

const getApp = ({ setlog, getlogs, onCreate }) => {
  if (onCreate) {
    onCreate(app);
  }

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} [STARTED]`);
    if (req.originalUrl.search(/^\/api\/v1\/on-covid-19(\/|\/json|\/xml){0,1}$/) !== -1) {
      const start = process.hrtime();
      res.on('finish', () => {
        const log = {
          method: req.method,
          path: req.originalUrl.replace(/(.*\.)*\//, '/'),
          status: res.statusCode,
          duration: Math.trunc(getDurationInMilliseconds(start)) + 10
        };
        console.log(`${log.method}\t\t${log.path}\t\t${log.status}\t\t${log.duration}ms`);
        if (setlog) {
          setlog(log);
        }
      });
    }
    next();
  });

  app.use(bodyParser.json({ type: '*/*' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/api/v1/on-covid-19', routes.api(getlogs));

  return app;
};

export default getApp;
