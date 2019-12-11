/*
 * File: init_test.spec
 * Author: Mklee
 * Email: mkro0616@gmail.com
 * Github: https://github.com/wkwjsrj11117
 * Description: 
 *   '${project_root}/src' 내의 파일들을 기반으로 
 *   Bluec의 런타임 설정파일인 'BluecFile.js'의 
 *   스켈레톤코드를 project-root에 생성한다.
 *   또한 'tests' 디렉토리가 root에 존재하는지 검사하여 없으면 생성한다.
 */

//\ TEST LIST
//
//\ 1. root/src 가 없으면 에러 메시지를 출력한다
//
//\ 2. root/tests 가 없으면 생성한다.
//
//\ 3. root/src 내의 모든 src를 recursive하게 찾을 수 있다.
//
//\ 4. 'SkeletonCreator'<<-'InitSkeletonCreator' 가 스켈레톤 BluecFile.js를 생성한다.
//

;(() => {
const expect = require('chai').expect
    , process = require('process')
    , fs = require('fs')
    , {spawn, spawnSync} = require('child_process');

const testDir = __dirname
    , srcDir = `${testDir}/../src`
    , mockDir = `${testDir}/mock`
    , mockSrcDir = `${mockDir}/src`
    , mockTestsDir = `${mockDir}/tests`
    , bluecDir = `${mockDir}/.bluec`;
let assertPath = __dirname.split('/');
assertPath.pop();
assertPath.push('src');
assertPath.push('assert');
assertPath = assertPath.join('/');
let libDir = __dirname.split('/');
libDir.pop();
libDir.push('src');
libDir.push('..');
libDir.push('build');
libDir.push('lib');
libDir = libDir.join('/');
const BluecInit = require('../src/bluec_init.js')
    , BluecError = require('../src/bluec_error.js');

const rmDirForce = dir=>{
  if(fs.existsSync(dir) === false)
    return;

  fs.readdirSync(dir).forEach(file=>{
    if(fs.statSync(`${dir}/${file}`).isDirectory())
      rmDirForce(`${dir}/${file}`);
    else
      fs.unlinkSync(`${dir}/${file}`);
  });

  fs.rmdirSync(dir);
};

const mkFileRecursive = (relativePath)=>{
  const root = mockDir;

  let token = relativePath.trim().split('/');

  if(token.length < 2) {
    fs.writeFileSync(`${root}/${relativePath}`, ' ');
    return;
  }

  let fileName = token.pop();
  let fullPath = root;

  token.forEach(dirName=>{
    fullPath += `/${dirName}`;
    if(fs.existsSync(fullPath) === false)
      fs.mkdirSync(fullPath);
  });

  fs.writeFileSync(`${fullPath}/${fileName}`, ' ');
};


//\ 1. root/src 가 없으면 에러 메시지를 출력한다
describe('$bluec init :: check src directory', () => {
  const bluecInit = new BluecInit(mockDir, fs);

  before(() => { 
    process.chdir(mockDir);
    rmDirForce(mockSrcDir);
  });

  it('`$bluec init` commands return&print error when theres no src directory', done =>{
    expect(bluecInit.hasFile('src')).to.equal(false);
    done();
  });


  it('`$bluec init` commands do nothing when theres src directory', done =>{
    fs.mkdir(mockSrcDir, ()=>{
      expect(bluecInit.hasFile('src')).to.equal(true);
    });
    done();
  });

  after(() => { process.chdir(testDir); });
});


//\ 2. root/tests 가 없으면 생성한다.
describe('$bluec init :: check tests directory', () => {
  const bluecInit = new BluecInit(mockDir, fs);

  before(() => { 
    process.chdir(mockDir);
    rmDirForce(mockTestsDir);
  });

  it('`$bluec init` commands make `tests` directory when there no', done =>{
    expect(bluecInit.hasFile('tests')).to.equal(false);
    bluecInit.makeTestsDir();
    expect(fs.existsSync(mockTestsDir)).to.equal(true);
    done();
  });

  after(() => { process.chdir(testDir); });
});


//\ 3. root/src 내의 모든 src를 recursive하게 찾을 수 있다.
describe('$bluec init :: search all c/c++ src files', () => {
  const bluecInit = new BluecInit(mockDir, fs);
  const cList = ['gzserver.c', 
                 'gzclient.c', 
                 'build/unitybuild.c', 
                 'lib/clib.c',
                 'a.c.c', 
                 '/build/b.cc.c', /* c sources*/
                 'lib/plugin/plugin.cc', 
                 'lib/cclib.cc', 
                 'lib/cpp/cpplib.cpp',
                 'lib/d.c.cpp', /*cpp sources*/
                 'README.md', 
                 'lib/cclib.hh', 
                 'lib/cpplib.hpp', 
                 'lib/cpp/clib.h',
                 'dongari.ccc', 
                 'lib/plugin/ccc'];/*noise*/ 

  const answer = ['src/gzserver.c', 
                  'src/gzclient.c', 
                  'src/build/unitybuild.c', 
                  'src/lib/clib.c',
                  'src/a.c.c', 
                  'src/build/b.cc.c', /* c sources*/
                  'src/lib/plugin/plugin.cc', 
                  'src/lib/cclib.cc', 
                  'src/lib/cpp/cpplib.cpp',
                  'src/lib/d.c.cpp']; /*cpp sources*/

  let targets = makeTargetList(answer);

  before(() => { 
    process.chdir(mockDir);
    cList.forEach(file=>{
      mkFileRecursive(`src/${file}`);
    });
  });

  it('`$bluec init` commands search all source in `src` directory recursively', done =>{
    const bluecInit = new BluecInit(mockDir, fs);
    bluecInit.parseProject();
    let sourceList = bluecInit.allSource;

    answer.sort();
    sourceList.sort();

    expect(sourceList).deep.equal(answer);
    done();
  });

  it('`src`내에서 소스코드가 위치한 상대 디렉토리 명을 각각의 target으로 지정한다.', done =>{
    const bluecInit = new BluecInit(mockDir, fs);
    bluecInit.parseProject();
    let targetList = Object.keys(bluecInit.allTargets);

    expect(targetList.sort()).deep.equal(targets.sort());
    done();
  });

  after(() => { process.chdir(testDir); });
});


//\ 4. 'SkeletonCreator'<<-'InitSkeletonCreator' 가 스켈레톤 BluecFile.js를 생성한다.
describe('$bluec init :: create `BluecFile.js`', () => {
  const bluecInit = new BluecInit(mockDir, fs);

  before(() => { 
    process.chdir(mockDir);
    if(fs.existsSync(`${mockDir}/BluecFile.js`) === true)
      fs.unlinkSync(`${mockDir}/BluecFile.js`);
  });

  it('`$bluec init` commands check `BluecFiles.js` if exists', done =>{
    expect(bluecInit.hasFile('BluecFile.js')).to.equal(false);
    done();
  });

  it('`$bluec init` commands make `BluecFiles.js` when no exists', done =>{
    bluecInit.createBluecFile();
    expect(bluecInit.hasFile('BluecFile.js')).to.equal(true);
    fs.unlinkSync(`${mockDir}/BluecFile.js`);
    done();
  });

  const targets = [
    {
      targetName: 'main',
      compiler: 'gcc',
      compiler_args: [],
      dependancies: [ 
        'a.c.c',
        'gzclient.c',
        'gzserver.c'
      ],
      link: ["bluec"],
      include: '',
      linkDirectories: [libDir],
      includeDirectories:[ `${mockSrcDir}`, assertPath]
    },
    {
      targetName: 'build',
      compiler: 'gcc',
      compiler_args: [],
      dependancies: [ 
        'b.cc.c',
        'unitybuild.c',
      ],
      link: ["bluec"],
      include: '',
      linkDirectories: [libDir],
      includeDirectories:[ `${mockSrcDir}/build`, assertPath]
    },
    {
      targetName: 'lib',
      compiler: 'g++',
      compiler_args: ["--std=c++14"],
      dependancies: [ 
        'cclib.cc', 
        'clib.c',
        'd.c.cpp'
      ],
      link: ["bluecc"],
      include: '',
      linkDirectories: [libDir],
      includeDirectories:[ `${mockSrcDir}/lib`, assertPath]
    },
    {
      targetName: 'cpp',
      compiler: 'g++',
      compiler_args: ["--std=c++14"],
      dependancies: [ 
        'cpplib.cpp',
      ],
      link: ["bluecc"],
      include: '',
      linkDirectories: [libDir],
      includeDirectories:[`${mockSrcDir}/lib/cpp`, assertPath]
    },
    {
      targetName: 'plugin',
      compiler: 'g++',
      compiler_args: ["--std=c++14"],
      dependancies: [ 
        'plugin.cc', 
      ],
      link: ["bluecc"],
      include: '',
      linkDirectories: [libDir],
      includeDirectories:[`${mockSrcDir}/lib/plugin`, assertPath]
    },
  ];

  it('아래와 같은 초기 설정으로 BluecFile.js 스켈레톤을 만든다.\
  \n      targetName : 소스파일이 위치한 디렉토리 이름\
  \n      dependancies : 같은 디렉토리에 위치한 소스파일들\
  \n      compiler: c++ 소스가 하나라도 있으면 g++ 아니면 gcc', done =>{

    const bluecInit = new BluecInit(mockDir, fs);
    bluecInit.Run();
    targetRec = JSON.parse(fs.readFileSync(`${mockDir}/BluecFile.js`, 'utf8'));

    expect(targets).deep.equal(targetRec);
    fs.unlinkSync(`${mockDir}/BluecFile.js`);
    done();
  });

  after(() => { 
    process.chdir(testDir); 
  });
});


function makeTargetList(answer) {
  let targets = {};

  answer.forEach(name=> {
    let token = name.trim().split('/');
    token.pop();
    let targetName = token.pop();
    
    if(targetName === 'src')
      targetName = token.pop();
    if(targetName === undefined)
      targetName = 'main';
    
    targets[targetName] = targetName;
  });

  return Object.values(targets);
}
})()
