;
(() => {
const expect = require('chai').expect
    , process = require('process')
    , fs = require('fs');

const testDir = __dirname
    , srcDir = `${testDir}/../src`
    , mockDir = `${testDir}/mock`
    , mockSrcDir = `${mockDir}/mockSrcDir`
    , mockTestDir = `${mockDir}/mockTestDir`
    , bluecDir = `${mockDir}/.bluec`;

const rmDirForce = dir=>{
  if(fs.existsSync(dir) === false)
    return;

  fs.readdirSync(dir).forEach(file=>{
    fs.unlinkSync(`${dir}/${file}`);
  });

  fs.rmdirSync(dir);
};


describe('bluec init', () => {
  const {spawn, spawnSync} = require('child_process');

  before(() => { 
    process.chdir(mockDir);
    rmDirForce(mockTestDir);
  });

  it('`$bluec init` commands make testfiles into a `tests` directory', done =>{
    let mockTestList = ['lib_test.c', 'help_test.c', 'main_test.c'];
    mockTestList.sort();

    spawnSync('node', [`${srcDir}/bluec_main.js`, 'init']);
    let mockTests = fs.readdirSync(`${process.cwd()}/tests`);
    mockTests.sort();
    expect(mockTestList).deep.equal(mockTests);

    done();
  });

  it('`$bluec init` commands make `BlueCfile.js` for initialize', done=>{
    let bluecFile= `${mockDir}/BlueCfile.js`;
    expect(fs.existsSync(bluecFile)).to.equal(true);
    done();
  });

  after(() => { process.chdir(testDir); });
});

})()

//\ argument 를 통해 동작이 결정된다

// 현재 디렉토리에서 'src' 디렉토리를 찾아 
// 'src' 디렉토리 내의 c, c++ 소스파일 테스트를 위한 
// 설정파일인 'BluCfile.js'과 'tests' 디렉토리, 하위 파일들을 생성한다.
