from googletrans import Translator

tr = Translator()

text = 'hello'
textLen = len(text)
translateCount = 0
maxTranslateCount = 100000

while translateCount < maxTranslateCount:
  translateCount += textLen
  print(tr.translate(text, src='en', dest='ko').text + " " + str(translateCount)+"/"+str(maxTranslateCount))