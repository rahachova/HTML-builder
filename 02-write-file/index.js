const fs = require('fs')
const path = require('path');

const writeStream = fs.createWriteStream(path.resolve(`${__dirname}/userInput.txt`));

const exitProcess = () => {
  writeStream.end()
  process.stdout.write('Bye!');
  process.exit()
}

process.stdout.write('Hello! Enter your text below:' + '\n');

process.stdin.on('data', data => {
  if (data.includes('exit')) {
    exitProcess()
  } else {
    writeStream.write(data)
  }
})

process.on('SIGINT', exitProcess)