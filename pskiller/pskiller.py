#!/usr/bin/env python

import os
import subprocess
import re
from curses import wrapper

IDX_USR  = 0
IDX_PID  = 1
IDX_NAME = 10

class PS: 
    def __init__(self, lineArray):
        self.usr  = lineArray[IDX_USR] 
        self.pid  = lineArray[IDX_PID]
        self.name = ' '.join(lineArray[IDX_NAME:])
        if(len(self.name) > 70):
            self.name = self.name[:61]+'.... more'

    def Print(self, idx=0):
        print('user name : ', self.usr,'\n',
              'proc pid  : ', self.pid,'\n',
              self.name,'\n')

def CreateProcs(lines):
    allProcs = []
    for line in lines:
        lineArray = re.split('\s+',line)
        if(len(lineArray)!=1):
            allProcs.append(PS(lineArray))
    return allProcs

def CallPS():
    proc1 = subprocess.Popen(['ps','aux'], stdout=subprocess.PIPE)
    proc2 = subprocess.Popen(['grep','vim'], stdin=proc1.stdout,
            stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    proc1.stdout.close()
    out, err = proc2.communicate()
    return out.decode('utf-8')


def render(screen):
    screen.clear()
    screen.addstr(i,j,"hello, world")
    screen.refresh()
    while True:
        try:
            k = screen.getkey()
            if k == '\n':break
        except KeyboardInterrupt:
            break

if __name__== "__main__":
    # trim and split
    psReturnString = CallPS().strip()
    lines = re.split('\n',psReturnString)

    procs = CreateProcs(lines)
    for ps in procs:
        ps.Print()

    wrapper(render)
