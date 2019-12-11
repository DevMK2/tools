BluecInitializer = function(root, fs) {
  this.fs = fs;
  this.root = root;
  this.allSource = [];
  this.allTargets = [];
};

BluecInitializer.prototype.Run = function() {
  this.hasFile(`src`);
  if(this.hasFile(`tests`) === false)
    this.makeTestsDir();

  this.parseProject();
  this.createBluecFile();
};

BluecInitializer.prototype.parseProject = function() {
  this.parseSrc();
  this.parseTargets();
}

BluecInitializer.prototype.createBluecFile = function() {
  if(this.fs.existsSync(`${this.root}/BluecFile.js`))
    return;

  const compiler = dependancies=>{
    let ret = 'gcc';
    dependancies.forEach(name=>{
      const postfix = name.trim().split('.').pop();
      if( postfix === 'cc' || postfix === 'cpp')
        ret = 'g++';
    });
    return ret;
  };

  let targets = [];
  Object.keys(this.allTargets).forEach(target=>{
    t = {}
    t['targetName'] = target;
    t['compiler'] = compiler(this.allTargets[target].source);
    t['compiler_args'] = [];
    if(t['compiler'] === 'g++')
      t['compiler_args'].push('--std=c++14');

    t['dependancies'] = this.allTargets[target].source;
    t['link'] = [];
    t['link'].push(t['compiler']==='gcc'?'bluec':'bluecc');

    t['include'] = '';
    t['linkDirectories'] = [];
    t['linkDirectories'].push(`${__dirname}/../build/lib`);
    t['includeDirectories'] = [];
    t['includeDirectories'].push(this.allTargets[target].path);
    t['includeDirectories'].push(`${__dirname}/assert`);

    targets.push(t);
  });
  this.fs.writeFileSync(`${this.root}/BluecFile.js`, JSON.stringify(targets, 'utf8',' '));
}

BluecInitializer.prototype.hasFile = function(relativePath) {
  return this.fs.existsSync(`${this.root}/${relativePath}`);
};

BluecInitializer.prototype.makeTestsDir = function() {
  this.fs.mkdirSync(`${this.root}/tests`);
}

BluecInitializer.prototype.parseTargets = function() {
  let targets = {};

  const parseTargetName = relativePath=>{
    let token = relativePath.trim().split('/');
    let sourceName = token.pop();
    let targetName = token.pop();

    if(targetName === 'src')
      targetName = token.pop();

    if(targetName === undefined)
      targetName = 'main';

    if(targets.hasOwnProperty(targetName))
      targets[targetName].source.push(sourceName);
    else
      targets[targetName] = {source: [sourceName], path: `${this.root}/${relativePath.substr(0,relativePath.lastIndexOf('/'))}`};
  }

  this.allSource.forEach(parseTargetName);
  this.allTargets = targets;
}

BluecInitializer.prototype.parseSrc = function(relativePath='src') {
  const isSource = name=>{
    let postfix = name.trim().split('.').pop();
    return postfix === 'c' || postfix === 'cc' || postfix === 'cpp';
  };

  let that = this;

  this.fs.readdirSync(`${this.root}/${relativePath}`).forEach(name=>{
    let filePath = `${this.root}/${relativePath}/${name}`
      , relativeFilePath = `${relativePath}/${name}`;

    if(that.fs.statSync(filePath).isDirectory())
      that.parseSrc(relativeFilePath);
    else if(isSource(name))
      this.allSource.push(relativeFilePath);
  });
}

module.exports = BluecInitializer;
