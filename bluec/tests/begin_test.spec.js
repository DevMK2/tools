/**
 * File: begin_test.spec
 * Author: Mklee
 * Email: mkro0616@gmail.com
 * Github: https://github.com/wkwjsrj11117
 * Description: 
 *             tests 디렉토리에 테스트코드들의 스켈레톤을 
 *             생성 및 빌드한다.
 *             빌드 실패시엔 사용자에게 이를 알려서
 *             BluecFile.js 파일의 수정을 요청한다.
 */

//\ TEST LIST
//
//\ 1. tests 디렉토리가 없으면 만든다.
//
//\ 2. BluecFile.js 파일이 없으면 에러메시지를 출력한다.
//
//\ 3. BluecFile.js 파일을 파싱하여 ${target}_test.c or cc 파일을 만든다
//
//\ 4. 한번 빌드해보고 결과를 알려준다.
//
//\ 5. 빌드 실패시 'tests'의 내용은 모두 내비둔다

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
    , mockTestExecDir = `${mockDir}/testExecutionFiles`
    , bluecDir = `${mockDir}/.bluec`;

const BluecInit = require('../src/bluec_init.js')
    , BluecBegin = require('../src/bluec_begin.js')
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

const testListDirTargetMode = [ 
        'build_test.c',
        'build_test.h',
        'cpp_test.cc',
        'cpp_test.h',
        'lib_test.cc',
        'lib_test.h',
        'main_test.c',
        'main_test.h',
        'plugin_test.cc',
        'plugin_test.h'];

//\ 3. BluecFile.js 파일을 파싱하여 ${target}_test.c or cc 파일을 만든다
describe('$bluec begin :: parse BluecFile.js', () => {

  before(() => { 
    process.chdir(mockDir);
  });

  it('`$bluec begin::*_test.c or cc 파일과 h 파일이 만들어진다`', done =>{
    const bluecInit = new BluecInit(mockDir, fs);
    bluecInit.Run();

    const bluecBegin = new BluecBegin(mockDir, fs);
    bluecBegin.Run();

    expect(fs.readdirSync(mockTestsDir)).deep.equal(testListDirTargetMode);
    done();
  });

  it('`$bluec begin::*_test.c or cc 파일은 *_test.h 파일을 include한다`', done =>{
    const bluecInit = new BluecInit(mockDir, fs);
    bluecInit.Run();

    const bluecBegin = new BluecBegin(mockDir, fs);
    bluecBegin.Run();

    let testfiles = fs.readdirSync(mockTestsDir);

    testfiles.forEach(file => {
      let targetName = file.split('.');
      let postfix = targetName.pop();
      let fileString = fs.readFileSync(`${mockTestsDir}/${file}`, 'utf8');

      if(postfix !== 'h') {
        let includeStr = `#include "${[targetName, 'h'].join('.')}"`;
        expect(fileString.search(includeStr)).to.not.equal(-1);
      }
    });
    done();
  });

  it('`$bluec begin::*_test.h 파일은 모든 타켓 파일을 include한다`', done =>{
    const includeDeps = {
      'build_test': ['#include "b.cc.c"',
                     '#include "unitybuild.c"'],
      'cpp_test': ['#include "cpplib.cpp"'],
      'lib_test': ['#include "cclib.cc"', 
                   '#include "clib.c"', 
                   '#include "d.c.cpp"'],
      'main_test': ['#include "a.c.c"', 
                    '#include "gzclient.c"', 
                    '#include "gzserver.c"'],
      'plugin_test': ['#include "plugin.cc"']};

    const bluecInit = new BluecInit(mockDir, fs);
    bluecInit.Run();

    const bluecBegin = new BluecBegin(mockDir, fs);
    bluecBegin.Run();

    let testfiles = fs.readdirSync(mockTestsDir);

    testfiles.forEach(file => {
      let targetName = file.split('.');
      let postfix = targetName.pop();
      let fileString = fs.readFileSync(`${mockTestsDir}/${file}`, 'utf8');

      if(postfix === 'h') {
        includeDeps[targetName].forEach(includeStr=>{
          expect(fileString.search(includeStr)).to.not.equal(-1);
        });
      }
    });
    done();
  });

  it('`$bluec begin::만든 test 파일들을 한번 빌드해본다`', done =>{
    const bluecInit = new BluecInit(mockDir, fs);
    bluecInit.Run();

    const bluecBegin = new BluecBegin(mockDir, fs);
    bluecBegin.Run();

    const executables = [
      'build', 'cpp', 'lib', 'main', 'plugin'
    ];

    let testfiles = fs.readdirSync(mockTestExecDir);
    expect(testfiles).deep.equal(executables);

    done();
  });
  after(() => { 
    fs.unlinkSync(`${mockDir}/BluecFile.js`);
    process.chdir(testDir); 
    rmDirForce(mockTestsDir);
    rmDirForce(mockTestExecDir);
  });
});
//\ 4. 한번 빌드해보고 결과를 알려준다.

})()

