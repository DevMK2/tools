BluecBegin = function(root, fs) {
  const {spawnSync} = require('child_process');
  this.spawn = spawnSync;
  this.root = root;
  this.fs = fs;
  this.bluecFile = `${root}/BluecFile.js`;
  this.testsDir = `${root}/tests`;
  if(fs.existsSync(this.testsDir) === false)
    fs.mkdirSync(this.testsDir);

  this.testExecDir = `${root}/testExecutionFiles`;
  if(fs.existsSync(this.testExecDir) === false)
    fs.mkdirSync(this.testExecDir);
};

BluecBegin.prototype.Run = function() {
  const BluecPaser = require('./bluec_parser');
  let bluecParser = new BluecFileParser();
  let targets = bluecParser.parse(this.bluecFile);

  let that = this;
  targets.forEach( target=>{
    let postfix = target.compiler==='gcc'? 'c' : 'cc';

    writeTestHeader(target.name, target.dependancies);
    writeTestSource(target, postfix);
  });

  function writeTestHeader(name, dependancies) {
    let fileName = `${that.testsDir}/${name}_test.h`;
    if(that.fs.existsSync(fileName))
      return;

    let includeStrings = '';
    dependancies.forEach(incFile=>{
      includeStrings += `#include "${incFile}"\n`;
    });

    that.fs.writeFileSync(fileName, includeStrings);
  }

  function writeTestSource(target, postfix) {
    let fileName = `${that.testsDir}/${target.name}_test.${postfix}`;
    if(that.fs.existsSync(fileName)) {
      compileOnce(target, fileName);
      return;
    }

    let includeString = '';
    includeString += `#include "${target.name}_test.h"\n`;
    includeString += `#include "Assert.h"\n`;

    let mainString = 
      `int main(int argc, char* argv[])\n`+
      `{\n`+
      `    return 0;\n`+
      `}\n`;

    that.fs.writeFileSync(fileName, includeString + mainString);

    compileOnce(target, fileName);
  }

  function compileOnce(target, testSource) {
    let command = target.compiler;
    let args = [];
    let process = require('process');
    args.push('-o');
    args.push(`${that.testExecDir}/${target.name}`);
    args.push(`${testSource}`);
    target.compileOpt.forEach(option=>{
      args.push(option);
    });
    target.includeDirs.forEach(includeDir=>{
      args.push('-I' + includeDir);
    });
    target.linkDirs.forEach(linkDir=>{
      args.push('-L' + linkDir);
    });
    target.links.forEach(link=>{
      args.push('-l' + link);
    });
    let compileResult = that.spawn(command, args);
    if(compileResult.status !== 0)
      console.log(compileResult.stderr.toString('utf8'));
  }
};

module.exports = BluecBegin;
