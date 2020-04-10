import time
import re

# for PAPAGO
import json
import urllib.request

class ExceedUsageError(Exception):
    def __init__(self, expression, message):
        self.expression = expression
        self.message = message

class ServerError(Exception):
    def __init__(self, expression, message):
        self.expression = expression
        self.message = message

papago_url = "https://openapi.naver.com/v1/papago/n2mt"
client_id = "_vYGA8y_rZOgud30SWCo"
client_secret = "8mqmYOREtC"
data = "source=en&target=ko&text="

def translatePapago(text):
    request = urllib.request.Request(papago_url)
    request.add_header("X-Naver-Client-Id", client_id)
    request.add_header("X-Naver-Client-Secret", client_secret)
    request_data = data+text

    try:
        response = urllib.request.urlopen(request, data=request_data.encode("utf-8"))
        rescode = response.getcode()
        if rescode == 200 :
            return json.loads(response.read().decode('utf-8'))['message']['result']['translatedText']
        elif rescode == 429 :
            raise ExceedUsageError('papago api exceeded usage :: '+str(rescode), '')
        else:
            raise ServerError('papago api response with :: '+str(rescode), '')
    except:
        raise ExceedUsageError('papago api request exception', '')


# for google-transfer
from googletrans import Translator

tr = Translator()
def translateGoogle(text):
    return tr.translate(text, src='en', dest='ko').text 


# to reading clipboard
from tkinter import Tk
from _tkinter import TclError

window = Tk()
window.withdraw()
def getClipboard():
    result = None

    try:
        result = window.clipboard_get()
    except TclError:
        return False

    return result


accumTranlateLength = 0 
def translate(text):
    global accumTranlateLength

    text = text.replace("-\n","")
    text = text.replace("\n"," ")
    text = re.sub('\[\d+\]', '', text)
    text = re.sub(' et al.', '', text)

    translateLength = len(text)
    accumTranlateLength += translateLength

    print('\n' + 'Translate text : ' + str(translateLength) + " / " + str(accumTranlateLength))

    ttext = ' '
    try: 
        ttext += translatePapago(text)
    except ExceedUsageError:
        ttext += translateGoogle(text)
    except ServerError as e:
        print(e)

    return ttext.replace('.', '.\n')


if __name__ == "__main__":
    prevText = ""

    while True:
        time.sleep(0.5)

        currText = getClipboard()
        if currText == False:
            continue # 클립보드 내용이 텍스트가 아님

        if currText == prevText:
            continue # 클립보드 내용이 이전과 같음

        prevText = currText

        print(translate(currText))
