#!/usr/bin/env python3
import os
import files
import re

C_END  = "\033[0m"
C_BOLD = "\033[1m"
C_RED  = "\033[31m"

class HomworkFile :
    def __init__(self, _fullPath):
        self.path = _fullPath
        self.student = _fullPath.split('/')[-1]
        self.countC = 0
        self.namesC = []
        self.pathesC = []

    def Author(self):
        return self.student

    def CountingC(self, _path = ''):
        path = _path if len(_path)!=0 else self.path
        fileList = os.listdir(path)
        for afile in fileList :
            if files.isDir_fullpath('/'.join([path, afile])) :
                self.CountingC('/'.join([path, afile]))
            elif(re.match('.*\.c', afile)):
                self.countC += 1
                self.namesC.append(afile)
                self.pathesC.append('/'.join([path,afile]))
        self.namesC.sort()

    def PrintStat(self, countHW=0):
        if self.countC<countHW:
            print(C_BOLD+C_RED)
        print('\nHomwork : ',self.student+' --------------')
        print('- number of c sources : ',self.countC)
        for pathC in self.pathesC:
            print('-- ',pathC)
        print(C_END)

    def CompileAll(self, destDir=''):
        for i in range(len(self.pathesC)):
            if not os.system('gcc -o '+destDir+self.student+
                    '_'+self.namesC[i]+' '+self.pathesC[i]):
                print(pathesC[i])
        #os.system('clear')
