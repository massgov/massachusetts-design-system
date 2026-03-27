const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'static');
const OUT_JSON = path.join(__dirname, 'icon-name-inventory.json');
const OUT_CSV = path.join(__dirname, 'icon-name-inventory.csv');
const DEFAULT_FIGMA_NAMES_PATH = path.join(__dirname, 'figma-component-set-names.json');

const FIGMA_NAMES = [
  'AccessibleTrails',
  'AirplaneTilt',
  'Ambulance',
  'ArrowCounterClockwise',
  'ArrowDown',
  'ArrowElbowDownRight',
  'ArrowElbowRightDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowSquareOut',
  'ArrowUp',
  'ArrowsCounterClockwise',
  'ArrowsInSimple',
  'ArrowsOut',
  'AudioDescription',
  'Baby',
  'BabyCarriage',
  'Backpack',
  'Barn',
  'Barricade',
  'Baseball',
  'Basket',
  'Basketball',
  'BellRinging',
  'Binoculars',
  'Bird',
  'BlueskyLogo',
  'Boat',
  'BookOpenText',
  'BookmarkSimple',
  'Books',
  'Boot',
  'Braille',
  'Bridge',
  'Bug',
  'Building',
  'BuildingApartment',
  'Bulldozer',
  'Bus',
  'Calendar',
  'CalendarBlank',
  'Camera',
  'CameraPlus',
  'Campfire',
  'Car',
  'CaretCircleRight',
  'CaretDoubleRight',
  'CaretDown',
  'CaretLeft',
  'CaretRight',
  'CaretUp',
  'CaretUpDown',
  'Carrot',
  'CastleTurret',
  'Catalog',
  'Certificate',
  'ChartLineUp',
  'ChatCircle',
  'ChatCircleDots',
  'Check',
  'Check',
  'CheckCircle',
  'ClipboardText',
  'ClockCounterClockwise',
  'ClosedCaptioning',
  'ContrastEye',
  'Copy',
  'Cow',
  'CreditCard',
  'Database',
  'Detective',
  'Dna',
  'Dog',
  'DotsThree',
  'DotsThreeVertical',
  'DownloadSimple',
  'Ear',
  'EarSlash',
  'Elevator',
  'Envelope',
  'EscalatorDown',
  'EscalatorUp',
  'Export',
  'Eye',
  'EyeSlash',
  'FacebookLogo',
  'Farm',
  'FaxIcon',
  'File',
  'FileArrowDown',
  'FileDoc',
  'FileImage',
  'FileJpg',
  'FilePdf',
  'FilePng',
  'FileSvg',
  'FileVideo',
  'FileXls',
  'FileZip',
  'Fingerprint',
  'FireTruck',
  'FirstAid',
  'FirstAidKit',
  'Fish',
  'FlickrLogo',
  'FolderMinus',
  'FolderSimplePlus',
  'Funnel',
  'GasPump',
  'Gauge',
  'Gavel',
  'Gear',
  'GithubLogo',
  'Globe',
  'GlobeSimpleX',
  'Golf',
  'Gps',
  'GpsSlash',
  'GraduationCap',
  'HandTap',
  'HardHat',
  'Horse',
  'Hospital',
  'House',
  'HouseLine',
  'IdentificationCard',
  'ImageBroken',
  'Images',
  'Info',
  'InstagramLogo',
  'Key',
  'Laptop',
  'LetterCircleP',
  'Lighthouse',
  'LineVertical',
  'Link',
  'LinkBreak',
  'LinkedInLogo',
  'List',
  'ListBullets',
  'ListChecks',
  'ListPlus',
  'LockSimple',
  'LockSimpleOpen',
  'Log',
  'MagnifyingGlass',
  'MagnifyingGlassMinus',
  'MagnifyingGlassPlus',
  'MapPin',
  'MapPinArea',
  'MapTrifold',
  'Medal',
  'MediumLogo',
  'Microphone',
  'Microscope',
  'Minus',
  'Money',
  'Moon',
  'Moped',
  'Mosquito',
  'Motorcycle',
  'Mountains',
  'Neurodivergence',
  'NotePencil',
  'OpenNow',
  'Paperclip',
  'Park',
  'PawPrint',
  'PencilRuler',
  'PencilSimple',
  'PersonSimpleBike',
  'PersonSimpleCircle',
  'PersonSimpleHike',
  'PersonSimpleSki',
  'PersonSimpleSwim',
  'PhoneCall',
  'PicnicTable',
  'Play',
  'Plus',
  'PlusCircle',
  'PoliceCar',
  'Prescription',
  'PresentationChart',
  'Prohibit',
  'PublicTransportation',
  'PushPin',
  'Question',
  'Quotes',
  'Receipt',
  'Report',
  'RssSimple',
  'Sailboat',
  'Scales',
  'SchoolBus',
  'Scooter',
  'Screencast',
  'Scroll',
  'Share',
  'ShareFat',
  'ShieldCheck',
  'ShieldStar',
  'ShoppingCart',
  'SignLanguage',
  'Signature',
  'Signin',
  'Signout',
  'SlackLogo',
  'Sliders',
  'SlidersHorizontal',
  'Smiley',
  'SnowPlow',
  'Stack',
  'StackMinus',
  'StackPlus',
  'Stairs',
  'Star',
  'Student',
  'Subway',
  'Sun',
  'SwimmingPool',
  'Syringe',
  'Taxi',
  'Tent',
  'TestTube',
  'ThreadsLogo',
  'ThumbsDown',
  'ThumbsUp',
  'TrafficCone',
  'TrafficSignal',
  'Train',
  'TrainRegional',
  'Transit',
  'Translate',
  'Trash',
  'Tree',
  'TreeEvergreen',
  'Truck',
  'TruckTrailer',
  'UploadSimple',
  'User',
  'UserGear',
  'UserPlus',
  'UsersThree',
  'Van',
  'Video',
  'VimeoLogo',
  'Virus',
  'Warning',
  'WarningCircle',
  'Waves',
  'WheelchairMotion',
  'WifiMedium',
  'Wrench',
  'X',
  'XLogo',
  'YoutubeLogo',
];

const RENAMED_HIGH_CONFIDENCE = {
  'alert': 'bell-ringing',
  'arrow': 'arrow-right',
  'bg-checklist': 'list-checks',
  'blog': 'rss-simple',
  'cash': 'money',
  'castle': 'castle-turret',
  'chart': 'chart-line-up',
  'chat': 'chat-circle',
  'close': 'x',
  'credit': 'credit-card',
  'data': 'database',
  'date-picker': 'calendar-blank',
  'doc-docx': 'file-doc',
  'doc-generic': 'file',
  'doc-pdf': 'file-pdf',
  'doc-xlsx': 'file-xls',
  'download': 'download-simple',
  'expand': 'arrows-out',
  'external-link': 'arrow-square-out',
  'fax': 'fax-icon',
  'form': 'note-pencil',
  'home': 'house-line',
  'input-error': 'warning-circle',
  'input-success': 'check-circle',
  'linkedin-logo': 'linked-in-logo',
  'lock': 'lock-simple',
  'login': 'signin',
  'mail': 'envelope',
  'map': 'map-trifold',
  'marker': 'map-pin',
  'message': 'chat-circle-dots',
  'p-rescription': 'prescription',
  'password': 'key',
  'phone': 'phone-call',
  'pin': 'push-pin',
  'profile': 'user',
  'quote': 'quotes',
  'restore': 'arrows-counter-clockwise',
  'search': 'magnifying-glass',
  'settings': 'gear',
  'unlock': 'lock-simple-open',
  'wheelchair': 'wheelchair-motion',
  'wifi': 'wifi-medium',
  'zoomin': 'magnifying-glass-plus',
};

const RENAMED_REVIEW = {
  'checkmark': 'check',
  'demographics': 'users-three',
  'wait-time': 'clock-counter-clockwise',
};

function parseArgs(argv) {
  const args = {
    figmaNamesPath: fs.existsSync(DEFAULT_FIGMA_NAMES_PATH) ? DEFAULT_FIGMA_NAMES_PATH : '',
    outJson: OUT_JSON,
    outCsv: OUT_CSV,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--figma-names') {
      args.figmaNamesPath = argv[i + 1] || '';
      i += 1;
    } else if (arg === '--out-json') {
      args.outJson = argv[i + 1] || OUT_JSON;
      i += 1;
    } else if (arg === '--out-csv') {
      args.outCsv = argv[i + 1] || OUT_CSV;
      i += 1;
    }
  }

  return args;
}

function normalizeName(name) {
  return name
    .replace(/-mds$/i, '')
    .replace(/ /g, '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/--+/g, '-')
    .toLowerCase();
}

function listSvgBaseNames(dir) {
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.svg'))
    .map((file) => path.basename(file, '.svg'))
    .sort();
}

function escapeCsv(value) {
  const stringValue = String(value ?? '');
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function loadFigmaNames(figmaNamesPath) {
  if (!figmaNamesPath) {
    return FIGMA_NAMES;
  }

  const raw = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), figmaNamesPath), 'utf8'));

  if (!Array.isArray(raw)) {
    throw new Error('Figma names input must be a JSON array');
  }

  return raw
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && typeof item.name === 'string') return item.name;
      throw new Error(`Unsupported Figma names entry: ${JSON.stringify(item)}`);
    })
    .filter(Boolean);
}

const { figmaNamesPath, outJson, outCsv } = parseArgs(process.argv);
const regularRepoNames = listSvgBaseNames(ROOT);
const boldRepoNames = listSvgBaseNames(path.join(ROOT, 'bold')).map((name) =>
  name.replace(/--bold$/, '')
);
const figmaNames = loadFigmaNames(figmaNamesPath);

const figmaNormalized = figmaNames.map((name) => ({
  figma_name: name,
  normalized_name: normalizeName(name),
}));

const figmaByNormalized = new Map();
for (const item of figmaNormalized) {
  if (!figmaByNormalized.has(item.normalized_name)) {
    figmaByNormalized.set(item.normalized_name, []);
  }
  figmaByNormalized.get(item.normalized_name).push(item.figma_name);
}

const inventory = regularRepoNames.map((repoName) => {
  if (RENAMED_HIGH_CONFIDENCE[repoName]) {
    return {
      repo_name: repoName,
      proposed_figma_name: RENAMED_HIGH_CONFIDENCE[repoName],
      status: 'renamed_high_confidence',
      confidence: 'high',
    };
  }

  if (RENAMED_REVIEW[repoName]) {
    return {
      repo_name: repoName,
      proposed_figma_name: RENAMED_REVIEW[repoName],
      status: 'renamed_needs_review',
      confidence: 'medium',
    };
  }

  const figmaMatches = figmaByNormalized.get(repoName);
  if (figmaMatches && figmaMatches.length > 0) {
    return {
      repo_name: repoName,
      proposed_figma_name: repoName,
      status: 'exact_name_match',
      confidence: figmaMatches.length > 1 ? 'high_with_collision' : 'high',
      notes:
        figmaMatches.length > 1
          ? `Multiple Figma components normalize to this name: ${figmaMatches.join(', ')}`
          : '',
    };
  }

  return {
    repo_name: repoName,
    proposed_figma_name: '',
    status: 'repo_only_unmapped',
    confidence: 'low',
  };
});

const mappedTargets = new Set(
  inventory
    .map((item) => item.proposed_figma_name)
    .filter(Boolean)
);

const figmaOnly = figmaNormalized
  .filter((item) => !mappedTargets.has(item.normalized_name))
  .map((item) => ({
    figma_name: item.figma_name,
    normalized_name: item.normalized_name,
    status: 'figma_only_new_or_unmapped',
  }));

const exactMatches = inventory.filter((item) => item.status === 'exact_name_match');
const renamedHighConfidence = inventory.filter((item) => item.status === 'renamed_high_confidence');
const renamedNeedsReview = inventory.filter((item) => item.status === 'renamed_needs_review');
const repoOnlyStale = inventory.filter((item) => item.status === 'repo_only_unmapped');

const output = {
  generated_at: new Date().toISOString(),
  figma_names_source: figmaNamesPath || 'built-in-defaults',
  summary: {
    repo_regular_count: regularRepoNames.length,
    repo_bold_count: boldRepoNames.length,
    figma_component_set_count: figmaNames.length,
    exact_name_match_count: exactMatches.length,
    renamed_high_confidence_count: renamedHighConfidence.length,
    renamed_needs_review_count: renamedNeedsReview.length,
    repo_only_unmapped_count: repoOnlyStale.length,
    figma_only_new_or_unmapped_count: figmaOnly.length,
  },
  notes: [
    'This inventory compares current repo filenames to Figma component set names from the Functional icons page.',
    'Figma names were normalized to kebab-case for comparison, and -mds suffixes were stripped before matching.',
    'A few names in Figma collide after normalization, for example Check and Check-mds both normalize to check.',
    'High-confidence renames are intended to be safe for bulk rename planning. Needs-review entries should be spot-checked in Figma before applying.',
  ],
  exact_matches: exactMatches,
  renamed_high_confidence: renamedHighConfidence,
  renamed_needs_review: renamedNeedsReview,
  repo_only_stale: repoOnlyStale,
  repo_inventory: inventory,
  figma_only: figmaOnly,
};

const csvRows = [
  ['repo_name', 'proposed_figma_name', 'status', 'confidence', 'notes'],
  ...inventory.map((item) => [
    item.repo_name,
    item.proposed_figma_name,
    item.status,
    item.confidence,
    item.notes || '',
  ]),
  ...figmaOnly.map((item) => [
    '',
    item.normalized_name,
    item.status,
    'n/a',
    item.figma_name,
  ]),
];

fs.writeFileSync(outJson, `${JSON.stringify(output, null, 2)}\n`);
fs.writeFileSync(
  outCsv,
  `${csvRows.map((row) => row.map(escapeCsv).join(',')).join('\n')}\n`
);

console.log(`Wrote ${outJson}`);
console.log(`Wrote ${outCsv}`);
