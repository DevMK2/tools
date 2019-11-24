#include "Assert.h"
#include <cassert>
#include <iostream>

void Assert(int l, int r)
{
    if (l != r)
        std::cout<<"real : "<< l<<", expect : "<< r<<"\n" << std::endl;
    assert(l == r);
}
