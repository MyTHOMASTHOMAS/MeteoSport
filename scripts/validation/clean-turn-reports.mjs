import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve(process.cwd(), 'out', 'validation-specs');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Supprime les rapports de travail du tour précédent
const reportsToClean = ['rapport-chercheur.md', 'rapport-verificateur.md'];
for (const file of reportsToClean) {
  const target = path.join(outDir, file);
  if (fs.existsSync(target)) {
    fs.unlinkSync(target);
    console.log(`[CLEAN] Supprimé : ${file}`);
  }
}
console.log('[CLEAN] Rapports temporaires réinitialisés pour le nouveau tour.');

