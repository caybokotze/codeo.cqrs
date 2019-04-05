const
  gulp = requireModule("gulp-with-help"),
  runSequence = requireModule("run-sequence"),
  msbuild = require("gulp-msbuild");

gulp.task("prebuild", ["nuget-restore", "install-tools"]);

gulp.task("build-for-release",
  "Builds all Visual Studio solutions in tree",
  ["nuget-restore"],
  () => {
    console.log("--- build-for-release ---");
    return gulp.src([
      "src/RetailStudioApiClient.sln"
    ]).pipe(msbuild({
      toolsVersion: "auto",
      targets: ["Clean", "Build"],
      configuration: "Release",
      stdout: true,
      verbosity: "minimal",
      architecture: "x64",
      errorOnFail: true,
      nologo: false
    }));
  });
