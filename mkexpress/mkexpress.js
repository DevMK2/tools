const fs = require('fs')
    , process = require('process')
    , runSync = require('child_process').spawnSync
    , arguments = require('./ArgParser').GetArguments()
    , skeletons = require('./Skeleton');

checkSkeleton(skeletons);
checkPackageAlreadyIs(arguments.PackName);

mkDirs(arguments.PackName, arguments.TDD);
process.chdir(arguments.PackName);

initNPM(arguments.TDD);
cpSkeletons(skeletons, arguments);


function checkSkeleton(skeletons) {
  if( (fs.existsSync(skeletons.Grunt) 
       && fs.existsSync(skeletons.NpmNoTDD)
       && fs.existsSync(skeletons.NpmWithTDD)
       && fs.existsSync(skeletons.ServerJs)
       && fs.existsSync(skeletons.IndexHtml)) == false ) {
    console.error('Check the skeleton!!');
    console.error(`__dirname : ${__dirname}`);
    process.exit(-1);
  }
}
  
function checkPackageAlreadyIs(packName) {
  if(fs.existsSync(packName)) {
    console.log(`Already '${packName}' directory is it!`);
    process.exit(-1);
  }
}

function mkDirs(packName, isTDD) {
  fs.mkdirSync(`${packName}`);
  fs.mkdirSync(`${packName}/views`);
  fs.mkdirSync(`${packName}/static`);
  fs.mkdirSync(`${packName}/static/js`);
  fs.mkdirSync(`${packName}/static/css`);

  if(isTDD)
    fs.mkdirSync(`${packName}/tests`);
}

function initNPM(isTDD) {
  console.log(' init npm ...');
  runSync('npm', ['init', '-y']);

  console.log(' save express ...');
  runSync('npm', ['i', '--save-dev', 'express', 'ejs']);

  console.log(' save grunt ...');
  runSync('npm', ['i', '--save-dev', 'grunt', 'grunt-contrib-watch', 'grunt-contrib-connect']);

  if(isTDD) {
    console.log(' save mocha ...');
    runSync('npm', ['i', '--save-dev', 'mocha', 'should']);
  }

  console.log();
}

function cpSkeletons(skeletons, arguments) {
  const root = process.cwd()
      , views = `${root}/views`;

  let npm = arguments.TDD? skeletons.NpmWithTDD : skeletons.NpmNoTDD;
  //if(argument.PORT !== 3000)

  fs.copyFileSync(npm, `${root}/package.json`);
  fs.copyFileSync(skeletons.Grunt, `${root}/Gruntfile.js`);
  fs.copyFileSync(skeletons.ServerJs, `${root}/server.js`);
  fs.copyFileSync(skeletons.IndexHtml, `${views}/index.html`);
}
