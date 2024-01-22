const path = require('path');
const fs = require('fs');

const cssFolder = path.join(__dirname, 'styles');
const distFolder = path.join(__dirname, 'project-dist');
const bundlePath = path.join(distFolder, 'bundle.css');

fs.writeFile(bundlePath, '', (err) => {
  if (err) {
    throw err;
  }
});

fs.readdir(cssFolder, (err, files) => {
  if (err) {
    throw err;
  }

  files
    .filter((file) => path.extname(file) === '.css')
    .forEach((it) => {
      const stream = fs.createReadStream(path.join(cssFolder, it), {
        encoding: 'utf-8',
      });
      const wrStream = fs.createWriteStream(bundlePath, { flags: 'a' });
      stream.once('error', hError).pipe(wrStream).once('error', hError);
    });
});

function hError(err) {
  console.error('Error: ', err);
  this.destroy();
}
