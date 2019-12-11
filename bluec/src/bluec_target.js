BluecTarget = function() {
  this.name = '';
  this.compiler = '';
  this.compileOpt = [];
  this.dependancies = [];
  this.links = [];
  this.includes= [];
  this.linkDirs= [];
  this.includeDirs= [];
}

BluecTarget.prototype.compile = function() {
  console.log(this.compiler + '-o' + this.name + this.dependancies + this.compileOpt);
};

BluecTarget.prototype.execute = function() {
  console.log('./' + this.target);
};

BluecTarget.prototype.setName = function(name) {
  this.name = name;
};

BluecTarget.prototype.setCompiler = function(compiler) {
  this.compiler = compiler;
};

function AddArgs(who, what) {
  if(Array.isArray(what)) {
    if(who.length === 0) who = what;
    else who.concat(what);
  }
  else who.push(what);
  return who;
}

BluecTarget.prototype.addCompileOption = function(options) {
  this.compileOpt = AddArgs(this.compileOpt, options);
};

BluecTarget.prototype.addDependancies = function(dependancies) {
  this.dependancies = AddArgs(this.dependancies, dependancies);
};

BluecTarget.prototype.addLinks = function(links) {
  this.links = AddArgs(this.links, links);
};

BluecTarget.prototype.addIncludes = function(includes) {
  this.includes = AddArgs(this.includes, includes);
}

BluecTarget.prototype.addLinkDirs = function(linkDirs) {
  this.linkDirs = AddArgs(this.linkDirs, linkDirs);
};

BluecTarget.prototype.addIncludeDirs = function(includeDirs) {
  this.includeDirs = AddArgs(this.includeDirs, includeDirs);
}

module.exports = BluecTarget;
