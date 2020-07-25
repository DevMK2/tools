const Interval = 500; /*ms*/

const refWebdPath = 'web-gui/web-daemon/webui'
  , refPyDistPath = '/usr/lib/python2.7/dist-packages/webui'
  , refJsDistPath = '/usr/share/linuxcnc-webui';

const refFiles = [
  {
    src : 'static/js/*',
    dest : `${refJsDistPath}/static/js`,
  },
  {
    src : 'static/js/gremlin/*',
    dest : `${refJsDistPath}/static/js/gremlin`,
  },
  {
    src : 'static/js/gremlin/include/*',
    dest : `${refJsDistPath}/static/js/gremlin/include`,
  },
  {
    src : 'static/js/gremlin/views/*',
    dest : `${refJsDistPath}/static/js/gremlin/views`,
  },
  {
    src : 'static/js/gremlin/control/*',
    dest : `${refJsDistPath}/static/js/gremlin/control`,
  },
  {
    src : 'static/css/*',
    dest : `${refJsDistPath}/static/css`
  },
  {
    src : 'templates/*',
    dest : `${refJsDistPath}/templates`
  },
  {
    src : 'webd.py',
    dest : `${refPyDistPath}`
  }
];

const fs = require('fs')
  , process = require('process')
  , run = require('child_process').spawnSync;

((args)=>{
  checkArgs(args);

  const webdPath = `${args[2]}/${refWebdPath}`.replace('//', '/');
  checkRefPathes(refPyDistPath, refJsDistPath, webdPath);

  const files = makeFiles(webdPath, refFiles);
  watchAndCopy(files);


})(process.argv);


function checkArgs(args) {
  if(args.length < 3) {
    console.log(' Plz input janus repository root path ');
    process.exit(-1);
  }
}

function checkRefPathes(pyDistPath, jsDistPath, webdPath) {
  checkPath(pyDistPath);
  checkPath(jsDistPath);
  checkPath(webdPath);

  function checkPath(path) {
    if(!fs.existsSync(path)) {
      console.log(` Cannot Find Directory ${path}`);
      process.exit(-1);
    }
  }
}

function makeFiles(webdPath, refFiles){
  let files = [];

  refFiles.forEach(file=>{
    if(lastChar(file.src) === '*')
      files = files.concat(
        makeFilesForWildCard(
          webdPath, file.src.replace('/*',''), file.dest
        )
      );
    else
      files.push(
        makeFile(webdPath, file.src, file.dest)
      );
  });

  return files;

  function lastChar(str) {
    return str[str.length-1];
  }

  function makeFile(webdPath, src, dest) {
    return {
      src : `${webdPath}/${src}`,
      dest : `${dest}/${src}`
    };
  }

  function makeFilesForWildCard(webdPath, dirSrc, dirDest) {
    let files = [];

    dirSrc = `${webdPath}/${dirSrc}`;
    fs.readdirSync(dirSrc).forEach(file=>{
      files.push({
        src : `${dirSrc}/${file}`,
        dest : `${dirDest}/${file}`
      });
    });
    return files;
  }
}

function watchAndCopy(files) {
  files.forEach(file=>{
    fs.watchFile(file.src, {interval: Interval}, ()=>{
      let result = run('cp', [file.src, file.dest]);
      console.log(
        `[Copy File]\n`+ `    ${file.src}\n` + `  -> ${file.dest}\n`
      );
      console.log(result.stderr.toString('utf-8'));
    });
  });
}
