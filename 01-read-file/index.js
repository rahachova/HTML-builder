const fs = require('fs');
const path = require('path');

const stream = fs.createReadStream(
  path.resolve(`${__dirname}/text.txt`),
  'utf8',
);

stream.on('data', (data) => {
  process.stdout.write(data);
});
