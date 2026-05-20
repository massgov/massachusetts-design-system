const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawnSync } = require('child_process');
const { getWorkspacePackageRoot, packageRoot } = require('./shared');

const DEFAULT_PORT = 4321;
const HOST = '127.0.0.1';
const RELOAD_PATH = '/__mds_styles_reload';

const demoRoot = path.join(packageRoot, 'demo');

const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml']
]);

function getWorkspaceRoutes() {
  return new Map([
    ['/@massds/mds-styles/', getWorkspacePackageRoot('@massds/mds-styles')],
    ['/@massds/mds-tokens/', getWorkspacePackageRoot('@massds/mds-tokens')]
  ]);
}

function getPort() {
  const rawPort = process.env.MDS_STYLES_DEMO_PORT || process.env.PORT;
  const parsedPort = Number.parseInt(rawPort, 10);

  return Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : DEFAULT_PORT;
}

function getContentType(filePath) {
  return mimeTypes.get(path.extname(filePath).toLowerCase()) || 'application/octet-stream';
}

function getReloadScript() {
  return [
    '<script>',
    '(function () {',
    '  if (!window.EventSource) {',
    '    return;',
    '  }',
    `  var source = new EventSource('${RELOAD_PATH}');`,
    "  source.addEventListener('reload', function () {",
    '    window.location.reload();',
    '  });',
    '}());',
    '</script>'
  ].join('\n');
}

function injectReloadScript(html) {
  const script = getReloadScript();

  if (html.includes('</body>')) {
    return html.replace('</body>', `${script}\n  </body>`);
  }

  return `${html}\n${script}`;
}

function resolveFromRoot(root, requestPath) {
  const normalizedPath = path
    .normalize(requestPath)
    .replace(/^[/\\]+/, '')
    .replace(/^(\.\.[/\\])+/, '');
  const filePath = path.resolve(root, normalizedPath);
  const relativePath = path.relative(root, filePath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return null;
  }

  return filePath;
}

function resolveRequestPath(requestUrl, workspaceRoutes) {
  const { pathname } = new URL(requestUrl, `http://${HOST}`);
  const decodedPath = decodeURIComponent(pathname);

  for (const [routePrefix, routeRoot] of workspaceRoutes) {
    if (decodedPath.startsWith(routePrefix)) {
      return resolveFromRoot(routeRoot, decodedPath.slice(routePrefix.length));
    }
  }

  return resolveFromRoot(demoRoot, decodedPath === '/' ? 'index.html' : decodedPath);
}

function handleReloadStream(request, response, reloadClients) {
  response.writeHead(200, {
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream'
  });
  response.write(': connected\n\n');

  reloadClients.add(response);

  request.on('close', () => {
    reloadClients.delete(response);
  });
}

function sendReload(reloadClients) {
  for (const response of reloadClients) {
    response.write('event: reload\n');
    response.write(`data: ${Date.now()}\n\n`);
  }
}

async function sendFile(response, filePath, { liveReload = false } = {}) {
  if (!filePath) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  try {
    let stat = await fs.promises.stat(filePath);
    let resolvedFilePath = filePath;

    if (stat.isDirectory()) {
      resolvedFilePath = path.join(filePath, 'index.html');
      stat = await fs.promises.stat(resolvedFilePath);
    }

    if (!stat.isFile()) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    const contentType = getContentType(resolvedFilePath);

    if (liveReload && contentType.startsWith('text/html')) {
      const html = await fs.promises.readFile(resolvedFilePath, 'utf8');
      const body = Buffer.from(injectReloadScript(html));

      response.writeHead(200, {
        'Content-Length': body.byteLength,
        'Content-Type': contentType
      });
      response.end(body);
      return;
    }

    response.writeHead(200, {
      'Content-Length': stat.size,
      'Content-Type': contentType
    });

    fs.createReadStream(resolvedFilePath).pipe(response);
  } catch (error) {
    if (error.code === 'ENOENT') {
      response.writeHead(404);
      response.end('Not found');
      return;
    }

    response.writeHead(500);
    response.end('Server error');
  }
}

function openUrl(url) {
  const openCommandByPlatform = {
    darwin: 'open',
    linux: 'xdg-open',
    win32: 'cmd'
  };

  const command = openCommandByPlatform[process.platform];

  if (!command) {
    console.warn(`No browser opener is configured for platform: ${process.platform}`);
    return;
  }

  const args = process.platform === 'win32'
    ? ['/c', 'start', '', url]
    : [url];

  const result = spawnSync(command, args, {
    stdio: 'ignore'
  });

  if (result.error) {
    console.warn(`Unable to open styles demo: ${result.error.message}`);
  }
}

function listen(server, port) {
  return new Promise((resolve, reject) => {
    function handleError(error) {
      server.off('listening', handleListening);
      reject(error);
    }

    function handleListening() {
      server.off('error', handleError);
      resolve();
    }

    server.once('error', handleError);
    server.once('listening', handleListening);
    server.listen(port, HOST);
  });
}

async function startDemoServer({ liveReload = false, open = false } = {}) {
  const workspaceRoutes = getWorkspaceRoutes();
  const reloadClients = new Set();
  const server = http.createServer((request, response) => {
    const { pathname } = new URL(request.url, `http://${HOST}`);

    if (liveReload && pathname === RELOAD_PATH) {
      handleReloadStream(request, response, reloadClients);
      return;
    }

    sendFile(response, resolveRequestPath(request.url, workspaceRoutes), {
      liveReload
    });
  });

  server.on('close', () => {
    for (const response of reloadClients) {
      response.end();
    }

    reloadClients.clear();
  });

  const initialPort = getPort();
  let port = initialPort;

  while (port < initialPort + 20) {
    try {
      await listen(server, port);
      break;
    } catch (error) {
      if (error.code !== 'EADDRINUSE') {
        throw error;
      }

      port += 1;
    }
  }

  if (!server.listening) {
    throw new Error(`Unable to find an available port starting at ${initialPort}`);
  }

  const url = `http://${HOST}:${port}/`;
  console.log(`Styles demo available at ${url}`);

  if (open) {
    openUrl(url);
  }

  return {
    reload: () => sendReload(reloadClients),
    server,
    url
  };
}

if (require.main === module) {
  startDemoServer({
    liveReload: process.argv.includes('--live-reload'),
    open: process.argv.includes('--open')
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = {
  startDemoServer
};
