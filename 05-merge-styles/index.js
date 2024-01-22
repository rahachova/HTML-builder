const fs = require("fs");
const path = require("path");

fs.unlink(path.resolve(`${__dirname}/project-dist/bundle.css`), (err) => {
  fs.readdir(path.resolve(`${__dirname}/styles`), (err, files) => {
    for (const file of files) {
      const filePath = path.join(path.resolve(`${__dirname}/styles`), file)
      if (path.extname(file) === '.css') {
        fs.stat(filePath, (err, stats) => {
          if (!stats.isDirectory()) {
            fs.readFile(path.join(path.resolve(`${__dirname}/styles`), file), 'utf8', (err, content) => {
              fs.appendFile(path.resolve(`${__dirname}/project-dist/bundle.css`), content + '\n', () => {})
            })
          }
        });
      }
    }
  });
})
