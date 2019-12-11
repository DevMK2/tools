BluecFileParser = function() {
};

BluecFileParser.prototype.parse = function(fullPath) {
  const fs = require('fs')
    , process = require('process')
    , BluecTarget = require('./bluec_target');

  if(fs.existsSync(fullPath) === false) {
    process.exit(-1); // FIXME: execption handling
  }

  let bluecTexts = fs.readFileSync(fullPath, 'utf8');
  let bluecObjs = JSON.parse(bluecTexts);

  let targets = [];
  bluecObjs.forEach(obj=>{
    let targetObj = new BluecTarget();

    targetObj.setName(obj.targetName);
    targetObj.setCompiler(obj.compiler);
    targetObj.addCompileOption(obj.compiler_args);
    targetObj.addDependancies(obj.dependancies);
    targetObj.addLinks(obj.link);
    targetObj.addIncludes(obj.include);
    targetObj.addLinkDirs(obj.linkDirectories);
    targetObj.addIncludeDirs(obj.includeDirectories);
    targets.push(targetObj);
  });

  return targets;
};

module.exports = BluecFileParser;
