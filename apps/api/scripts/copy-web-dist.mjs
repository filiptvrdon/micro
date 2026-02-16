import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.resolve(__dirname, '../../web/dist');
const targetDir = path.resolve(__dirname, '../public');

async function copyWebDist() {
  console.log(`Copying from ${sourceDir} to ${targetDir}...`);

  if (!fs.existsSync(sourceDir)) {
    console.error(`Error: Source directory "${sourceDir}" does not exist. Run "npm run build" in apps/web first.`);
    process.exit(1);
  }

  try {
    // Delete target directory if it exists to ensure a clean copy
    if (fs.existsSync(targetDir)) {
      console.log(`Cleaning target directory: ${targetDir}`);
      fs.rmSync(targetDir, { recursive: true, force: true });
    }

    // Create target directory
    fs.mkdirSync(targetDir, { recursive: true });

    // Copy files recursively
    fs.cpSync(sourceDir, targetDir, { recursive: true });

    console.log('Successfully copied frontend assets to API public folder.');
  } catch (error) {
    console.error('Error during copy:', error);
    process.exit(1);
  }
}

copyWebDist();
