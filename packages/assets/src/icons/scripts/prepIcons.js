const fs = require('fs');
const path = require('path');
const { optimize } = require('svgo');
const svgoConfig = require('./svgo.config.js');

function resolveOptions(input, maybeOptions = {}) {
  if (typeof input === 'string') {
    return {
      sourceDir: input,
      inPlace: true,
      ...maybeOptions,
    };
  }

  return {
    inPlace: true,
    ...input,
  };
}

function prepIcons(input, maybeOptions = {}) {
  const { sourceDir, outputDir, inPlace } = resolveOptions(input, maybeOptions);

  if (!sourceDir) {
    throw new Error('prepIcons requires a sourceDir');
  }

  if (!fs.existsSync(sourceDir)) {
    console.error(`Directory not found: ${sourceDir}`);
    return;
  }

  function processSvgFile(filePath) {
    let svgContent;

    try {
      svgContent = fs.readFileSync(filePath, 'utf8');
      const result = optimize(svgContent, {
        path: filePath,
        ...svgoConfig
      });

      svgContent = result.data;
      fs.writeFileSync(filePath, svgContent);

      return { success: true };
    } catch (error) {
      console.error(`❌ Error processing ${path.basename(filePath)}:`, error.message);
      return { success: false, error: error.message };
    }
  }

  function findSvgFiles(dir, basePath = '') {
    const files = [];
    const items = fs.readdirSync(dir);

    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(basePath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...findSvgFiles(fullPath, relativePath));
      } else if (item.endsWith('.svg')) {
        files.push({
          fullPath,
          relativePath
        });
      }
    });

    return files;
  }

  function processDirectory(targetDir, label) {
    const svgFiles = findSvgFiles(targetDir);
    let processedCount = 0;

    console.log(`Found ${svgFiles.length} SVG files to process in ${label}...`);

    svgFiles.forEach(fileInfo => {
      const { fullPath, relativePath } = fileInfo;
      const result = processSvgFile(fullPath);

      if (result.success) {
        console.log(`✅ Processed (${label}): ${relativePath}`);
        processedCount++;
      }
    });

    return {
      processedCount,
      totalFiles: svgFiles.length
    };
  }

  const summary = {};

  if (outputDir) {
    fs.mkdirSync(path.dirname(outputDir), { recursive: true });
    fs.cpSync(sourceDir, outputDir, { recursive: true });
    summary.output = processDirectory(outputDir, 'output');
  }

  if (inPlace) {
    summary.inPlace = processDirectory(sourceDir, 'source');
  }

  if (!outputDir && !inPlace) {
    throw new Error('prepIcons requires at least one target: inPlace or outputDir');
  }

  if (summary.output && summary.inPlace) {
    console.log(
      `\n🎉 Processed ${summary.inPlace.processedCount} source SVGs and ${summary.output.processedCount} output SVGs`
    );
  } else {
    const result = summary.output || summary.inPlace;
    console.log(`\n🎉 Successfully processed ${result.processedCount} SVG files`);
  }

  return summary;
}

if (require.main === module) {
  const defaultIconsDir = path.join(__dirname, '../static');
  const args = process.argv.slice(2);
  const sourceDir = args[0] || defaultIconsDir;
  const outputFlagIndex = args.indexOf('--output');
  const outputDir = outputFlagIndex >= 0 ? args[outputFlagIndex + 1] : '';
  const noInPlace = args.includes('--no-in-place');

  console.log('🔧 Processing SVG files with SVGO...\n');

  prepIcons({
    sourceDir,
    outputDir: outputDir || undefined,
    inPlace: !noInPlace,
  });
}

module.exports = prepIcons;
