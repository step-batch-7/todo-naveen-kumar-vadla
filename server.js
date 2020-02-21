'use strict';

const fs = require('fs');

const app = require('./lib/routes');

const defaultPort = 7000;

const setUpDataBase = function() {
  const DATA_PATH = `${__dirname}/data`;
  if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(DATA_PATH);
  }
};

const main = (port = defaultPort) => {
  setUpDataBase();
  app.listen(port, () => process.stderr.write(`started listening: ${port}`));
};

const [, , port] = process.argv;

main(port);
