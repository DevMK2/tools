import numpy as np
import matplotlib.pyplot as plt
from pandas import Series as se, DataFrame as df
import pandas as pd
import sys

maxAbsIdx = 2
meanIdx = 4
minIdx = 6
varIdx = 8

#mode = 'max'
mode = 'mean'
label = []

def setLim(lower, higher):
    global mode
    if mode == 'max':
        lower.set_ylim(0, 1)
        higher.set_ylim(15,30)
    elif mode == 'mean':
        lower.set_ylim(0, 0.1)
        higher.set_ylim(0.5,1.5)

def getData(array):
    global mode 
    if mode == 'max':
        return array[0]
    elif mode == 'mean':
        return array[1]

def getTitle():
    titlePostfix = ' elapsed time per Update'
    global mode 
    if mode == 'max' :
        return 'Max' + titlePostfix
    elif mode == 'mean' :
        return 'Mean' + titlePostfix


def parseLine(line):
    tkn = line.split()
    name = tkn[0]
    maxAbsTime = float(tkn[maxAbsIdx]) * 1000
    meanTime =   float(tkn[meanIdx]) * 1000
    return name.split('::')[-1], np.array(getData([maxAbsTime, meanTime]))

def readFile(fileName="World::Step.log"):
    global mode
    global label
    f = open(fileName, "r")

    lines = f.readlines()
    f.close()

    lines.reverse()

    name, times = parseLine(lines[0])

    lines = lines[1:]

    data = []
    for line in lines:
        nextName, nextTimes = parseLine(line)
        print(nextName, nextTimes)

        if name == "Update":
            name = "modelUpdate"

        label.append(name)
        data.append(nextTimes - times)

        if name in ["SetWorldPose(dirtyPoses)", "LogRecordNotify", "needsReset", "PublishContacts"]:
            label.pop()
            data.pop()

        name = nextName
        times = nextTimes


    return df({mode : data}, index=label)

def drawGraph(fileName="World::Step.log"):
    global mode
    data = readFile(fileName)

    data = data.sort_values(by=[mode])

    fig, (ax1, ax2) = plt.subplots(2,1,sharex=True,figsize=(5,6))
    ax1.spines['bottom'].set_visible(False)
    ax1.tick_params(axis='x', which='both', bottom=False)
    ax2.spines['top'].set_visible(False)
    
    setLim(lower=ax2, higher=ax1)

    data.plot(ax=ax1, kind='bar', legend=False, rot=20, title=getTitle())
    data.plot(ax=ax2, kind='bar', legend=False, rot=20)

    #data = data[columns]
    with pd.option_context('display.max_rows', None, 'display.max_columns', None):
        print(data)

    d = .015  
    kwargs = dict(transform=ax1.transAxes, color='k', clip_on=False)
    ax1.plot((-d, +d), (-d, +d), **kwargs)      
    ax1.plot((1 - d, 1 + d), (-d, +d), **kwargs)
    kwargs.update(transform=ax2.transAxes)  
    ax2.plot((-d, +d), (1 - d, 1 + d), **kwargs)  
    ax2.plot((1 - d, 1 + d), (1 - d, 1 + d), **kwargs)

    #ax = data.sort_values(by=[mode]).plot(kind='barh', title=getTitle(), rot=45, legend=False)
    #ax.set_xlim(0,4)
    for p in ax1.patches: 
       left, bottom, width, height = p.get_bbox().bounds
       ax1.annotate("%.2f ms"%height, (left+width/2, height*1.01), ha='center')
       #ax.annotate("%.2f ms"%width, (width*1.01, bottom+height/2), va='center')
    for p in ax2.patches: 
       left, bottom, width, height = p.get_bbox().bounds
       ax2.annotate("%.2f ms"%height, (left+width/2, height*1.01), ha='center')

    plt.show()

drawGraph(sys.argv[1])
