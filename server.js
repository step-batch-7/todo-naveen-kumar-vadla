'use strict';

const { Server } = require('http');
const fs = require('fs');

const app = require('./lib/routes');

const defaultPort = 7000;

const setUpDataBase = function() {
  const DATA_PATH = `${__dirname}/../data`;
  if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(DATA_PATH);
  }
};

const main = (port = defaultPort) => {
  setUpDataBase();
  const server = new Server(app.handleRequests.bind(app));
  server.listen(port, () => process.stderr.write(`started listening: ${port}`));
};

const [, , port] = process.argv;

main(port);
