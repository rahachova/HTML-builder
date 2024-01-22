const fs = require('fs');
const path = require('path');

fs.mkdir(path.resolve(`${__dirname}/files-copy`), { recursive: true }, () => {
  fs.readdir(path.resolve(`${__dirname}/files`), (err, files) => {
    for (const file of files) {
      const filePath = path.join(path.resolve(`${__dirname}/files`), file);
      fs.stat(filePath, (err, stats) => {
        if (!stats.isDirectory()) {
          fs.copyFile(
            filePath,
            path.join(path.resolve(`${__dirname}/files-copy`), file),
            () => {},
          );
        }
      });
    }
  });
});
