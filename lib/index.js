/* eslint-disable no-console  */
if (process.env.NEWRELIC_LICENSE) {
  require('newrelic'); // eslint-disable-line
}

import 'babel-polyfill';
import fs from 'fs';
import colours from 'colors/safe';
import badgerBrain from './app';

const port = process.env.PORT || 3001;
const server = `http://127.0.0.1:${port}`;
const badger = fs.readFileSync(`${__dirname}/../assets/badger.txt`, 'utf-8');

badgerBrain.listen(port);

console.log(badger);
console.log(
  colours.inverse.bold(`
  Badger Brain GraphQL server is running at ${server}

  Navigate to ${colours.green.underline(
    `${server}/graphql`
  )} in your browser for
  a full GraphiQL experience`)
);
