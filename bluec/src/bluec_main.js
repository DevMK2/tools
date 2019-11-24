;(()=> {
const process = require('process')
    , fs = require('fs')
    , cwd = process.cwd()
    , srcDir = `${cwd}/src`
    , testDir = `${cwd}/tests`;

const ErrorCode = require('./bluec_error');

const isCSource = (fileName)=>{
  let postFixStr = fileName.trim().split('.').pop();

  return postFixStr === 'c'
      || postFixStr === 'cc'
      || postFixStr === 'cpp';
};

if(process.argv.length < 3) {
  process.exit(ErrorCode.NoArgs);
}

if(process.argv[2] === 'init') {
  let srcList = fs.readdirSync(srcDir);

  if(fs.existsSync(testDir) === false)
    fs.mkdirSync(testDir);

  srcList.forEach(src=> {
    if(!isCSource(src))
      return;

    let tokens = src.trim().split('.');
    let postfix = tokens.pop();

    tokens.push('_test');
    testSrc = [tokens.join(''), postfix].join('.');

    fs.writeFileSync(`${testDir}/${testSrc}`, ``, 'utf8');
  });

  fs.writeFileSync(`${cwd}/BlueCfile.js`, ``, 'utf8');
}

else if(process.argv[2] === 'run') {
  process.exit(ErrorCode.NoTestDirectory);
}

})()
