#include <iostream>
#include <time.h>

int main(int argc, const char *argv[])
{
    while(1) {
        std::cout<<(double)clock()/CLOCKS_PER_SEC<<std::endl;
    }
    return 0;
}
