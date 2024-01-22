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
            const arr = it.split('.');
            console.log(arr[0], '-', arr[1], '-', fstat.size + 'b');
          }
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
}
