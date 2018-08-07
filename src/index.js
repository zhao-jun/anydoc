const yargs = require('yargs');
const Server = require('./server');
const defaultConfig = require('./config/defaultConfig');

const argv = yargs
  .usage('anydoor [options]')
  .option('p', {
    alias: 'port',
    describe: '端口号',
    default: defaultConfig.port,
  })
  .option('h', {
    alias: 'host',
    describe: 'host',
    default: defaultConfig.hostname,
  })
  .option('d', {
    alias: 'root',
    describe: 'root',
    default: defaultConfig.root,
  })
  .help().argv;

const server = new Server(argv);
server.start();
