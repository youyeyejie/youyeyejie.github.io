const fs = require('fs');
const path = require('path');

// Define the content and file path
const content = 'vercount-domain-verify=youyeyejie.github.io,cmd7ltmye0003ju07ty2d7nne';
const filePath1 = path.join(__dirname, '../.deploy_git/.well-known/vercount-verify-cmd7ltmye0003ju07ty2d7nne.txt');
const filePath2 = path.join(__dirname, '../.deploy_git/.nojekyll');

// Ensure the .well-known directory exists and write the content to the file
fs.mkdirSync(path.dirname(filePath1), { recursive: true });
fs.writeFileSync(filePath1, content);

// Create the .nojekyll file
fs.writeFileSync(filePath2, '');