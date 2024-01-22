const path = require('path');
const fs = require('fs');

const folder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

fs.mkdir(copyFolder, { recursive: true }, (err) => {
  if (err) {
    throw err;
  }
});

fs.readdir(folder, (err, files) => {
  if (err) {
    throw err;
  }

  files.forEach((it) => {
    fs.copyFile(path.join(folder, it), path.join(copyFolder, it), (err) => {
      if (err) {
        throw err;
      }
    });
  });
});

fs.watch(folder, (event, file) => {
  if (file && event == 'change') {
    const stream = fs.createReadStream(path.join(folder, file), {
      encoding: 'utf-8',
    });
    stream.on('data', (cnt) => {
      const wrStream = fs.createWriteStream(path.join(copyFolder, file));
      wrStream.write(cnt);
      wrStream.end();
    });
    stream.on('error', (err) => {
      throw err;
    });
  } else if (event == 'rename') {
    fs.access(path.join(folder, file), (err) => {
      const isF = !err;

      fs.access(path.join(copyFolder, file), (err) => {
        const isCpF = !err;

        if (isF) {
          fs.copyFile(
            path.join(folder, file),
            path.join(copyFolder, file),
            (err) => {
              if (err) {
                throw err;
              }
            },
          );
        } else if (isCpF) {
          fs.rm(path.join(copyFolder, file), (err) => {
            if (err) {
              throw err;
            }
          });
        }
      });
    });
  }
});
