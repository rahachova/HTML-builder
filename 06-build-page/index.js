const fs = require('fs');
const path = require('path');

function copyDirectory(folderToRead, folderToCopy) {
  fs.readdir(
    path.resolve(`${__dirname}${folderToRead}`),
    { withFileTypes: true },
    (err, files) => {
      files.forEach((file) => {
        const newFolderToRead = `${folderToRead}/${file.name}`;
        const resolvedFolderToRead = path.resolve(
          `${__dirname}${newFolderToRead}`,
        );
        const newFolderToCopy = `${folderToCopy}/${file.name}`;
        const resolvedFolderToCopy = path.resolve(
          `${__dirname}${newFolderToCopy}`,
        );
        if (file.isDirectory()) {
          fs.mkdir(resolvedFolderToCopy, () => {
            copyDirectory(newFolderToRead, newFolderToCopy);
          });
        } else {
          fs.copyFile(resolvedFolderToRead, resolvedFolderToCopy, () => {});
        }
      });
    },
  );
}

fs.rmdir(path.resolve(`${__dirname}/project-dist`), () => {
  fs.mkdir(
    path.resolve(`${__dirname}/project-dist`),
    { recursive: true },
    () => {
      fs.mkdir(
        path.resolve(`${__dirname}/project-dist/assets`),
        { recursive: true },
        () => {
          // Copy assets
          copyDirectory('/assets', '/project-dist/assets');

          // Bundle styles
          fs.readdir(path.resolve(`${__dirname}/styles`), (err, files) => {
            for (const file of files) {
              const filePath = path.join(
                path.resolve(`${__dirname}/styles`),
                file,
              );
              if (path.extname(file) === '.css') {
                fs.stat(filePath, (err, stats) => {
                  if (!stats.isDirectory()) {
                    fs.readFile(
                      path.join(path.resolve(`${__dirname}/styles`), file),
                      'utf8',
                      (err, content) => {
                        fs.appendFile(
                          path.resolve(`${__dirname}/project-dist/style.css`),
                          content + '\n',
                          () => {},
                        );
                      },
                    );
                  }
                });
              }
            }
          });

          // Bundle markup
          const componentNames = [];
          return fs.promises
            .readdir(path.resolve(`${__dirname}/components`), {
              withFileTypes: true,
            })
            .then((componentFiles) => {
              return Promise.all(
                componentFiles.reduce((acc, componentFile) => {
                  const filePath = path.join(
                    path.resolve(`${__dirname}/components`),
                    componentFile.name,
                  );
                  if (path.extname(filePath) === '.html') {
                    componentNames.push(componentFile.name.slice(0, -5));
                    acc.push(
                      fs.promises.readFile(
                        path.join(
                          path.resolve(`${__dirname}/components`),
                          componentFile.name,
                        ),
                        'utf-8',
                      ),
                    );
                  }
                  return acc;
                }, []),
              );
            })
            .then((data) => {
              return data.map((componentContent, index) => {
                return {
                  name: componentNames[index],
                  content: componentContent,
                };
              });
            })
            .then((componentsData) => {
              fs.readFile(
                path.resolve(`${__dirname}/template.html`),
                'utf8',
                (err, content) => {
                  let replaced = content;
                  componentsData.forEach((componentData) => {
                    replaced = replaced.replace(
                      `{{${componentData.name}}}`,
                      componentData.content,
                    );
                  });
                  fs.writeFile(
                    path.resolve(`${__dirname}/project-dist/index.html`),
                    replaced,
                    'utf-8',
                    () => {},
                  );
                },
              );
            });
        },
      );
    },
  );
});
