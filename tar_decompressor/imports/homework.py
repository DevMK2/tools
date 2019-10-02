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
        self.namesExec = []

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
                self.namesC.append(afile.split('.c')[0])
                self.pathesC.append('/'.join([path,afile]))
        self.namesC.sort()

    def PrintStat(self, countHW=0):
        if self.countC<countHW:
            print(C_BOLD+C_RED)
        print('\n----'+'Homwork of : ',self.student+' --------------')
        print('- number of c sources : ',self.countC)
        for pathC in self.pathesC:
            print('-- ',pathC)
        print(C_END)

    def ExecFiles(self):
        for execFile in self.namesExec:
            print(execFile)
            os.system('./'+execFile)
            null = input('Enter any key to execute next code ...')

    def CompileAll(self, destDir=''):
        for i in range(len(self.pathesC)):
            nameExec = self.student+'_'+self.namesC[i]

            if os.system('gcc -o '+ destDir + nameExec +' ' +self.pathesC[i])==0:
                print('compile success : '+self.pathesC[i])
                self.namesExec.append(nameExec)
            else:
                print(C_BOLD+C_RED+'compile failed : '+self.pathesC[i]+C_END)
        # os.system('clear')
