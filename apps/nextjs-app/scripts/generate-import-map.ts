import fs from 'node:fs/promises';
import path from 'node:path';
import child_process from 'node:child_process';
import url from 'node:url';

const spawnAsync = async (...args: Parameters<typeof child_process.spawn>) =>
  await new Promise<void>((resolve, reject) => {
    const cp = child_process.spawn(...args);
    cp.on('error', reject);
    cp.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Child process exited with code ${code}`));
      }
    });
  });

const importMapPath = path.join(
  url.fileURLToPath(import.meta.url),
  '../../src/app/(payload)/admin/importMap.js'
);

(async () => {
  try {
    await fs.access(importMapPath);
  } catch {
    await fs.writeFile(importMapPath, '');
  }
  await spawnAsync('payload', ['generate:importmap'], { stdio: 'inherit' });
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
