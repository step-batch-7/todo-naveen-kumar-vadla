'use strict';

const fs = require('fs');
const TODO_DATA_FOLDER = `${__dirname}/../data`;

const readFromFile = filePath => {
  return fs.readFileSync(filePath, 'utf8');
};

const writeIntoFile = (filePath, data) => {
  if (!isFilePresent(TODO_DATA_FOLDER)) {
    fs.mkdirSync(TODO_DATA_FOLDER);
  }
  fs.writeFileSync(filePath, data, 'utf8');
};

const isFilePresent = filePath => {
  return fs.existsSync(filePath);
};

const isExistingFile = filePath => {
  const stat = isFilePresent(filePath) && fs.statSync(filePath);
  return stat && stat.isFile();
};

module.exports = {
  isFilePresent,
  readFromFile,
  writeIntoFile,
  isExistingFile
};
