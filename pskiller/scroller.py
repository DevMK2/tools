import curses
import curses.textpad

class Screen(object):
    UP = -1
    DOWN = 1

    def __init__(self, items):
        self.window = None
        self.width = 0
        self.height = 0

        self.offsetY = 5
        self.offsetX = 5

        self.title=''
        self.helpBar=''
        self.init_curses()
        self.init_title()

        self.items = items
        self.max_lines = curses.LINES - 2*self.offsetY
        self.top = 0
        self.bottom = len(self.items)
        self.current = 0
        self.page = self.bottom // self.max_lines
        self.run()

    def init_title(self):
        midpoint = self.width/2

        strList = []
        for i in range(int(midpoint-(len('pskiller')/2))):
            strList.append(' ')
        strList.append('pskiller\n')
        for i in range(self.width):
            strList.append('=')
        self.title = ''.join(strList)

        strList = []
        line1 = 'q     : quit              h,j,k,l : move cursor            '
        line2 = 'enter : select process    dd      : kill selected processes'
        for i in range(self.width):
            strList.append('=')
        for i in range(int(midpoint-(len(line1)/2))):
            strList.append(' ')
        strList.append(line1)
        strList.append('\n')
        for i in range(int(midpoint-(len(line2)/2))):
            strList.append(' ')
        strList.append(line2)
        self.helpBar = ''.join(strList)


    def init_curses(self):
        """Setup the curses"""
        self.window = curses.initscr()
        self.window.keypad(True)

        curses.noecho()
        curses.cbreak()

        curses.start_color()
        curses.init_pair(1, curses.COLOR_CYAN, curses.COLOR_BLACK)
        curses.init_pair(2, curses.COLOR_BLACK, curses.COLOR_CYAN)
        curses.init_pair(3, curses.COLOR_WHITE, curses.COLOR_RED)

        self.current  = curses.color_pair(2)
        self.selected = curses.color_pair(3)

        self.height, self.width = self.window.getmaxyx()

    def run(self):
        try:
            self.input_stream()
        except KeyboardInterrupt:
            pass
        finally:
            curses.endwin()

    def input_stream(self):
        while True:
            self.render()

            ch = self.window.getch()
            if ch == curses.KEY_UP or ch == ord('k'):
                self.scroll(self.UP)
            elif ch == curses.KEY_DOWN or ch == ord('j'):
                self.scroll(self.DOWN)
            elif ch == curses.KEY_LEFT or ch == ord('h'):
                self.paging(self.UP)
            elif ch == curses.KEY_RIGHT or ch == ord('l'):
                self.paging(self.DOWN)
            elif ch == curses.KEY_ENTER or ch == ord('\n'):
                self.items[self.current+self.top].Click()
            elif ch == curses.ascii.ESC or ch == ord('q'):
                break

    def scroll(self, direction):
        # next cursor position after scrolling
        next_line = self.current + direction

        if (direction == self.UP) and (self.top > 0 and self.current == 0):
            self.top += direction
            return
        if (direction == self.DOWN) and (next_line == self.max_lines) and (self.top + self.max_lines < self.bottom):
            self.top += direction
            return
        if (direction == self.UP) and (self.top > 0 or self.current > 0):
            self.current = next_line
            return
        if (direction == self.DOWN) and (next_line < self.max_lines) and (self.top + next_line < self.bottom):
            self.current = next_line
            return

    def paging(self, direction):
        current_page = (self.top + self.current) // self.max_lines
        next_page = current_page + direction

        if next_page == self.page:
            self.current = min(self.current, self.bottom % self.max_lines - 1)
        if (direction == self.UP) and (current_page > 0):
            self.top = max(0, self.top - self.max_lines)
            return
        if (direction == self.DOWN) and (current_page < self.page):
            self.top += self.max_lines
            return

    def render(self):
        self.window.erase()
        self.window.addstr(0 , 0, self.title, curses.color_pair(1))
        self.window.addstr(self.max_lines+ self.offsetY, 0, self.helpBar, curses.color_pair(1))

        maxWinIDX = self.top + self.max_lines 
        maxItmIDX = len(self.items)
        currBottom = maxWinIDX if maxWinIDX < maxItmIDX else maxItmIDX-self.top

        for idx in range(self.top, currBottom):
            # Highlight the current cursor line and Override the selected cursor lines color
            if self.items[idx].selected == True:
                color = curses.color_pair(3)
            elif idx-self.top == self.current:
                color = curses.color_pair(2)
            else:
                color = curses.color_pair(1)
            self.window.addstr(self.offsetY+idx-self.top, self.offsetX, self.items[idx].Print(), color)
        self.window.refresh()


class Item:
    def __init__(self,index,data=0):
        self.data  = data
        self.index = index
        self.selected = False
    def Print(self):
        return '%d Item'%self.index
    def Click(self):
        self.selected = False if self.selected==True else True

def main():
    items = [Item(index=num) for num in range(1000)]
    Screen(items)


if __name__ == '__main__':
    main()

    #window = curses.initscr()
    #max_lines = curses.LINES
    #print('max lines : ',max_lines,'\n')
