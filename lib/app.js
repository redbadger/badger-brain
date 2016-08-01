import 'http';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import { Schema } from './schema.js';

const app = express();

app.get('/__health__', (req, res) => res.send('ok'));

app.use('/graphql', graphqlHTTP(request => ({
  schema: Schema,
  context: request,
  pretty: true,
  graphiql: true,
})));

export default app;
