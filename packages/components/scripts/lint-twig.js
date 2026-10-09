import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Twig from 'twig';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = path.join(packageRoot, 'src');

async function getTemplates(directory) {
  const templates = [];

  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      templates.push(...await getTemplates(entryPath));
    } else if (entry.isFile() && entry.name.endsWith('.twig')) {
      templates.push(entryPath);
    }
  }

  return templates.sort();
}

async function lint() {
  const templates = await getTemplates(sourceRoot);
  let errors = 0;

  if (templates.length === 0) {
    throw new Error('No Twig templates found under src/.');
  }

  for (const templatePath of templates) {
    try {
      Twig.twig({
        data: await fs.readFile(templatePath, 'utf8'),
        rethrow: true
      });
    } catch (error) {
      errors += 1;
      console.error(`${path.relative(packageRoot, templatePath)}: ${error.message ?? error}`);
    }
  }

  if (errors > 0) {
    process.exitCode = 1;
    console.error(`Found syntax errors in ${errors} of ${templates.length} Twig templates.`);
  } else {
    console.log(`Checked syntax of ${templates.length} Twig templates.`);
  }
}

lint().catch((error) => {
  console.error(error.message ?? error);
  process.exitCode = 1;
});
