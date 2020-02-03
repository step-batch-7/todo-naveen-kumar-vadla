'use strict';

const { Server } = require('http');
const app = require('./lib/handlers');

const defaultPort = 7000;

const main = (port = defaultPort) => {
  const server = new Server(app.handleRequests.bind(app));
  server.listen(port, () => process.stderr.write(`started listening: ${port}`));
};

const [, , port] = process.argv;

main(port);
