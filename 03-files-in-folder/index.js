const fs = require("fs");
const path = require("path");

const directory = path.resolve(`${__dirname}/secret-folder`);

fs.readdir(directory, (err, files) => {
  for (const file of files) {
    const filePath = path.join(directory, file)
    fs.stat(filePath, (err, stats) => {
      if (!stats.isDirectory()) {
        const ext = path.extname(file)
        const name = file.replace(ext, '')
        console.log(`${name} - ${ext.substring(1)} - ${stats.size/1024}kb`)
      }
    });
  }
});
