const yargs = require('yargs');
const Server = require('./server');
const defaultConfig = require('./config/defaultConfig');

const argv = yargs
  .usage('anydoor [options]')
  .option('p', {
    alias: 'port',
    describe: '自定义端口号',
    default: defaultConfig.port,
  })
  .option('h', {
    alias: 'host',
    describe: '自定义host',
    default: defaultConfig.hostname,
  })
  .option('d', {
    alias: 'root',
    describe: '自定义根目录',
    default: defaultConfig.root,
  })
  .help().argv;

const server = new Server(argv);
server.start();
