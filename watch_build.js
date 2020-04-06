'use strict';

const process = require('process')
    , fs = require('fs')
    , {Console} = require('console')
    , {spawn} = require('child_process')
    , logger = new Console({
        stdout: process.stdout,
        stderr: process.stderr,
        colorMode: true
      });

let compiling = false;
let waitForCompile= false;

process.chdir(`${process.env.LMS_GZ_SERVER_PATH}`);
watchReculsive(process.cwd(), 'src');

function watchReculsive(path, dirname) {
  let dirpath = `${path}/${dirname}`

  if(!fs.statSync(dirpath).isDirectory()) {
    watchThis(dirpath);
    return;
  }

  let dirs = fs.readdirSync(dirpath);
  dirs.forEach(dir=>{
    watchReculsive(dirpath, dir);
  });
}

function watchThis(filename) {
  fs.watchFile(filename, {interval: 500}, (curr, prev)=>{
    compile();
  });
}

function compile() {
  if(compiling) {
    console.count('already compiling');
    waitForCompile = true;
    return;
  }
  console.log('========= compile =========');

  compiling = true;
  let build = spawn('catkin_make', ['install']);
  let buildErrorBuffer = ''

  logger.time('compiling time');
  build.stderr.on('data', data=>buildErrorBuffer+=data.toString('utf-8'));
  build.on('close', data=>{
    compiling = false;
    if(waitForCompile) {
      console.log('recompile....');
      console.countReset('already compiling');
      waitForCompile = false;
      return compile();
    }

    if(data === 0)
      console.log('compile done');
    else {
      logger.error('\u001b[31m','');
      logger.error(new Error(buildErrorBuffer));
      logger.error('\u001b[0m','');
      console.error('compile failed');
    }
    logger.timeEnd('compiling time');
    console.log('======= compile done =======\n\n');
  });
};
