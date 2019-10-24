#!/usr/bin/env python
import os
import shutil
from PyConsoleFonts import RedNBold as RNB


if __name__ == "__main__":
    fileName = 'pytest.ini'
    currPath = '/'.join([os.getcwd(), fileName])
    filePath = '/'.join(
            [os.environ['TOOLS_ROOT_PATH'], 'init_pytest', fileName])

    shutil.copyfile(filePath, currPath)
    print('...\n... Complete to create a ' + RNB(fileName) + ' !')
    print('... Typing "' + RNB('ptw')
          + '" to start test driven python coding')
