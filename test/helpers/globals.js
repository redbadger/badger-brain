import chai from 'chai';
import { spy, stub } from 'sinon';
import injectr from 'injectr';
import { transform } from 'babel-core';

injectr.onload = (filename, content) =>
  transform(content, {
    filename,
  }).code;

global.spy = spy;
global.stub = stub;
global.expect = chai.expect;
global.injectr = injectr;
