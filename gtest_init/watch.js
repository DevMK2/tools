'use strict';

const fs = require('fs')
    , process = require('process')
    , {spawn} = require('child_process');

const srcName = name=>`${name}.cc`
    , testName = name=>`${name}.test.cc`
    , srcPath = name=>[__dirname, 'src', srcName(name)].join('/')
    , testPath = name=>[__dirname, 'tests', testName(name)].join('/');

main();

function main() {
  let runscripts = process.argv.length===2 ? 
    fs.readdirSync(__dirname) : [parseArg(process.argv[2])];

  let targets = targetsForRunscripts(runscripts);
  targets.forEach(watchTarget);
}

function parseArg(str) {
  if(!str.includes('.sh'))
    str = [str.trim(), 'test', 'sh'].join('.');

  checkExists(str);

  return str;
}

function targetsForRunscripts(files) {
  let targets = [];

  files.forEach(file=>{
    if(!file.includes('.sh'))
      return;

    const name = file.trim().split('.')[0];
    const src = srcPath(name)
        , test = testPath(name)
        , run = [__dirname,'/',file].join('');

    checkExists([src, test, run]);

    targets.push({src, test, run});
    console.log('watching ... ', name);
  });

  return targets;
}

function watchTarget(target) {
  fs.watchFile(target.src, {interval:500}, (curr, prev)=>{
    spawn(target.run, [], {stdio: 'inherit'});
  });

  fs.watchFile(target.test, {interval:500}, (curr, prev)=>{
    spawn(target.run, [], {stdio: 'inherit'});
  });
}

function checkExists(path) {
  if(path instanceof Array)
    path.forEach(check);
  else
    check(path);

  function check(path) {
    if(!fs.existsSync(path))
      onError('file not found :' + path);
  }
}

function onError(err) {
  console.error(new Error('[WATCH.JS] ERROR::' + err));
  process.exit(-1);
}
