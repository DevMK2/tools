#!/usr/bin/env python

import os
import sys
import subprocess
import re
from curses import wrapper
from scroller import Screen, Item

IDX_USR  = 0
IDX_PID  = 1
IDX_NAME = 10

class PS(Item): 
    def __init__(self, lineArray, index=1):
        self.usr  = lineArray[IDX_USR] 
        self.pid  = lineArray[IDX_PID]
        self.name = ' '.join(lineArray[IDX_NAME:])
        if(len(self.name) > 70):
            self.name = self.name[:61]+'.... more'
        data = [self.pid, self.usr, self.name]
        Item.__init__(self, index, data)

    def aPrint(self, idx=0):
        print('user name : ', self.usr,'\n',
              'proc pid  : ', self.pid,'\n',
              self.name,'\n')

    def Delete(self):
        if not self.selected:
            return
        os.system(' '.join(['kill', '-9', str(self.pid)]))

def CreateProcs(lines):
    allProcs = []
    for idx in range(len(lines)):
        lineArray = re.split('\s+',lines[idx])
        if(len(lineArray)!=1):
            allProcs.append(PS(lineArray, idx))
    return allProcs

def CallPS(procName):
    proc1 = subprocess.Popen(['ps','aux'], stdout=subprocess.PIPE)
    proc2 = subprocess.Popen(['grep',procName], stdin=proc1.stdout,
            stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    proc1.stdout.close()
    out, err = proc2.communicate()
    return out.decode('utf-8')

def GetProcName(argv):
    if len(argv) == 2 :
        return argv[1]
    return input('Input process name : ')
    

if __name__== "__main__":
    procName = GetProcName(sys.argv)

    # trim and split
    psReturnString = CallPS(procName).strip()
    lines = re.split('\n',psReturnString)

    procs = CreateProcs(lines)
    for ps in procs:
        ps.Print()

    Screen(procs)
