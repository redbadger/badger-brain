'use strict'; // eslint-disable-line strict

module.exports = function leftPad(number, targetLength) {
  let output = number.toString();
  while (output.length < targetLength) {
    output = `0${output}`;
  }
  return output;
};
