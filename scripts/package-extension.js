/**
 * PageFyre — Automated Extension Packaging Tool
 * 
 * Generates:
 * 1. .crx package (Production signed Chrome extension for direct distribution / enterprise deployment)
 * 2. .pem private key (Persists extension ID across updates)
 * 3. .zip package (Ready for Chrome Web Store Developer Dashboard upload)
 * 
 * Usage:
 *   node scripts/package-extension.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync, execFileSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const STAGE_DIR = path.join(DIST_DIR, 'pagefyre-build');

// Runtime extension items to include
const INCLUDE_DIRECTORIES = ['popup', 'themes', 'content', 'engine', 'icons'];
const INCLUDE_FILES = ['manifest.json'];

function log(msg, symbol = '🔥') {
  console.log(`${symbol} ${msg}`);
}

function findBrowserBinary() {
  const candidates = [
    // Google Chrome on Windows
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
    // Microsoft Edge on Windows (Chromium)
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    // macOS
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    // Linux
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ];

  for (const p of candidates) {
    if (p && fs.existsSync(p)) {
      return p;
    }
  }

  // Check PATH
  try {
    const whichCmd = process.platform === 'win32' ? 'where' : 'which';
    const out = execSync(`${whichCmd} chrome || ${whichCmd} google-chrome || ${whichCmd} msedge`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString().trim();
    const first = out.split(/\r?\n/)[0];
    if (first && fs.existsSync(first)) return first;
  } catch (e) {}

  return null;
}

function copyDirectory(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.name.startsWith('.') || entry.name.endsWith('.tmp')) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function createZipArchive(sourceDir, zipPath) {
  // Use Python zipfile if available, fallback to PowerShell or system zip
  const hasPython = (() => {
    try {
      execSync('python --version', { stdio: 'ignore' });
      return true;
    } catch (e) {
      return false;
    }
  })();

  if (hasPython) {
    const pyScript = `
import zipfile, os, sys
src = sys.argv[1]
out = sys.argv[2]
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(src):
        for f in files:
            full = os.path.join(root, f)
            rel = os.path.relpath(full, src)
            z.write(full, rel)
`;
    execFileSync('python', ['-c', pyScript, sourceDir, zipPath]);
    return true;
  }

  if (process.platform === 'win32') {
    const psCmd = `Compress-Archive -Path '${sourceDir}\\*' -DestinationPath '${zipPath}' -Force`;
    execSync(`powershell -NoProfile -Command "${psCmd}"`, { stdio: 'inherit' });
    return true;
  }

  execSync(`cd "${sourceDir}" && zip -r "${zipPath}" ./*`, { stdio: 'inherit' });
  return true;
}

function calculateSha256(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function main() {
  console.log('\n======================================================');
  console.log('⚡ PAGEFYRE — EXTENSION CRX & ZIP PACKAGING PIPELINE ⚡');
  console.log('======================================================\n');

  // 1. Read manifest.json
  const manifestPath = path.join(ROOT_DIR, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ Error: manifest.json not found in root directory!');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const version = manifest.version || '1.0.0';
  const name = 'pagefyre';

  log(`Target: ${manifest.name} (v${version})`);
  log(`Description: "${manifest.description}" (${manifest.description.length} chars)`);

  // 2. Prepare Clean Staging Directory
  if (fs.existsSync(STAGE_DIR)) {
    fs.rmSync(STAGE_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(STAGE_DIR, { recursive: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });

  log('Staging production runtime assets into dist/pagefyre-build...');
  for (const file of INCLUDE_FILES) {
    const src = path.join(ROOT_DIR, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(STAGE_DIR, file));
    }
  }

  for (const dir of INCLUDE_DIRECTORIES) {
    const src = path.join(ROOT_DIR, dir);
    if (fs.existsSync(src)) {
      copyDirectory(src, path.join(STAGE_DIR, dir));
    }
  }

  // 3. Generate Chrome Web Store ZIP Archive
  const versionedZip = path.join(DIST_DIR, `${name}-v${version}.zip`);
  const standardZip = path.join(DIST_DIR, `${name}.zip`);

  if (fs.existsSync(versionedZip)) fs.unlinkSync(versionedZip);
  if (fs.existsSync(standardZip)) fs.unlinkSync(standardZip);

  log('Creating clean ZIP archive for Chrome Web Store...');
  createZipArchive(STAGE_DIR, versionedZip);
  fs.copyFileSync(versionedZip, standardZip);
  const zipSize = fs.statSync(versionedZip).size;
  const zipHash = calculateSha256(versionedZip);
  log(`Created Web Store ZIP: ${path.basename(versionedZip)} (${formatBytes(zipSize)})`, '📦');

  // 4. Generate Packaged CRX File
  const browserBin = findBrowserBinary();
  const pemKeyPath = path.join(DIST_DIR, `${name}.pem`);
  const versionedCrx = path.join(DIST_DIR, `${name}-v${version}.crx`);
  const standardCrx = path.join(DIST_DIR, `${name}.crx`);

  if (!browserBin) {
    console.warn('\n⚠️ Warning: Chrome/Edge binary not detected on system PATH or default locations.');
    console.warn('   The Web Store ZIP archive was created successfully, but CRX requires Chromium.');
  } else {
    log(`Using Chromium browser engine: ${path.basename(browserBin)}`);
    const browserName = browserBin.toLowerCase().includes('edge') ? 'Edge' : 'Chrome';

    // Build pack arguments
    const args = [`--pack-extension=${STAGE_DIR}`, '--no-message-box'];
    if (fs.existsSync(pemKeyPath)) {
      log(`Reusing existing private key: ${path.basename(pemKeyPath)} (preserves extension ID)`);
      args.push(`--pack-extension-key=${pemKeyPath}`);
    } else {
      log('Generating new private signing key (.pem)...');
    }

    try {
      execFileSync(browserBin, args, { stdio: 'ignore' });
    } catch (err) {
      // Chromium pack-extension often returns non-zero even on success on Windows
    }

    // Chromium outputs files next to STAGE_DIR: e.g. dist/pagefyre-build.crx & dist/pagefyre-build.pem
    const producedCrx = path.join(DIST_DIR, 'pagefyre-build.crx');
    const producedPem = path.join(DIST_DIR, 'pagefyre-build.pem');

    if (fs.existsSync(producedPem) && !fs.existsSync(pemKeyPath)) {
      fs.renameSync(producedPem, pemKeyPath);
      log(`Saved persistent private key: ${path.basename(pemKeyPath)}`, '🔑');
    } else if (fs.existsSync(producedPem)) {
      fs.unlinkSync(producedPem);
    }

    if (fs.existsSync(producedCrx)) {
      if (fs.existsSync(versionedCrx)) fs.unlinkSync(versionedCrx);
      if (fs.existsSync(standardCrx)) fs.unlinkSync(standardCrx);

      fs.renameSync(producedCrx, versionedCrx);
      fs.copyFileSync(versionedCrx, standardCrx);

      const crxSize = fs.statSync(versionedCrx).size;
      const crxHash = calculateSha256(versionedCrx);
      log(`Created packaged CRX: ${path.basename(versionedCrx)} (${formatBytes(crxSize)})`, '🛡️');
      
      console.log('\n---------------- BUILD ARTIFACTS ----------------');
      console.log(`📦 Web Store ZIP: dist/${path.basename(versionedZip)}  (${formatBytes(zipSize)})`);
      console.log(`   SHA-256: ${zipHash}`);
      console.log(`🛡️ Packaged CRX:  dist/${path.basename(versionedCrx)}  (${formatBytes(crxSize)})`);
      console.log(`   SHA-256: ${crxHash}`);
      if (fs.existsSync(pemKeyPath)) {
        console.log(`🔑 Signing Key:   dist/${path.basename(pemKeyPath)} (Keep this private!)`);
      }
      console.log('-------------------------------------------------\n');
      
      console.log('💡 HOW TO INSTALL THE .CRX:');
      console.log('  1. Open Chrome and navigate to: chrome://extensions');
      console.log('  2. Enable "Developer mode" toggle (top-right corner)');
      console.log(`  3. Drag and drop dist/${path.basename(standardCrx)} into the chrome://extensions window\n`);
    } else {
      console.warn('⚠️ Note: Chromium finished packaging. If pagefyre-build.crx was not created, ensure no running Chrome instances lock file access.');
    }
  }

  // 5. Cleanup Staging Directory
  try {
    fs.rmSync(STAGE_DIR, { recursive: true, force: true });
  } catch (e) {}

  log('Build process completed successfully! ✨\n');
}

main().catch((err) => {
  console.error('Packaging failed with error:', err);
  process.exit(1);
});
