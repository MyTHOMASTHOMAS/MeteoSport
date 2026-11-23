#!/usr/bin/env node
/**
 * scripts/bundle-doc/bundle-raw.mjs
 *
 * Bundle la documentation et les sources du projet MeteoSport en fichiers
 * Markdown `raw_{N}.md` (pour revue, archivage ou injection agent).
 *
 * Usage (depuis la racine du dépôt) :
 *   node scripts/bundle-doc/bundle-raw.mjs
 *   node scripts/bundle-doc/bundle-raw.mjs -c default
 *   node scripts/bundle-doc/bundle-raw.mjs --config specs
 *   node scripts/bundle-doc/bundle-raw.mjs -f tdd/specs,tdd/docs/adr
 *   node scripts/bundle-doc/bundle-raw.mjs --folder tdd/docs/signature
 *
 * Options :
 *   -c, --config <nom>    Nom du fichier JSON dans scripts/bundle-doc/config/ (ou chemin direct).
 *                         Valeur par défaut : "default.json".
 *   -f, --folder <liste>  Dossiers relatifs séparés par des virgules, dans l'ordre
 *                         d'insertion (parcours récursif). Si spécifié, l'option -c est ignorée.
 *   -o, --out-dir <dir>   Dossier de sortie (défaut : out/bundle-doc).
 *   -m, --max-lines <n>   Plafond de lignes par raw_{N}.md (défaut : 2000 ou config).
 *   -h, --help            Affiche l'aide détaillée.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Chemins & Constantes d'environnement
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCRIPT_DIR = __dirname;
const CONFIG_DIR = path.join(SCRIPT_DIR, 'config');
const DEFAULT_CONFIG_FILE = path.join(CONFIG_DIR, 'default.json');
const NO_INCLUDE_FILE = fs.existsSync(path.join(SCRIPT_DIR, 'no_include.txt'))
  ? path.join(SCRIPT_DIR, 'no_include.txt')
  : path.join(CONFIG_DIR, 'no_include.txt');

// La racine du projet est 2 niveaux au-dessus (workspace)
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..', '..');
const DEFAULT_OUTPUT_DIR = path.join(PROJECT_ROOT, 'out', 'bundle-doc');

/** Nombre maximal de lignes par défaut dans un même `raw_{N}.md` (surchargeable via config ou CLI). */
const DEFAULT_MAX_LINES_PER_FILE = 2000;

/**
 * Ordre préférentiel des spécifications dans `tdd/specs` (stem sans extension).
 * Les fichiers non listés passent après, par ordre alphabétique naturel.
 * Adapter cette liste quand les domaines MeteoSport sont figés.
 */
const SPEC_FILE_ORDER = ['sommaire'];

/**
 * Ordre préférentiel des signatures d'architecture dans `tdd/docs/signature`.
 * Adapter quand les couches `src/` sont définies.
 */
const SIGNATURE_FILE_ORDER = [
  'signature',
  'signature-src',
  'signature-types',
  'signature-config',
  'signature-utils',
  'signature-domain',
  'signature-lib',
  'signature-services',
  'signature-controllers',
  'signature-ui',
];

/** Motifs de noms de fichiers à exclure (sur le basename). */
const EXCLUDE_BASENAME_PATTERNS = [/template/i];

// ---------------------------------------------------------------------------
// Gestion de la Configuration & Exclusions (no_include.txt)
// ---------------------------------------------------------------------------

/**
 * Charge les règles d'exclusion depuis `no_include.txt`.
 * - Lignes débutant par '/' ou contenant '/' : motifs de dossiers / chemins exclus.
 * - Lignes avec joker '*' : motifs de nom de fichier (ex: .env*).
 * - Lignes avec '.' sans autre point : extensions de fichiers (ex: .png, .svg).
 * - Autres lignes : noms de fichiers exacts (ex: package-lock.json).
 *
 * @param {string} filePath
 * @returns {{
 *   extensions: Set<string>,
 *   dirPatterns: Array<string>,
 *   basenames: Set<string>,
 *   basenamePatterns: Array<RegExp>
 * }}
 */
function loadNoIncludeRules(filePath) {
  const extensions = new Set();
  const dirPatterns = [];
  const basenames = new Set();
  const basenamePatterns = [];

  if (!fs.existsSync(filePath)) {
    console.warn(
      `[warn] Fichier d'exclusions introuvable : ${filePath} (aucune exclusion appliquée)`,
    );
    return { extensions, dirPatterns, basenames, basenamePatterns };
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    // 1. Dossier ou sous-chemin (commence par '/' ou contient '/')
    if (trimmed.startsWith('/') || trimmed.includes('/')) {
      const clean = trimmed
        .replace(/\\/g, '/')
        .replace(/^\/+|\/+$/g, '')
        .toLowerCase();
      if (clean) {
        dirPatterns.push('/' + clean + '/');
      }
      continue;
    }

    // 2. Motif wildcard sur le nom de fichier (ex: .env*, *.lock)
    if (trimmed.includes('*')) {
      const regexStr = '^' + trimmed.replace(/\./g, '\\.').replace(/\*/g, '.*') + '$';
      basenamePatterns.push(new RegExp(regexStr, 'i'));
      continue;
    }

    // 3. Dotfiles (basename exact) — path.extname('.gitkeep') === '' en Node
    const DOTFILE_BASENAMES = new Set([
      '.gitkeep',
      '.ds_store',
      '.gitignore',
      '.gitattributes',
      '.editorconfig',
      '.npmrc',
      '.nvmrc',
      '.gitmessage',
    ]);
    if (DOTFILE_BASENAMES.has(trimmed.toLowerCase())) {
      basenames.add(trimmed.toLowerCase());
      continue;
    }

    // 4. Extension pure (commence par '.' et ne contient pas d'autres points, ex: .png, .svg)
    if (trimmed.startsWith('.') && !trimmed.slice(1).includes('.')) {
      extensions.add(trimmed.toLowerCase());
      continue;
    }

    // 5. Nom de fichier exact (ex: package-lock.json, Thumbs.db)
    basenames.add(trimmed.toLowerCase());
  }

  return { extensions, dirPatterns, basenames, basenamePatterns };
}

/**
 * Vérifie si un chemin de dossier correspond à l'un des motifs de dossier exclus.
 * Correspondance par segment n'importe où dans l'arborescence (ex: /out ou /scripts/bundle-doc/config).
 *
 * @param {string} absoluteDirPath
 * @param {Array<string>} dirPatterns
 * @returns {boolean}
 */
function isExcludedDir(absoluteDirPath, dirPatterns) {
  if (!dirPatterns || dirPatterns.length === 0) return false;
  const rel = toPosixRelative(absoluteDirPath).toLowerCase();
  const normalized = '/' + rel.replace(/^\/+|\/+$/g, '') + '/';

  for (const pattern of dirPatterns) {
    if (normalized.includes(pattern)) {
      return true;
    }
  }
  return false;
}

/**
 * Résout le chemin absolu du fichier de configuration JSON demandé.
 * @param {string|null} configArg
 * @returns {string}
 */
function resolveConfigFile(configArg) {
  if (!configArg) {
    return DEFAULT_CONFIG_FILE;
  }

  // 1. Chemin direct existant (absolu ou relatif au CWD)
  if (path.isAbsolute(configArg) && fs.existsSync(configArg)) {
    return configArg;
  }
  const fromCwd = path.resolve(process.cwd(), configArg);
  if (fs.existsSync(fromCwd)) {
    return fromCwd;
  }

  // 2. Recherche dans CONFIG_DIR avec ou sans extension .json
  const inConfigDir = path.join(CONFIG_DIR, configArg);
  if (fs.existsSync(inConfigDir)) {
    return inConfigDir;
  }
  if (!configArg.endsWith('.json')) {
    const withExt = path.join(CONFIG_DIR, `${configArg}.json`);
    if (fs.existsSync(withExt)) {
      return withExt;
    }
  }

  // Erreur détaillée avec listing des configs disponibles
  let available = [];
  if (fs.existsSync(CONFIG_DIR)) {
    available = fs.readdirSync(CONFIG_DIR).filter((f) => f.endsWith('.json'));
  }

  console.error(`[err] Fichier de configuration introuvable : "${configArg}"`);
  console.error(`      Dossier de recherche : ${CONFIG_DIR}`);
  console.error(
    `      Configurations disponibles : ${available.length > 0 ? available.join(', ') : 'aucune'}`,
  );
  process.exit(1);
}

/**
 * Parse et valide un plafond de lignes (entier strictement positif).
 * @param {unknown} value
 * @param {string} sourceLabel
 * @returns {number|null} null si absent / non fourni
 */
function parseMaxLines(value, sourceLabel) {
  if (value === undefined || value === null) return null;
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(n) || n < 1) {
    console.error(
      `[err] ${sourceLabel} : maxLines doit être un entier ≥ 1 (reçu : ${JSON.stringify(value)})`,
    );
    process.exit(1);
  }
  return n;
}

/**
 * Charge et valide la configuration JSON (dossiers + options).
 * Formats acceptés :
 *   - tableau de dossiers (rétrocompat)
 *   - objet `{ "maxLines": 2000, "folders": [ ... ] }`
 *
 * @param {string} configPath
 * @returns {{
 *   folders: Array<{ path: string, recursive: boolean }>,
 *   maxLines: number
 * }}
 */
function loadFolderConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    console.error(`[err] Fichier de configuration introuvable : ${configPath}`);
    process.exit(1);
  }

  let content;
  try {
    content = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[err] Erreur de parsing JSON dans ${configPath} : ${msg}`);
    process.exit(1);
  }

  const rawList = Array.isArray(content)
    ? content
    : content && typeof content === 'object' && Array.isArray(content.folders)
      ? content.folders
      : null;

  if (!rawList) {
    console.error(
      `[err] Le fichier ${configPath} doit contenir un tableau de dossiers (ou un objet avec la clé "folders").`,
    );
    process.exit(1);
  }

  let maxLines = DEFAULT_MAX_LINES_PER_FILE;
  if (!Array.isArray(content) && content && typeof content === 'object') {
    const rawMax =
      content.maxLines !== undefined
        ? content.maxLines
        : content.max_lines !== undefined
          ? content.max_lines
          : content.maxLinesPerFile;
    const parsed = parseMaxLines(rawMax, path.basename(configPath));
    if (parsed !== null) maxLines = parsed;
  }

  const normalized = [];
  for (const item of rawList) {
    if (typeof item === 'string') {
      const p = item.trim().replace(/\\/g, '/').replace(/\/+$/, '');
      if (p) normalized.push({ path: p, recursive: true });
    } else if (item && typeof item === 'object' && typeof item.path === 'string') {
      const p = item.path.trim().replace(/\\/g, '/').replace(/\/+$/, '');
      if (p) {
        normalized.push({
          path: p,
          recursive: item.recursive !== false,
        });
      }
    }
  }

  if (normalized.length === 0) {
    console.error(`[err] Aucun dossier valide trouvé dans la configuration : ${configPath}`);
    process.exit(1);
  }

  return { folders: normalized, maxLines };
}

// ---------------------------------------------------------------------------
// Utilitaires de Filtrage & Traitement des Fichiers
// ---------------------------------------------------------------------------

function isExcludedBasename(basename) {
  return EXCLUDE_BASENAME_PATTERNS.some((re) => re.test(basename));
}

function isCompatibleFile(absolutePath, noIncludeRules) {
  const basename = path.basename(absolutePath);
  const lowerBase = basename.toLowerCase();

  // 1. Motifs basenames prédéfinis (ex: /template/i)
  if (isExcludedBasename(basename)) return false;

  // 2. Basename exact (ex: package-lock.json, .DS_Store)
  if (noIncludeRules.basenames && noIncludeRules.basenames.has(lowerBase)) {
    return false;
  }

  // 3. Motifs dynamiques sur basename (ex: .env*)
  if (
    noIncludeRules.basenamePatterns &&
    noIncludeRules.basenamePatterns.some((re) => re.test(basename))
  ) {
    return false;
  }

  // 4. Dossier parent exclu
  if (isExcludedDir(path.dirname(absolutePath), noIncludeRules.dirPatterns)) {
    return false;
  }

  // 5. Extension exclue (ex: .svg, .png, .pdf)
  const ext = path.extname(absolutePath).toLowerCase();
  if (ext && noIncludeRules.extensions.has(ext)) {
    return false;
  }

  return true;
}

function fenceLanguage(filePath) {
  const basename = path.basename(filePath).toLowerCase();
  if (basename === '.gitignore') return 'gitignore';

  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.md': 'markdown',
    '.puml': 'plantuml',
    '.json': 'json',
    '.yml': 'yaml',
    '.yaml': 'yaml',
    '.toml': 'toml',
    '.txt': 'text',
    '.js': 'javascript',
    '.cjs': 'javascript',
    '.mjs': 'javascript',
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.jsx': 'javascript',
    '.vue': 'html',
    '.java': 'java',
    '.rs': 'rust',
    '.sh': 'bash',
    '.bash': 'bash',
    '.sql': 'sql',
    '.xml': 'xml',
    '.html': 'html',
    '.css': 'css',
  };

  if (map[ext]) return map[ext];
  return ext.startsWith('.') ? ext.slice(1) : '';
}

function toPosixRelative(absolutePath) {
  return path.relative(PROJECT_ROOT, absolutePath).split(path.sep).join('/');
}

/**
 * Collecte les fichiers compatibles sous `absoluteDir`.
 * @param {string} absoluteDir
 * @param {boolean} recursive
 * @param {{ extensions: Set<string>, dirPatterns: Array<string>, basenames: Set<string>, basenamePatterns: Array<RegExp> }} noIncludeRules
 * @returns {string[]}
 */
function collectFiles(absoluteDir, recursive = true, noIncludeRules) {
  if (!fs.existsSync(absoluteDir)) {
    console.warn(`[skip] cible introuvable : ${toPosixRelative(absoluteDir)}`);
    return [];
  }

  // Prise en charge d'un fichier direct
  const stat = fs.statSync(absoluteDir);
  if (stat.isFile()) {
    if (isCompatibleFile(absoluteDir, noIncludeRules)) {
      return [absoluteDir];
    }
    return [];
  }

  // Élagage immédiat si le dossier racine lui-même est exclu
  if (isExcludedDir(absoluteDir, noIncludeRules.dirPatterns)) {
    return [];
  }

  const results = [];

  function walk(dir, descend) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!descend) continue;
        if (isExcludedDir(full, noIncludeRules.dirPatterns)) continue;
        walk(full, true);
        continue;
      }

      if (!entry.isFile()) continue;
      if (!isCompatibleFile(full, noIncludeRules)) continue;
      results.push(full);
    }
  }

  walk(absoluteDir, recursive);
  return results;
}

function sortKeyForFile(absolutePath) {
  const rel = toPosixRelative(absolutePath);
  const posix = rel.split('/');

  // Tri déterministe dans tdd/specs
  if (posix[0] === 'tdd' && posix[1] === 'specs' && posix.length === 3) {
    const stem = path.basename(absolutePath, path.extname(absolutePath));
    const idx = SPEC_FILE_ORDER.indexOf(stem);
    const rank = idx === -1 ? SPEC_FILE_ORDER.length : idx;
    return `tdd/specs/${String(rank).padStart(3, '0')}_${stem}`;
  }

  // Tri déterministe dans tdd/docs/signature
  if (posix[0] === 'tdd' && posix[1] === 'docs' && posix[2] === 'signature' && posix.length === 4) {
    const stem = path.basename(absolutePath, path.extname(absolutePath));
    const idx = SIGNATURE_FILE_ORDER.indexOf(stem);
    const rank = idx === -1 ? SIGNATURE_FILE_ORDER.length : idx;
    return `tdd/docs/signature/${String(rank).padStart(3, '0')}_${stem}`;
  }

  return rel.toLowerCase();
}

function sortFiles(files) {
  return files.slice().sort((a, b) => {
    const ka = sortKeyForFile(a);
    const kb = sortKeyForFile(b);
    if (ka < kb) return -1;
    if (ka > kb) return 1;
    return toPosixRelative(a).localeCompare(toPosixRelative(b), undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  });
}

function normalizeContent(raw) {
  const normalized = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  return normalized.endsWith('\n') ? normalized.slice(0, -1) : normalized;
}

function demoteMarkdownHeadings(markdown, levels = 2) {
  const lines = markdown.split('\n');
  let inFence = false;
  let fenceChar = '';
  let fenceLen = 0;
  const out = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const fenceMatch = /^(`{3,}|~{3,})/.exec(trimmed);

    if (fenceMatch) {
      const matchFence = fenceMatch[1];
      if (!inFence) {
        inFence = true;
        fenceChar = matchFence[0];
        fenceLen = matchFence.length;
      } else if (matchFence[0] === fenceChar && matchFence.length >= fenceLen) {
        inFence = false;
        fenceChar = '';
        fenceLen = 0;
      }
      out.push(line);
      continue;
    }

    if (!inFence) {
      const match = /^(#{1,6})(\s+.*)$/.exec(line);
      if (match) {
        const hashes = match[1];
        const rest = match[2];
        const nextLevel = Math.min(6, hashes.length + levels);
        out.push('#'.repeat(nextLevel) + rest);
        continue;
      }
    }

    out.push(line);
  }

  return out.join('\n');
}

function isMarkdownFile(filePath) {
  return path.extname(filePath).toLowerCase() === '.md';
}

function buildFileBlock(absolutePath) {
  const rel = toPosixRelative(absolutePath);
  const safeContent = normalizeContent(fs.readFileSync(absolutePath, 'utf8'));

  let text;
  if (isMarkdownFile(absolutePath)) {
    const body = demoteMarkdownHeadings(safeContent, 2);
    text = [
      `## \`${rel}\``,
      '',
      `<!-- raw:begin ${rel} -->`,
      '',
      '---',
      '',
      body,
      '',
      '---',
      '',
      `<!-- raw:end ${rel} -->`,
      '',
    ].join('\n');
  } else {
    const lang = fenceLanguage(absolutePath);
    text = [`## \`${rel}\``, '', '```' + lang, safeContent, '```', ''].join('\n');
  }

  const lineCount = text.split('\n').length;
  return { text, lineCount, rel };
}

// ---------------------------------------------------------------------------
// Writer : découpe en raw_{N}.md et génération de sommaire.md
// ---------------------------------------------------------------------------

function ensureOutputDir(outputDir) {
  fs.mkdirSync(outputDir, { recursive: true });
  for (const name of fs.readdirSync(outputDir)) {
    if (/^raw_\d+\.md$/i.test(name) || /^tome_\d+.*\.md$/i.test(name) || name === 'sommaire.md') {
      fs.unlinkSync(path.join(outputDir, name));
    }
  }
}

/**
 * Écrit les fichiers `raw_{N}.md` ainsi qu'un index `sommaire.md`.
 *
 * @param {Array<string>} files
 * @param {number} maxLines
 * @param {string} outputDir
 * @param {string} modeLabel
 */
function writeBundles(files, maxLines, outputDir, modeLabel) {
  ensureOutputDir(outputDir);

  let fileIndex = 1;
  let currentLines = 0;
  let currentChunks = [];
  let filesInCurrent = 0;
  let totalFiles = 0;
  const partsSummary = [];

  function flush() {
    if (currentChunks.length === 0) return;

    const fileName = `raw_${fileIndex}.md`;
    const header = [
      `# Bundle brut — partie ${fileIndex}`,
      '',
      `> Généré automatiquement par \`scripts/bundle-doc/bundle-raw.mjs\`.`,
      `> Source : **${modeLabel}** | Fichiers inclus dans cette partie : **${filesInCurrent}**.`,
      '',
      '---',
      '',
    ].join('\n');

    const body = currentChunks.join('\n');
    const outPath = path.join(outputDir, fileName);
    const fullContent = header + body;
    const finalLineCount = fullContent.split('\n').length;

    fs.writeFileSync(outPath, fullContent, 'utf8');
    console.log(
      `[ok] ${path.relative(PROJECT_ROOT, outPath)} (${filesInCurrent} fichier(s), ${finalLineCount} lignes)`,
    );

    partsSummary.push({
      fileName,
      partIndex: fileIndex,
      fileCount: filesInCurrent,
      lineCount: finalLineCount,
    });

    fileIndex += 1;
    currentLines = 0;
    currentChunks = [];
    filesInCurrent = 0;
  }

  for (const absolutePath of files) {
    const { text, lineCount, rel } = buildFileBlock(absolutePath);

    if (lineCount > maxLines) {
      flush();
      currentChunks.push(text);
      currentLines = lineCount;
      filesInCurrent = 1;
      totalFiles += 1;
      console.warn(
        `[warn] ${rel} dépasse ${maxLines} lignes (${lineCount}) — placé seul dans raw_${fileIndex}.md (non tronqué)`,
      );
      flush();
      continue;
    }

    if (currentLines > 0 && currentLines + lineCount > maxLines) {
      flush();
    }

    currentChunks.push(text);
    currentLines += lineCount;
    filesInCurrent += 1;
    totalFiles += 1;
  }

  flush();

  // Génération du sommaire récapitulatif
  const totalParts = partsSummary.length;
  const totalLines = partsSummary.reduce((acc, p) => acc + p.lineCount, 0);

  const sommaireLines = [
    '# Sommaire du bundle brut — MeteoSport',
    '',
    `> Date de génération : ${new Date().toISOString()}  `,
    `> Mode d'exportation : \`${modeLabel}\`  `,
    `> Total : **${totalFiles}** fichier(s) répartis en **${totalParts}** partie(s) (~${totalLines} lignes).`,
    '',
    '---',
    '',
    '## Parties générées',
    '',
    '| Partie | Fichier | Nombre de fichiers | Nombre de lignes |',
    '| :---: | :--- | :---: | :---: |',
  ];

  for (const part of partsSummary) {
    sommaireLines.push(
      `| ${part.partIndex} | [${part.fileName}](./${part.fileName}) | ${part.fileCount} | ${part.lineCount} |`,
    );
  }

  sommaireLines.push('');
  const sommairePath = path.join(outputDir, 'sommaire.md');
  fs.writeFileSync(sommairePath, sommaireLines.join('\n'), 'utf8');
  console.log(`[ok] ${path.relative(PROJECT_ROOT, sommairePath)} (Index récapitulatif généré)`);

  return { parts: totalParts, totalFiles };
}

// ---------------------------------------------------------------------------
// CLI & Aide
// ---------------------------------------------------------------------------

function printHelp() {
  console.log(`Usage:
  node scripts/bundle-doc/bundle-raw.mjs [options]

Options:
  -c, --config <config>  Fichier de configuration JSON dans scripts/bundle-doc/config/ (ou chemin direct).
                         Valeur par défaut : "default.json".
  -f, --folder <liste>   Liste de dossiers relatifs séparés par des virgules, dans l'ordre d'insertion.
                         Si spécifié, l'option -c est ignorée.
  -o, --out-dir <dir>    Dossier de sortie (défaut : out/bundle-doc).
  -m, --max-lines <n>    Plafond de lignes par raw_{N}.md (défaut : 2000 ou défini dans la config).
  -h, --help             Affiche cette aide.

Configurations prédéfinies (scripts/bundle-doc/config/) :
  - default.json         Documentation TDD (CDC, CR, ADR, specs, UML, signatures, prompts, cases)
  - docs.json            Documentation technique hors cases de test
  - kit.json             Kit tdd/ complet (README + docs + specs + cases)
  - all.json             Kit tdd/ + README racine + src/ + tests/ (quand présents)
  - project.json         Vue projet (README + tdd + configs racine + src + tests)
  - specs.json           Spécifications (tdd/specs)
  - signatures.json      Signatures d'architecture (tdd/docs/signature)
  - adr.json             Décisions d'architecture (tdd/docs/adr)
  - cdc.json             Cahier des charges (tdd/docs/cdc)
  - cr.json              Comptes-rendus d'entretiens (tdd/docs/cr)
  - uml.json             Diagrammes PlantUML (tdd/docs/uml)
  - prompt.json          Prompts agent (tdd/docs/prompt)
  - tests.json           Cas de test documentaires (tdd/tests)
  - src.json             Code source applicatif (src/)

Exemples :
  node scripts/bundle-doc/bundle-raw.mjs
  node scripts/bundle-doc/bundle-raw.mjs -c specs
  node scripts/bundle-doc/bundle-raw.mjs -c cr
  node scripts/bundle-doc/bundle-raw.mjs -f tdd/specs,tdd/docs/signature
  node scripts/bundle-doc/bundle-raw.mjs -c default -m 1500`);
}

/**
 * @returns {{
 *   folders: Array<{ path: string, recursive: boolean }>,
 *   mode: string,
 *   dedupe: boolean,
 *   maxLines: number,
 *   outputDir: string
 * }}
 */
function parseArgs(argv) {
  const args = argv.slice(2);
  let folderList = null;
  let configArg = null;
  let customMaxLines = null;
  let outputDir = DEFAULT_OUTPUT_DIR;

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === '-h' || arg === '--help') {
      printHelp();
      process.exit(0);
    }

    if (arg === '-o' || arg === '--out-dir') {
      const value = args[i + 1];
      if (!value || value.startsWith('-')) {
        console.error(`[err] ${arg} attend un chemin de dossier de sortie`);
        process.exit(1);
      }
      outputDir = path.resolve(PROJECT_ROOT, value);
      i += 1;
      continue;
    }

    if (arg.startsWith('-o=') || arg.startsWith('--out-dir=')) {
      outputDir = path.resolve(PROJECT_ROOT, arg.slice(arg.indexOf('=') + 1));
      continue;
    }

    if (arg === '-m' || arg === '--max-lines') {
      const value = args[i + 1];
      const parsed = parseMaxLines(value, 'CLI -m/--max-lines');
      if (parsed === null) process.exit(1);
      customMaxLines = parsed;
      i += 1;
      continue;
    }

    if (arg.startsWith('-m=') || arg.startsWith('--max-lines=')) {
      const value = arg.slice(arg.indexOf('=') + 1);
      const parsed = parseMaxLines(value, 'CLI -m/--max-lines');
      if (parsed === null) process.exit(1);
      customMaxLines = parsed;
      continue;
    }

    if (arg === '-f' || arg === '--folder') {
      const value = args[i + 1];
      if (!value || value.startsWith('-')) {
        console.error(`[err] ${arg} attend une liste : path/a,path/b,...`);
        process.exit(1);
      }
      folderList = value;
      i += 1;
      continue;
    }

    if (arg.startsWith('-f=') || arg.startsWith('--folder=')) {
      folderList = arg.slice(arg.indexOf('=') + 1);
      continue;
    }

    if (arg === '-c' || arg === '--config') {
      const value = args[i + 1];
      if (!value || value.startsWith('-')) {
        console.error(`[err] ${arg} attend un nom de configuration (ex: default ou specs)`);
        process.exit(1);
      }
      configArg = value;
      i += 1;
      continue;
    }

    if (arg.startsWith('-c=') || arg.startsWith('--config=')) {
      configArg = arg.slice(arg.indexOf('=') + 1);
      continue;
    }

    console.error(`[err] argument inconnu : ${arg}`);
    printHelp();
    process.exit(1);
  }

  // Règle : Si -f est fourni, -c est ignoré
  if (folderList !== null) {
    if (configArg !== null) {
      console.warn(
        `[warn] L'option -f/--folder est fournie : l'option -c/--config ("${configArg}") est ignorée.`,
      );
    }

    const folders = folderList
      .split(',')
      .map((p) => p.trim().replace(/\\/g, '/').replace(/\/+$/, ''))
      .filter((p) => p.length > 0)
      .map((p) => ({ path: p, recursive: true }));

    if (folders.length === 0) {
      console.error('[err] -f/--folder : liste vide après parsing');
      process.exit(1);
    }

    return {
      folders,
      mode: `CLI (-f/--folder: ${folderList})`,
      dedupe: false,
      maxLines: customMaxLines || DEFAULT_MAX_LINES_PER_FILE,
      outputDir,
    };
  }

  // Mode Configuration JSON
  const resolvedPath = resolveConfigFile(configArg);
  const { folders, maxLines: configMaxLines } = loadFolderConfig(resolvedPath);
  const configLabel = path.relative(PROJECT_ROOT, resolvedPath);

  return {
    folders,
    mode: `Configuration JSON (${configLabel})`,
    dedupe: true,
    maxLines: customMaxLines || configMaxLines,
    outputDir,
  };
}

// ---------------------------------------------------------------------------
// Point d'Entrée Principal
// ---------------------------------------------------------------------------

function main() {
  const { folders, mode, dedupe, maxLines, outputDir } = parseArgs(process.argv);
  const noIncludeRules = loadNoIncludeRules(NO_INCLUDE_FILE);

  console.log(`Racine projet : ${PROJECT_ROOT}`);
  console.log(`Sortie        : ${path.relative(PROJECT_ROOT, outputDir)}`);
  console.log(`Plafond       : ${maxLines} lignes / raw_N.md`);
  console.log(`Mode          : ${mode}`);
  console.log(
    `Exclusions    : ${noIncludeRules.dirPatterns.length} motif(s) de dossier, ` +
      `${noIncludeRules.extensions.size} extension(s), ` +
      `${noIncludeRules.basenames.size + noIncludeRules.basenamePatterns.length} fichier(s)/motif(s)`,
  );
  console.log(`Dédoublonnage : ${dedupe ? 'oui' : 'non (doublons autorisés)'}`);
  console.log('Ordre cibles :');
  for (const entry of folders) {
    const abs = path.join(PROJECT_ROOT, entry.path);
    const isFile = fs.existsSync(abs) && fs.statSync(abs).isFile();
    const suffix = isFile ? '' : '/';
    const modeDesc = isFile ? 'fichier' : entry.recursive === false ? 'fichiers seuls' : 'récursif';
    console.log(`  - ${entry.path}${suffix}  (${modeDesc})`);
  }
  console.log('');

  const seen = new Set();
  const allFiles = [];

  for (const entry of folders) {
    const abs = path.join(PROJECT_ROOT, entry.path);
    const isFile = fs.existsSync(abs) && fs.statSync(abs).isFile();
    const suffix = isFile ? '' : '/';
    const recursive = entry.recursive !== false;
    const found = sortFiles(collectFiles(abs, recursive, noIncludeRules));
    let added = 0;

    for (const file of found) {
      const key = toPosixRelative(file);
      if (dedupe) {
        if (seen.has(key)) continue;
        seen.add(key);
      }
      allFiles.push(file);
      added += 1;
    }

    console.log(`[scan] ${entry.path}${suffix} → ${added} fichier(s)`);
  }

  if (allFiles.length === 0) {
    console.error('[err] aucun fichier à exporter — vérifiez les dossiers et no_include.txt');
    process.exit(1);
  }

  const { parts, totalFiles } = writeBundles(allFiles, maxLines, outputDir, mode);
  console.log('');
  console.log(
    `[done] ${totalFiles} fichier(s) exportés dans ${parts} partie(s) → ${path.relative(PROJECT_ROOT, outputDir)}/raw_*.md`,
  );
}

main();
