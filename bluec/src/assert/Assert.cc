#include "Assert.h"
#include <cassert>
#include <iostream>

void Assert(int l, int r)
{
    if (l != r)
        std::cout<<"real : "<< l<<", expect : "<< r<<"\n" << std::endl;
    assert(l == r);
}

void Assert(const std::string& _l, const std::string& _r) {
    if(_l != _r)
        std::cout<<"real : "<< _l<<", expect : "<< _r<<"\n" << std::endl;
    assert(_l == _r);
}
