const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'client', 'build', 'index.html');

fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    return console.log(err);
  }

  const result = data.replace(/\/static\//g, './static/');

  fs.writeFile(indexPath, result, 'utf8', (err) => {
    if (err) return console.log(err);
  });
});
