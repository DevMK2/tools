#-*- coding:UTF-8 -*-
#!/usr/bin/env python3
import os
import sys
currDir = os.getcwd()
destDir = '/'.join([currDir,'temp__'])
execDest = '/'.join([currDir,'temp__exec'])
importDir = os.environ['TOOLS_ROOT_PATH']
sys.path.append('/'.join( [importDir,'tar_decompressor','imports']))
import files
sys.path.append('/'.join( [importDir,'tar_decompressor']))
from TarDecompressor import DecompTar

C_BOLD = "\033[1m"
C_RED  = "\033[31m"
C_END  = "\033[0m"

if __name__ == '__main__':
    countHW = input('Input number of required homework fiels : ')
    while not countHW.isnumeric():
        countHW = input('Input number of required homework fiels(only Number) : ')

    decompressor = DecompTar(destDir, countHW)
    fileList = files.getFileList(currDir)
    homeworks = decompressor.decompAll(fileList) 
    for homework in homeworks:
        homework.CountingC()
        homework.PrintStat(int(countHW))

    countHW = input(C_RED+C_BOLD+"\nEnter any key to compile all ..."+C_END)
    os.system('clear')
    if not os.path.isdir(execDest):
        os.makedirs(execDest)
    for homework in homeworks:
        homework.CompileAll(execDest)
    os.chdir(execDest)

    #countHW = input(C_RED+C_BOLD+'\nEnter any key to execute files ...'+C_END)
    #os.system('clear')
    #for homework in homeworks:
        #homework.ExecFiles()

    countHW = input(C_RED+C_BOLD+'\nEnter any key to see reports ...'+C_END)
    os.system('clear')
    for homework in homeworks:
        homework.ReportResult()
