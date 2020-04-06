node express로 간단한 테스팅용 서버의 스켈레톤을 구현하기 위함

커맨드
```
$mkexpress {dirName} {--tdd} {--port={number}}
```

1. mkdir {dirName}& cd {dirName}
   dirname이 없으면?
   - 현재 디렉토리에 만들건지 물어보고 맞으면 만든다( no no )
   - 현재 디렉토리에 만들게 아니면 'test_server'라는 이름으로 만든다

2. npm init -y

3. package.json 수정
   - --tdd 옵션이 없으면 skeleton/package.runonly.json
   - --tdd 옵션이 있으면 skeleton/package.tdd.json
   을 복사한다.

4. npm i --save-dev express ejs grunt grunt-contrib-watch grunt-contrib-connect
   - --tdd 옵션이 없으면 끝
   - --tdd 옵션이 있으면 mocha should 추가

5. mkdir views && mkdir static && cd static && mkdir js && mkdir css

6. skeleton/Gruntfile.js 이동.
   - --port 옵션이 있으면 module.connect.server.options.port 를 변경(미구현)

7. skeleton/server.js 이동.
   - --port 옵션이 있으면 첫줄의 PORT 변경

8. skeleton/index.html 이동 to views/
