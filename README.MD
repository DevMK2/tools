# 1. compile_tar 
- tar 압축 해제 및 c 컴파일 후 실행. (aka 채점)
## dependency
1. python3
2. should run in bash & zsh terminal  

## usage
1. .bashrc 에 다음 입력 
``` 
source {위치}/tools/setup.bash
```
2. 압축 파일이 모여있는 디렉토리로 이동해서 compile_tar 실행
3. 과제에서 요구한 문항 수 입력
4. 압축이 해제되면 아무키나 눌러서 컴파일 진행
5. 컴파일 다되면 아무키나 눌러서 프로그램 하나씩 실행

<br><br>
# 2. tar_decomp 
- compile_tar 의 서브모듈이다. tar 압축해제만 해줌
## dependency
1. python3
2. should run in bash & zsh terminal  
## usage
1. .bashrc 에 다음 입력
``` 
source {위치}/tools/setup.bash
```
2. 압축 파일이 모여있는 디렉토리로 이동해서 tar_decomp실행
3. 과제에서 요구한 문항 수 입력

<br><br>
# 3. pskiller
## dependency
1. python3
2. should run in bash & zsh terminal  
## usage
1. .bashrc 에 다음 입력
``` 
source {위치}/tools/setup.bash
```
2. pskil 입력하여 프로그램실행
3. 죽일 프로세스 이름 입력
4. 나타나는 리스트 중 죽일 프로세스 이름을 방향키와 엔터키로 선택하여 'dd'
5. 프로그램 종료 위해 'q' 입력
