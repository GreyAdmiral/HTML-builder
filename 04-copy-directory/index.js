function folderSinchron() {
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

  fs.readdir(copyFolder, (err, files) => {
    if (err) {
      throw err;
    }

    files.forEach((it) => {
      fs.access(path.join(folder, it), (err) => {
        const isNotSource = !!err;

        if (isNotSource) {
          fs.rm(path.join(copyFolder, it), (err) => {
            if (err) {
              throw err;
            }
          });
        }
      });
    });
  });
}

folderSinchron();
