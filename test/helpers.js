const redismock = require('redis-mock');

const { PoolLogger } = require('../src/logger');

// Ensure we only create a single instance of the redis-mock client.
const mockClient = (() => {
  const options = {
    detect_buffers: true,
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
  };
  return redismock.createClient(options);
})();

const createClient = () => mockClient;

const logger = new PoolLogger({
  logLevel: 'debug',
  logColors: false,
  tty: false
});

const metricCoinInfo = { minPaymentSatoshis: 1.0, magnitude: 10.0, coinPrecision: 10 };

const swapProcess = (opts) => {
  const origProcess = {};
  Object.keys(opts).forEach((key) => {
    origProcess[key] = process[key];
    process[key] = opts[key];
  });
  return origProcess;
};

const restoreProcess = (origProcess) => {
  Object.entries(origProcess).forEach(([key, value]) => {
    process[key] = value;
  });
};

const responseStub = () => {
  const sinon = require('sinon');
  const res = {};
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returnsArg(0);
  return res;
};

module.exports = {
  createClient, logger, metricCoinInfo, swapProcess, restoreProcess, responseStub
};
