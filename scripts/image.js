const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, '../source/_posts');
const targetDir = path.resolve(__dirname, '../public/posts');

function syncFolders() {
    fs.readdir(sourceDir, { withFileTypes: true }, (err, entries) => {
        if (err) {
            console.error('\x1b[35mERROR\x1b[0m Error reading source directory:', err);
            return;
        }

        entries.forEach(entry => {
            if (entry.isDirectory()) {
                const sourceFolder = path.join(sourceDir, entry.name);
                const targetFolder = path.join(targetDir, entry.name);

                fs.readdir(sourceFolder, (err, files) => {
                    if (err) {
                        console.error(`\x1b[35mERROR\x1b[0m Error reading folder ${sourceFolder}:`, err);
                        return;
                    }
                    if (files.length === 0) { return; }
                    if (!fs.existsSync(targetFolder)) {
                        fs.mkdirSync(targetFolder, { recursive: true });
                    }
                    files.forEach(file => {
                        const sourceFile = path.join(sourceFolder, file);
                        const targetFile = path.join(targetFolder, file);

                        if (!fs.existsSync(targetFile)) {
                            fs.copyFile(sourceFile, targetFile, err => {
                                if (err) {
                                    console.error(`\x1b[35mERROR\x1b[0m Error copying file ${sourceFile}:`, err);
                                }
                                else {
                                    console.log(`\x1b[33mINFO\x1b[0m  Copied：${sourceFile} -> ${targetFile}`);
                                }
                            });
                        }
                    });
                });
            }
        });
    });
    fs.readdir(targetDir, { withFileTypes: true }, (err, entries) => {
        if (err) {
            console.error('\x1b[35mERROR\x1b[0m Error reading target directory:', err);
            return;
        }

        entries.forEach(entry => {
            if (entry.isDirectory()) {
                const targetFolder = path.join(targetDir, entry.name);
                const sourceFolder = path.join(sourceDir, entry.name);

                if (!fs.existsSync(sourceFolder) && !fs.existsSync(sourceFolder + '.md')) {
                    fs.rm(targetFolder, { recursive: true, force: true }, err => {
                        if (err) {
                            console.error(`\x1b[35mERROR\x1b[0m Error deleting folder ${targetFolder}:`, err);
                        } else {
                            console.log(`\x1b[33mINFO\x1b[0m  Deleted folder: ${targetFolder}`);
                        }
                    });
                }
                fs.readdir(targetFolder, (err, files) => {
                    if (err) {
                        console.error(`\x1b[35mERROR\x1b[0m Error reading folder ${targetFolder}:`, err);
                        return;
                    }
                    files.forEach(file => {
                        const targetFile = path.join(targetFolder, file);
                        const sourceFile = path.join(sourceFolder, file);

                        if (!fs.existsSync(sourceFile) && !targetFile.includes('.html')) {
                            fs.unlink(targetFile, err => {
                                if (err) {
                                    console.error(`\x1b[35mERROR\x1b[0m Error deleting file ${targetFile}:`, err);
                                } else {
                                    console.log(`\x1b[33mINFO\x1b[0m  Deleted file: ${targetFile}`);
                                }
                            });
                        }
                    });
                });
            }
        });
    });
}

// Run the sync function
// syncFolders();

// 替代方案：_config.yml
// permalink: posts/:title -> _posts/:title
// include: "_posts/*/*"