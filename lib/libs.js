'use strict';
const uuid = require('node-uuid');
const hash = require('object-hash');

function Libs() {}

Libs.prototype.uuid = () => {
  return uuid.v4();
};

Libs.prototype.toArray = (objects) => {
  const array = [];
  Object.keys(objects).forEach((key) => {
    array.push(objects[key]);
  });
  return array;
};

Libs.prototype.time = () => {
  return new Date();
};

Libs.prototype.hash = (text) => {
  return hash(text);
};

module.exports = new Libs;

