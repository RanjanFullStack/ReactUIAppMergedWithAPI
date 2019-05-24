const fs = require("fs-extra");

const environment = process.argv[2] || "dev";

const DESTINATION = `\\\\Quants\\bflow2\\${environment}\\v2.0\\APP`;
const SOURCE = "build";





console.log({ environment });
fs.readdir("build")
  .then(files => {
    const filesPromise = files.map(eachFile =>
      fs.copy(`${SOURCE}\\${eachFile}`, `${DESTINATION}\\${eachFile}`)
    );
    return Promise.all(filesPromise);
  })
  .then(() => {
    console.log("Copied all files ");
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
