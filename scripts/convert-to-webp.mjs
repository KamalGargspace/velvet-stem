/**
 * Convert all PNG frames to WebP for dramatically smaller file sizes.
 * Transition frames (1920x1080) are also resized down to 1280x720.
 * 
 * Usage: node scripts/convert-to-webp.mjs
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const FRAMES_DIR = path.resolve('public/frames');
const WEBP_QUALITY = 80; // Good quality, major size savings
const TARGET_WIDTH = 1280;
const TARGET_HEIGHT = 720;

async function convertFolder(folderPath) {
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.png'));
  if (files.length === 0) return;

  const folderName = path.basename(folderPath);
  console.log(`\n📂 ${folderName}: ${files.length} PNGs`);

  let totalOriginal = 0;
  let totalConverted = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(folderPath, file);
    const outputFile = file.replace('.png', '.webp');
    const outputPath = path.join(folderPath, outputFile);

    const originalSize = fs.statSync(inputPath).size;
    totalOriginal += originalSize;

    // Get image dimensions to decide if we need to resize
    const metadata = await sharp(inputPath).metadata();
    
    let pipeline = sharp(inputPath);

    // Resize if larger than target (transition frames are 1920x1080)
    if (metadata.width > TARGET_WIDTH) {
      pipeline = pipeline.resize(TARGET_WIDTH, TARGET_HEIGHT, {
        fit: 'fill',
        kernel: sharp.kernel.lanczos3,
      });
    }

    await pipeline
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toFile(outputPath);

    const newSize = fs.statSync(outputPath).size;
    totalConverted += newSize;

    // Progress indicator
    if ((i + 1) % 20 === 0 || i === files.length - 1) {
      const pct = Math.round(((i + 1) / files.length) * 100);
      console.log(`   ✅ ${i + 1}/${files.length} (${pct}%)`);
    }
  }

  const savings = ((1 - totalConverted / totalOriginal) * 100).toFixed(1);
  console.log(`   📊 ${(totalOriginal / 1024 / 1024).toFixed(1)}MB → ${(totalConverted / 1024 / 1024).toFixed(1)}MB (${savings}% smaller)`);
}

async function main() {
  console.log('🌸 Velvet & Stem — Frame Optimizer');
  console.log('===================================');
  console.log(`Quality: ${WEBP_QUALITY} | Target: ${TARGET_WIDTH}x${TARGET_HEIGHT}`);

  const folders = fs.readdirSync(FRAMES_DIR)
    .map(f => path.join(FRAMES_DIR, f))
    .filter(f => fs.statSync(f).isDirectory());

  for (const folder of folders) {
    await convertFolder(folder);
  }

  // Now remove original PNGs
  console.log('\n🗑️  Removing original PNG files...');
  let removed = 0;
  for (const folder of folders) {
    const pngs = fs.readdirSync(folder).filter(f => f.endsWith('.png'));
    for (const png of pngs) {
      // Only remove if a .webp counterpart exists
      const webpPath = path.join(folder, png.replace('.png', '.webp'));
      if (fs.existsSync(webpPath)) {
        fs.unlinkSync(path.join(folder, png));
        removed++;
      }
    }
  }
  console.log(`   ✅ Removed ${removed} PNG files`);

  // Also convert phase5.jpeg to webp
  const phase5Jpeg = path.join(FRAMES_DIR, 'phase5', 'phase5.jpeg');
  if (fs.existsSync(phase5Jpeg)) {
    const phase5Webp = path.join(FRAMES_DIR, 'phase5', 'phase5.webp');
    await sharp(phase5Jpeg)
      .resize(TARGET_WIDTH, TARGET_HEIGHT, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toFile(phase5Webp);
    fs.unlinkSync(phase5Jpeg);
    console.log('   ✅ Converted phase5.jpeg → phase5.webp');
  }

  console.log('\n🎉 Done! All frames optimized to WebP.');
}

main().catch(console.error);
