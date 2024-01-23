const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const assets = path.join(__dirname, 'assets');
const cssFolder = path.join(__dirname, 'styles');
const components = path.join(__dirname, 'components');
const template = path.join(__dirname, 'template.html');
const distFolder = path.join(__dirname, 'project-dist');
const html = path.join(distFolder, 'index.html');
const bundleStyles = path.join(distFolder, 'style.css');
const bundleAssets = path.join(distFolder, 'assets');

fsPromises
  .mkdir(distFolder, { recursive: true })
  .catch((err) => console.error(err));

fsPromises
  .readFile(template, 'utf-8')
  .then((data) => {
    process.env.template = data;

    fsPromises.writeFile(html, '').then(() => {
      fsPromises.readdir(components).then((files) => {
        files.forEach((it) => {
          const fileInfo = path.parse(it);

          fsPromises
            .readFile(path.join(components, fileInfo.base), 'utf-8')
            .then((data) => {
              process.env.template = process.env.template.replaceAll(
                '{{' + fileInfo.name + '}}',
                data,
              );
              fs.writeFile(
                html,
                process.env.template,
                { flags: 'a' },
                (err) => {
                  if (err) {
                    throw err;
                  }
                },
              );
            });
        });
      });
    });
  })
  .catch((err) => {
    console.error(err);
  });

fsPromises
  .writeFile(bundleStyles, '')
  .then(() => {
    fsPromises.readdir(cssFolder).then((files) => {
      files
        .filter((file) => path.extname(file) === '.css')
        .forEach((it) => {
          const stream = fs.createReadStream(path.join(cssFolder, it), {
            encoding: 'utf-8',
          });
          const wrStream = fs.createWriteStream(bundleStyles, {
            flags: 'a',
          });
          stream.once('error', hError).pipe(wrStream).once('error', hError);
        });
    });
  })
  .catch((err) => console.error(err));

fs.access(assets, (err) => {
  if (!err) {
    statsCopy(assets, bundleAssets);
  }
});

function statsCopy(folder, buildFolder) {
  fsPromises
    .mkdir(buildFolder, { recursive: true })
    .then(() => {
      fsPromises.readdir(folder).then((files) => {
        files.forEach((it) => {
          fs.stat(path.join(folder, it), (err, fstat) => {
            if (err) {
              throw err;
            }

            if (fstat.isFile()) {
              fs.copyFile(
                path.join(folder, it),
                path.join(buildFolder, it),
                (err) => {
                  if (err) {
                    throw err;
                  }
                },
              );
            } else if (fstat.isDirectory()) {
              statsCopy(path.join(folder, it), path.join(buildFolder, it));
            }
          });
        });
      });
    })
    .catch((err) => console.error(err));
}

function hError(err) {
  console.error('Error: ', err);
  this.destroy();
}
