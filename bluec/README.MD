# BlueC

이 프로젝트는 c, c++로 이루어진 프로젝트의 유닛테스트 환경을 제공한다.

BlueC는 현재 command line interface 만을 지원하며 'bluec' command와 세 개의 명령 인자를 통해 유닛테스트를 구성하는 세 단계를 진행할 수 있다.

BlueC는 'bluec' cli가 입력 된 current working directory를 project-root로 취급하여 '${project_root}/src' 디렉토리에 프로젝트 소스파일이 있는 것으로 생각한다.

BlueC는 소스파일들의 유닛테스트를 위한 테스트파일들을 '${project_root}/tests'에 저장하며, 테스트파일들이 의존성을 가지는 소스파일이 수정되면 테스트 파일들을 컴파일 후 실행하도록 되어있다.

소스파일들에 대한 테스트파일들의 의존성 및 컴파일옵션 등은 bluec의 런타임 설정파일인 'BluecFile.js'에 사용자가 명세한다.

# Environment
실행 환경은 프로젝트 동작을 테스트한 환경을 나타내며 지속적으로 업데이트 예정이다.
1. OS
    - Ubuntu 16.04 LTS

2. Terminal
    - zshell
    - bash

3. Runtime environment
    - node v10.16.0

# Usage - CLI
'bluec' cli의 세 명령어를 소개한다.

1. 아래의 명령어는 '${project_root}/src' 내의 파일들을 기반으로 Bluec의 런타임 설정파일인 'BluecFile.js'의 스켈레톤코드를 project-root에 생성한다.
또한 'tests' 디렉토리가 root에 존재하는지 검사하여 없으면 생성한다.
```
$ bluec init
```

2. 아래의 명령어는 사용자가 'BlueFile.js' 스켈레톤을 적절하게 수정하였음을 가정하여, tests 디렉토리에 테스트 코드들의 스켈레톤을 생성하고 빌드한다. 빌드가 실패하면 사용자에게 이를 알려 'BlueFile.js'에서 의존성을 수정하도록 요청한다.

    - 'BluecFile.js' 파일이 없으면 해당 파일이 없음에 대한 에러 메시지를 출력한다.
    - 'tests'디렉토리가 없으면 만든다. 
    - 빌드 실패시 사용자에게 요청함과 동시에 'tests'의 내용은 모두 삭제된다.
```
$ bluec begin
```

3. 아래 명령어는 'BluecFile.js' 로 부터 의존성을 알고 있는 모든 테스트소스를 컴파일 후 실행한다. 위의 두 명령어를 수행하지 않아도 'BluecFile.js'가 있으면 이 커맨드는 실행될 수 있다. 
    - 'BluecFile.js' 파일이 없으면 해당 파일이 없음에 대한 에러 메시지를 출력한다.
    - 'tests' 디렉토리가 없으면 해당 디렉토리가 없음에 대한 에러를 출력한다.
    - 이후 지속적으로 'BluecFile.js'에 의존성이 입력된 소스코드를 watch하다가 소스코드가 변경될때 해당 코드에 의존성을 가지는 테스트 코드를 빌드, 실행한다.

```
$ bluec run
```