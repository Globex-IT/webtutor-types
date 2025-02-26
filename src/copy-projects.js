const fs = require('fs-extra');
const path = require('path');

async function copyTypes(directories) {
    for (const {sourceDir, destDir} of directories) {
        try {
            console.log(`Copying from ${sourceDir} to ${destDir}`);
            const files = await fs.readdir(sourceDir);

            await fs.ensureDir(destDir);

            for (const file of files) {
                const srcFile = path.join(sourceDir, file);
                const destFile = path.join(destDir, file);

                const stats = await fs.stat(srcFile);
                if (stats.isDirectory()) {
                    await fs.copy(srcFile, destFile);
                } else if (file.endsWith('.ts') || file.endsWith('.d.ts') || file.endsWith('.js')) {
                    await fs.copyFile(srcFile, destFile);
                }
            }
            console.log(`Files copied successfully from ${sourceDir} to ${destDir}`);
        } catch (err) {
            console.error(`Error copying files from ${sourceDir} to ${destDir}:`, err);
        }
    }
}


const directoriesToCopy = [{
    sourceDir: path.join(__dirname, '/web-soft'),
    destDir: path.join(__dirname, '../lib/web-soft')
}, {
    sourceDir: path.join(__dirname, '/ssjs'),
    destDir: path.join(__dirname, '../lib/ssjs')
}];

copyTypes(directoriesToCopy);