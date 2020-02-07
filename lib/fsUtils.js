'use strict';

const fs = require('fs');

const setUpDataBase = function() {
  const DATA_PATH = `${__dirname}/../data`;
  if (!isExists(DATA_PATH)) {
    fs.mkdirSync(DATA_PATH);
  }
};

const readFromFile = filePath => {
  return fs.readFileSync(filePath, 'utf8');
};

const writeIntoFile = (filePath, data) => {
  setUpDataBase();
  fs.writeFileSync(filePath, data, 'utf8');
};

const isExists = filePath => {
  return fs.existsSync(filePath);
};

const isExistingFile = filePath => {
  const stat = isExists(filePath) && fs.statSync(filePath);
  return stat && stat.isFile();
};

module.exports = {
  isExists,
  readFromFile,
  writeIntoFile,
  isExistingFile
};
