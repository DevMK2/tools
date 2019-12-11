;(()=> {
const process = require('process')
    , fs = require('fs')
    , ErrorCode = require('./bluec_error')
    , BluecInit = require('./bluec_init')
    , BluecBegin = require('./bluec_begin')
    , BluecRun = require('./bluec_run');

const root = process.cwd();

if(process.argv.length < 3) {
  console.log( 'invalid argument.');
  console.log( 'init : ');
  console.log( 'begin : ');
  console.log( 'run : ');
  process.exit(ErrorCode.NoArgs);
}

let proc;
switch(process.argv[2]) {
  case 'init':
    proc = new BluecInit(root, fs);
    break;
  case 'begin':
    proc = new BluecBegin(root, fs);
    break;
  case 'run':
    proc = new BluecRunner(root, fs);
    break;
  default:
    proc = {Run:()=>{
      console.log( 'invalid argument.');
      console.log( 'init : ');
      console.log( 'begin : ');
      console.log( 'run : ');
    }};
    break;
}

proc.Run();
})()
