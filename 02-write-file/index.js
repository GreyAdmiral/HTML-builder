const path = require('path');
const fs = require('fs');
const readline = require('readline');
const file = path.join(__dirname, '02-write-file.txt');

console.log('Привет!\n');

fs.writeFile(file, '', (err) => {
  if (err) {
    throw err;
  }
});

process.on('exit', () => {
  console.log('\nПока!');
});

interface();

function appendText(text) {
  fs.appendFile(file, text + '\n', (err) => {
    if (err) {
      throw err;
    }
  });
}

function interface() {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Введите текст: ', (text) => {
    if (text == 'exit') {
      rl.close();
    } else {
      appendText(text);
      rl.close();
      interface();
    }
  });
}
