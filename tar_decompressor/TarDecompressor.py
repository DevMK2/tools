##############################################################
# usage:
# 애들이 제출한 과제 압축파일들 있는 디렉토리에서 실행하면 
# 압축을 해제하고 c파일의 갯수를 출력한다.
#
# desc:
# 1.tar 형식으로 압축된 모든 파일들을 destDir에 압축 해제한다
# ( tar, tar.gz, 확장자 없는 tar 다 됨. zip도 되는지는 잘 모름)
#
# 2.압축 풀린 디렉토리들을 각각 Homework 객체로 만든다.
#
# 3.Homework 객체는 마지막에 .c로 끝나는 파일만 c 소스파일로
#   인식하고 추가한다. ( recursive 탐색 가능)
#
# Author : myungkeun lee ( mkro0616@gmail.com )
##############################################################

#!/usr/bin/env python3
import os
currDir = os.getcwd()
destDir = '/'.join( [currDir,'temp__'] )

import sys
import tarfile
sys.path.append('/'.join( [os.path.dirname(os.path.abspath(__file__)),'imports'] ))
import files
from homework import HomworkFile

class DecompTar :
    def __init__(self,destDir,countHW):
        self.destDir = destDir
        self.countHW =countHW

    def decompAll(self,fileList):
        for afile in fileList :
            self.decompTar(afile, destDir)
        # dest의 각 dir를 HomeworkFile 객체로 만들기
        homeworks = []
        decompedDirList = files.getDirList(destDir)
        for aDir in decompedDirList :
            homeworks.append(HomworkFile('/'.join([destDir,aDir])))
        return homeworks

    def decompTar(self, _fileName, _dest='.'):
        if tarfile.is_tarfile(_fileName) == False :
            print('ERR : ',_fileName,' is not tar file')
            # TODO error case만 모아놓은 log 만들기 필요한지?
            return
        tar = tarfile.open(_fileName)
        tar.extractall(_dest)

if __name__ == '__main__':
    # 과제에서 요구된 문항 수 입력
    countHW = input('Input number of required homework fiels : ')
    decompressor = DecompTar(destDir=destDir, countHW=countHW)

    if not os.path.isdir(destDir):
        os.makedirs(destDir)
    # currDir의 모든 압축형식파일 destDir에 압축풀기
    fileList = files.getFileList(currDir)
    for afile in fileList :
        decompressor.decompTar(afile, destDir)
    # dest의 각 dir를 HomeworkFile 객체로 만들기
    homeworks = []
    decompedDirList = files.getDirList(destDir)
    for aDir in decompedDirList :
        homeworks.append(HomworkFile('/'.join([destDir,aDir])))
    # 모든 HomeworkFile 객체가 가진 c 소스파일 수를 세서 출력
    for homework in homeworks:
        homework.CountingC()
        homework.PrintStat(int(countHW))
