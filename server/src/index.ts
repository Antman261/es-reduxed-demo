import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import { STATIC_PATH, staticMiddleware } from './routes/static.js';
import { decorateExpressRouter } from 'http-schemas/server.js';
import { pollsApiSchema } from 'api-schema';
import {
  getPollByIdRouteHandler,
  getPollsRouteHandler, postChoiceRouteHandler,
  postPollsRouteHandler, postVoteRouteHandler
} from './routes/polls.js';
import { validationErrorHandler } from './routes/validationErrorHandler.js';

const PORT = 8080;
const app = express();
const pollsApi = decorateExpressRouter({
  schema: pollsApiSchema,
  onValidationError: validationErrorHandler,
});

app.use(morgan('combined'));
app.use(compression());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(express.json());
app.use(cors());
app.use(staticMiddleware);


/////////////////////////////
// ***** API ROUTES *********
/////////////////////////////
app.use('/api', pollsApi);
pollsApi.get('/polls', getPollsRouteHandler);
pollsApi.post('/polls', postPollsRouteHandler);
pollsApi.get('/polls/:id', getPollByIdRouteHandler);
pollsApi.post('/polls/:id/choices', postChoiceRouteHandler);
pollsApi.post('/polls/:id/choices/:choiceId/vote', postVoteRouteHandler);


///////////////////////////////
// *** FALL-THRU FOR SPA *** //
///////////////////////////////
app.get('*', (req, res) => {
  res.sendFile(`${STATIC_PATH}/index.html`);
});

app.listen(PORT, () => {
  console.log(`Polls Server started on port ${PORT}`);
});
