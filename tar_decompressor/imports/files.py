import os

def getDirList(_dirName):
    ret = []
    fileList = os.listdir(_dirName)
    for afile in fileList :
        if isDir_fullpath('/'.join([_dirName,afile])) :
            ret.append(afile)
    return ret

def getFileList(_dirName):
    ret = []
    fileList = os.listdir(_dirName)
    for afile in fileList :
        if os.path.isfile(afile) :
            ret.append(afile)
    return ret

def isDir_fullpath(_fullPath):
    return os.path.isdir(_fullPath)

def isFile_fullpath(_fullPath):
    return os.path.isfile(_fullPath)
