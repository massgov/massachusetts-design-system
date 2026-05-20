const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const demoPath = path.resolve(__dirname, '..', 'demo', 'index.html');

if (!fs.existsSync(demoPath)) {
  console.error(`Styles demo file not found: ${demoPath}`);
  process.exit(1);
}

const openCommandByPlatform = {
  darwin: 'open',
  linux: 'xdg-open',
  win32: 'cmd'
};

const command = openCommandByPlatform[process.platform];

if (!command) {
  console.error(`No browser opener is configured for platform: ${process.platform}`);
  process.exit(1);
}

const args = process.platform === 'win32'
  ? ['/c', 'start', '', demoPath]
  : [demoPath];

const result = spawnSync(command, args, {
  stdio: 'ignore'
});

if (result.error) {
  console.error(`Unable to open styles demo: ${result.error.message}`);
  process.exit(1);
}

if (result.status !== 0) {
  console.error(`Unable to open styles demo. ${command} exited with status ${result.status}.`);
  process.exit(result.status ?? 1);
}
