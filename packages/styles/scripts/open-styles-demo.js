const { startDemoServer } = require('./demo-server');

startDemoServer({ open: true }).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
