const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..', 'static');
const boldRoot = path.join(root, 'bold');

fs.mkdirSync(root, { recursive: true });
fs.mkdirSync(boldRoot, { recursive: true });

const input = fs.readFileSync(0, 'utf8');
const icons = JSON.parse(input);

for (const icon of icons) {
  const regularPath = path.join(root, `${icon.fileBaseName}.svg`);
  const boldPath = path.join(boldRoot, `${icon.fileBaseName}--bold.svg`);

  if (icon.regularSvg) {
    fs.writeFileSync(regularPath, icon.regularSvg);
  }

  if (icon.boldSvg) {
    fs.writeFileSync(boldPath, icon.boldSvg);
  }
}

console.log(`Wrote ${icons.length} icon entries`);
