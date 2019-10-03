#!/usr/bin/env python3
import os
import files
import re

C_BOLD = "\033[1m"
C_RED  = "\033[31m"
C_END  = "\033[0m"

class HomeworkResult :
    def __init__(self):
        self.errCompile = []
        self.errRuntime = []
        self.lessSubmit = 0

    def ReportLessSubmition(self):
        print('less submit : ' + str(self.lessSubmit))

    def ReportCompileError(self):
        print('compile error :'+ str( len(self.errCompile)))
        for files in self.errCompile :
            print('    ',files)

    def ReportRuntimeError(self):
        print('runtime error :'+ str( len(self.errRuntime)))
        for files in self.errRuntime :
            print(files)

class HomworkFile :
    def __init__(self, _fullPath):
        self.path = _fullPath
        self.student = _fullPath.split('/')[-1]
        self.countC = 0
        self.namesC = []
        self.pathesC = []
        self.namesExec = []
        self.result = HomeworkResult()

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
            self.result.lessSubmit = countHW-self.countC
            print(C_BOLD+C_RED)
        print('\n----'+'Homwork of : ',self.student+' --------------')
        print('- number of c sources : ',self.countC)
        for pathC in self.pathesC:
            print('-- ',pathC)
        print(C_END)

    def CompileAll(self, destDir=''):
        for idx in range(len(self.pathesC)):
            nameExec = self.student+'_'+self.namesC[idx]
            if os.system('gcc -o '+ destDir + nameExec +' ' +self.pathesC[idx]+' -lm')==0:
                print('compile success : '+self.pathesC[idx])
                self.namesExec.append(nameExec)
            else:
                self.result.errCompile.append(self.pathesC[idx])
                print(C_BOLD+C_RED+'compile failed : '+self.pathesC[idx]+C_END)

    def ExecFiles(self):
        print('\n----'+'Homwork of : ',self.student+' --------------')
        for idx in range(len(self.namesExec)):
            print('\n'+str(idx+1)+'. '+self.namesExec[idx])
            if os.system('./'+self.namesExec[idx]) == 0:
                self.result.errRuntime.append(self.pathesC[idx])
            null = input('Enter any key to execute next code ...')

    def ReportResult(self):
        print('\n----'+'Homework of : ',self.student+' --------------')
        self.result.ReportLessSubmition()
        self.result.ReportCompileError()
        self.result.ReportRuntimeError()
