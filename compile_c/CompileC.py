#!/usr/bin/env python3
import os
import sys
currDir = os.getcwd()
destDir = '/'.join( [currDir,'temp__'] )
importDir = os.environ['TOOLS_ROOT_PATH']
sys.path.append('/'.join( [importDir,'tar_decompressor','imports'] ))
import files
sys.path.append('/'.join( [importDir,'tar_decompressor'] ))
from TarDecompressor import DecompTar

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

    countHW = input('Enter any key to compile all ...')
    for homework in homeworks:
        homework.CompileAll()

    countHW = input('\n----------- Exec files--------------')
    for homework in homeworks:
        homework.ExecFiles()
    #i=0
    #for cfile in fileList :
        #if not os.system('gcc -o '+str(i)+' '+cfile):
            #print(cfile)
    #os.system('clear')
