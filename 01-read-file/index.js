const path = require('path');
const fs = require('fs');

const file = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(file, { encoding: 'utf-8' });

stream.on('data', (buff) => {
  console.log(buff);
});
