const path = require('path');
const fs = require('fs');

const folder = path.join(__dirname, 'secret-folder');

statsLog(folder);

function statsLog(folder) {
  try {
    fs.readdir(folder, (err, files) => {
      if (err) {
        throw err;
      }

      files.forEach((it) => {
        fs.stat(path.join(folder, it), (err, fstat) => {
          if (err) {
            throw err;
          }

          if (!fstat.isDirectory()) {
            const info = path.parse(path.join(folder, it));
            console.log(info.name, '-', info.ext.slice(1), '-', fstat.size + 'b');
          }
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
}
