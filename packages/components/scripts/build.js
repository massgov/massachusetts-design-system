import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as sass from 'sass';
import { createComponentBuild } from './component-build.js';
import { formatGeneratedOutput } from './format-generated-output.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(packageRoot, 'src');
const distRoot = path.join(packageRoot, 'dist');
const componentBuildFile = 'build.js';
const ignoredSourceDirs = new Set(['shared']);

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function copyFile(source, destination) {
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.copyFile(source, destination);
}

async function writeFile(destination, contents) {
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, formatGeneratedOutput(destination, contents), 'utf8');
}

async function compileSass(source, destination) {
  const result = await sass.compileAsync(source, {
    importers: [new sass.NodePackageImporter()],
    sourceMap: false,
    style: 'expanded'
  });

  await writeFile(destination, `${result.css}\n`);
}

async function getComponentNames() {
  const entries = await fs.readdir(srcRoot, { withFileTypes: true });

  return entries
    .filter((entry) =>
      entry.isDirectory() &&
      !entry.name.startsWith('.') &&
      !ignoredSourceDirs.has(entry.name)
    )
    .map((entry) => entry.name)
    .sort();
}

function shouldCompileSourceScss(fileName) {
  return path.extname(fileName) === '.scss' && !path.basename(fileName).startsWith('_');
}

function createBuildContext(componentName) {
  const sourceDir = path.join(srcRoot, componentName);
  const outputDir = path.join(distRoot, componentName);

  return {
    componentName,
    outputDir,
    sourceDir,
    compileSass,
    compileSourceScss: (inputFileName, outputFileName = inputFileName.replace(/\.scss$/, '.css')) =>
      compileSass(
        path.join(sourceDir, inputFileName),
        path.join(outputDir, outputFileName)
      ),
    copyFile,
    copySourceFile: (fileName) => copyFile(path.join(sourceDir, fileName), path.join(outputDir, fileName)),
    copySourceFiles: (fileNames) =>
      Promise.all(
        fileNames.map((fileName) =>
          copyFile(path.join(sourceDir, fileName), path.join(outputDir, fileName))
        )
      ),
    readSourceFile: (fileName) => fs.readFile(path.join(sourceDir, fileName), 'utf8'),
    writeOutputFile: (fileName, contents) => writeFile(path.join(outputDir, fileName), contents)
  };
}

async function compileComponentScssFiles(context) {
  const entries = await fs.readdir(context.sourceDir, { withFileTypes: true });
  const scssFiles = entries
    .filter((entry) => entry.isFile() && shouldCompileSourceScss(entry.name))
    .map((entry) => entry.name);

  await Promise.all(scssFiles.map((fileName) => context.compileSourceScss(fileName)));
}

async function runComponentBuild(componentName) {
  const context = createBuildContext(componentName);
  const buildModulePath = path.join(context.sourceDir, componentBuildFile);
  let buildComponent;

  await fs.mkdir(context.outputDir, { recursive: true });

  if (await pathExists(buildModulePath)) {
    const buildModule = await import(pathToFileURL(buildModulePath).href);

    buildComponent = buildModule.buildComponent ?? buildModule.default;

    if (buildComponent !== undefined && typeof buildComponent !== 'function') {
      throw new Error(
        `${buildModulePath} must export a buildComponent function when using a default or named build export.`
      );
    }

    if (typeof buildComponent !== 'function') {
      const buildConfig = Object.fromEntries(
        Object.entries(buildModule).filter(([exportName]) =>
          exportName !== 'buildComponent' &&
          exportName !== 'default'
        )
      );

      buildComponent = createComponentBuild({
        componentName,
        ...buildConfig
      });
    }
  }

  if (typeof buildComponent !== 'function') {
    buildComponent = createComponentBuild({
      componentName
    });
  }

  await buildComponent(context);
  await compileComponentScssFiles(context);
  return context;
}

async function getComponentCssImports(componentNames) {
  const imports = [];

  for (const componentName of componentNames) {
    const componentOutputDir = path.join(distRoot, componentName);
    const entries = await fs.readdir(componentOutputDir, { withFileTypes: true });
    const cssFiles = entries
      .filter((entry) => entry.isFile() && path.extname(entry.name) === '.css')
      .map((entry) => entry.name)
      .sort();

    imports.push(...cssFiles.map((fileName) => `@import './${componentName}/${fileName}';`));
  }

  return imports;
}

async function writePackageIndexes(componentNames) {
  const cssImports = await getComponentCssImports(componentNames);

  await writeFile(path.join(distRoot, 'index.css'), `${cssImports.join('\n')}\n`);
}

async function build() {
  await fs.rm(distRoot, { recursive: true, force: true });

  const componentNames = await getComponentNames();

  await Promise.all(componentNames.map(runComponentBuild));
  await writePackageIndexes(componentNames);
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
