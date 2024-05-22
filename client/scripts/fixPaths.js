const fs = require('fs');
const path = require('path');

// Define paths
const indexPath = path.join(__dirname, '..', 'build', 'index.html');
const faviconSource = path.join(__dirname, '..', '..', 'assets', 'icon.ico');
const faviconDestination = path.join(__dirname, '..', 'build', 'icon.ico');

// Copy favicon.ico from assets to the build directory
fs.copyFile(faviconSource, faviconDestination, (err) => {
  if (err) {
    return console.log('Error copying icon.ico:', err);
  }
  console.log('icon.ico copied successfully.');
});

// Read and update index.html
fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    return console.log('Error reading index.html:', err);
  }

  let result = data.replace(/"\/static\//g, '"./static/')
                   .replace(/"\/manifest.json"/g, '"./manifest.json"')
                   .replace(/"\/favicon.ico"/g, '"./icon.ico"')
                   .replace(/"\/logo192.png"/g, '"./logo192.png"');

  fs.writeFile(indexPath, result, 'utf8', (err) => {
    if (err) {
      return console.log('Error writing index.html:', err);
    }
    console.log('index.html paths updated successfully.');
  });
});
