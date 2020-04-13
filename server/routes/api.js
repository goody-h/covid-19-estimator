import { Router } from 'express';
import xml from 'xml2js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger/swagger.json';
import estimator from '../../src/estimator';

const builder = new xml.Builder({
  renderOpts: { pretty: false }
});

const router = Router();

const swaggerDocumentJson = './api/swagger/swagger.json';
const swaggerDocumentYaml = './api/swagger/swagger.yml';

const getApi = (logs) => {
  router.post('/', (req, res) => res.json(estimator(req.body)));

  router.post('/json', (req, res) => res.json(estimator(req.body)));

  router.post('/xml', (req, res) => {
    res.set('Accept', 'application/json');
    res.setHeader('Content-Type', 'application/xml');
    return res.send(builder.buildObject(estimator(req.body)));
  });

  router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  router.use('/swagger.json', (req, res) => res.download(swaggerDocumentJson));
  router.use('/swagger.yml', (req, res) => res.download(swaggerDocumentYaml));

  router.use('/logs', async (req, res) => {
    const rLogs = await logs();

    const sLogs = rLogs.reverse().map((log) => `${log.method}\t\t${log.path}\t\t${log.status}\t\t${log.duration}ms`);
    res.setHeader('Content-Type', 'text/plain');
    res.send(sLogs.join('\n'));
  });

  return router;
};

export default getApi;
