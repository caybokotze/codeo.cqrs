const
  gulp = requireModule("gulp-with-help"),
  gutil = require("gulp-util"),
  editXml = require("gulp-edit-xml"),
  config = require("./config"),
  env = requireModule("env"),
  promisify = requireModule("promisify-stream"),
  chalk = require("chalk"),
  isPackMasterBranch = require("./modules/is-pack-master-branch"),
  containingFolder = `src/${config.packageProject}`;

gulp.task("increment-package-version", async () => {
  const onPackMaster = await isPackMasterBranch();
  if (!onPackMaster) {
    console.warn(chalk.yellow(`WARNING: not incrementing package version: not on pack master branch "${env.resolve("PACK_MASTER")}"`));
    return;
  }

  return promisify(
    gulp.src(`${containingFolder}/Package.nuspec`)
      .pipe(editXml(xml => {
        const
          node = xml.package.metadata[0].version,
          current = node[0],
          parts = current.split("."),
          major = parseInt(parts[0]),
          minor = parseInt(parts[1]),
          patch = parseInt(parts[2]);
        testNaN({ major, minor, patch });
        const newVersion = `${major}.${minor}.${patch + 1}`;
        node[0] = newVersion;
        gutil.log(gutil.colors.yellow(`Package version incremented to: ${newVersion}`));
        return xml;
      }, { builderOptions: { renderOpts: { pretty: true } } }))
      .pipe(gulp.dest(containingFolder))
  );
});

function testNaN(version) {
  Object.keys(version).forEach(k => {
    if (isNaN(version[k])) {
      throw new Error(`${k} is not an integer`);
    }
  });
}