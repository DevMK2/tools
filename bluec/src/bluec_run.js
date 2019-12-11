BluecRunner = function(root, fs) {
  const {spawnSync} = require('child_process');
  const watch = require('node-watch');
  this.spawn = spawnSync;
  this.watch = watch;

  const BluecParser = require('./bluec_parser');
  this.bluecParser = new BluecFileParser();

  this.root = root;
  this.bluecFile = `${root}/BluecFile.js`;

  this.srcDir = `${root}/src`;
  this.testsDir = `${root}/tests`;
  if(fs.existsSync(this.testsDir) === false)
    fs.mkdirSync(this.testsDir);

  this.testExecDir = `${root}/testExecutionFiles`;
  if(fs.existsSync(this.testExecDir) === false)
    fs.mkdirSync(this.testExecDir);

  this.targets = this.bluecParser.parse(this.bluecFile);
  this.targets.forEach(target=>{
    target.compileResult = this.compile(target);
    target.executeResult = this.execute(target);
  });
};

BluecRunner.prototype.Run = function() {
  this.evalCompileNExecute();

  this.watch(this.srcDir, {recursive:true}, watchSrc);
  this.watch(this.testsDir, {recursive:true}, watchSrc);
  this.watch(this.bluecFile, watchBluec);

  let that = this;
  function watchSrc(evt, name){
    console.log(evt);
    console.log(name);
    that.compileNExecute();
    that.evalCompileNExecute();
  };

  function watchBluec(evt, name){
    console.log(evt);
    console.log(name);
    that.targets = that.bluecParser.parse(that.bluecFile);
    that.compileNExecute();
    that.evalCompileNExecute();
  };
};

BluecRunner.prototype.compileNExecute = function() {
  this.targets.forEach(target=>{
    target.compileResult = this.compile(target);
    target.executeResult = this.execute(target);
  });
}

BluecRunner.prototype.evalCompileNExecute = function() {
  this.targets.forEach(target=>{
    this.evalCompile(target.name, target.compileResult);
    this.evalExecute(target.name, target.executeResult);
  });
}

BluecRunner.prototype.compile = function(target) {
  let postfix = target.compiler==='gcc'? 'c' : 'cc';
  let testSource = `${this.testsDir}/${target.name}_test.${postfix}`;

  let args = [];
  args.push('-o');
  args.push(`${this.testExecDir}/${target.name}`);
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
  return this.spawn(target.compiler, args);
};

BluecRunner.prototype.execute = function(target) {
  return this.spawn('./'+`testExecutionFiles/`+target.name);
};

BluecRunner.prototype.evalCompile = function(targetName, compileResult) {
  if(compileResult.status === 0)
    console.log(`${targetName} compile ok.`);
  else {
    console.error(compileResult);
    console.error(compileResult.stderr.toString('utf8'));
  }
};

BluecRunner.prototype.evalExecute = function(targetName, executeResult) {
  if(executeResult.status === 0) {
    console.log(`${targetName} execute ok.`);
    console.log(executeResult.stdout.toString('utf8'));
  }
  else {
    console.error(executeResult.stderr.toString('utf8'));
  }
};
