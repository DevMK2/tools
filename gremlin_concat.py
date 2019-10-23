#!/usr/bin/env python
import os
import re
cwd = os.getcwd();
fileList = ['OrbitControls.js', 'gremlin.js', 'three.js'];
destPath = os.path.join(cwd,'gremlin_gui.js');

def txtRead(fileName):
    r = open(os.path.join(cwd, fileName), mode='rt', encoding='utf-8');
    txt = r.read();
    r.close();
    return txt;
    
def txtWrite(txt):
    f = open(destPath, mode='wt', encoding='utf-8');
    f.write(txt);
    f.close();

def txtNo(what, txt):
    if what=='tab':
        return txt.replace('\t','');
    elif what=='comment':
        comment = re.compile('\/\/.*(\n|\r|\r\n)')
        return re.sub(comment,'',txt);
        #print(txts);
        #return '\n'.join(list(filter(
        #    lambda x: not x.startswith('//'),txts)));
    elif what=='CR':
        return txt.replace('\n','');

def txtComp(txt):
    txt = txtNo('tab',txt);
    txt = txtNo('comment',txt);
    return txt
    #txtNo('CR',txt);

txt = '\n'.join(list(map(txtRead, fileList)));
txtWrite(txtComp(txt));
