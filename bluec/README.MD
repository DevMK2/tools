# BlueC

이 프로젝트는 c, c++로 이루어진 프로젝트의 유닛테스트 환경을 제공한다.

1. 아래의 명령어는 현재 디렉토리에서 'src' 디렉토리를 찾아 'src' 디렉토리 내의 c, c++ 소스파일 테스트를 위한  설정파일인 'BluCfile.js'과 'tests' 디렉토리, 하위 파일들을 생성한다.
```
$ bluec init
```

2. 아래 명령어는 하위 디렉토리의 모든 'BlueCfile.js' 설정을 실행하여 c, c++ 소스의 테스트를 실행한다.

```
$ bluec run
```


## Environment
실행 환경은 프로젝트 동작을 테스트한 환경을 나타내며
지속적으로 업데이트 예정이다.
1. OS
    - Ubuntu 16.04 LTS

2. Terminal
    - zshell
    - bash

3. Runtime environment
    - node v10.16.0