import json
import time
import urllib.request
from tkinter import Tk
from _tkinter import TclError

class ServerError(Exception):
    def __init__(self, expression, message):
        self.expression = expression
        self.message = message

"""
papago api 요청 위한 고정 정보
client_id, client_secret은 네이버 개발자 센터에서 어플리케이션 등록하면 받을 수 있음
data의 source엔 번역하고자 하는 언어코드, target엔 번역 결과로 원하는 언어코드.
현재는 영어(en)를 한글(ko)로 번역하도록 적어놨음
"""
papago_url = "https://openapi.naver.com/v1/papago/n2mt"
client_id = "_vYGA8y_rZOgud30SWCo"
client_secret = "8mqmYOREtC"
data = "source=en&target=ko&text="

def translate(text):
    """
    전역변수 data에 @text를 덧붙인 다음에 papago url로 요청 보냄.

    args:
    @text: [string]번역을 요청하고자하는 텍스트(영어)

    @return: [string]번역결과 텍스트 (utf-8 한글)

    @Exceptions: 
        resonse code가 429인 경우 일일 사용량 초과...
        resonse code가 200이 아닌경우 내부 서버 에러
    """
    request = urllib.request.Request(papago_url)
    request.add_header("X-Naver-Client-Id", client_id)
    request.add_header("X-Naver-Client-Secret", client_secret)
    request_data = data+text

    response = urllib.request.urlopen(request, data=request_data.encode("utf-8"))
    rescode = response.getcode()
    if rescode is 200 :
        print('translate '+str(len(text))+' texts')
        return json.loads(response.read().decode('utf-8'))['message']['result']['translatedText']
    elif rescode is 429 :
        raise ServerError('papago api exceeded usage :: '+str(rescode))
    else:
        raise ServerError('papago api response with :: '+str(rescode))

def getClipboard():
    """
    현재 클립보드에 있는 내용을 return. 클립보드 내용이 text일 때만 읽을 수 있음

    @return: [String]클립보드 내용 or [boolean]False (클립보드 내용이 텍스트가 아닌경우)
    """
    root = Tk()
    root.withdraw()

    result = None

    try:
        result = root.clipboard_get()
    except TclError as e:
        return False

    return result

if __name__ == "__main__":
    prevText = ""

    while True:
        time.sleep(0.5);

        currText = getClipboard();
        if currText is False:
                continue # 클립보드 내용이 텍스트가 아님

        currText = currText.replace("\n","")
        if currText == prevText:
            continue # 클립보드 내용이 이전과 같음

        try: 
            print(translate(currText))
        except ServerError as e:
            print(e)

        prevText = currText
