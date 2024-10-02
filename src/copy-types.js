// copy-types.js
const fs = require('fs-extra');
const path = require('path');

async function copyTypes() {
    const sourceDir = path.join(__dirname, '/web-soft');
    const destDir = path.join(__dirname, '../lib/web-soft');

    try {
        console.log(`Copying from ${sourceDir} to ${destDir}`);

        // Читаем содержимое исходной директории рекурсивно
        const files = await fs.readdir(sourceDir);

        // Создаем целевую директорию, если она не существует
        await fs.ensureDir(destDir);

        for (const file of files) {
            const srcFile = path.join(sourceDir, file);
            const destFile = path.join(destDir, file);

            const stats = await fs.stat(srcFile);
            if (stats.isDirectory()) {
                // Рекурсивно копируем директорию
                await fs.copy(srcFile, destFile);
            } else if (file.endsWith('.ts') || file.endsWith('.d.ts')) {
                // Копируем только .ts и .d.ts файлы
                await fs.copyFile(srcFile, destFile);
            }
        }
        console.log('Files copied successfully!');
    } catch (err) {
        console.error('Error copying files:', err);
    }
}

copyTypes();
