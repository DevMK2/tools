#include "Assert.h"
#include <assert.h>
#include <stdio.h>

void Assert(int l, int r)
{
    if (l != r)
        printf("real : %d, expect : %d\n", l, r);
    assert(l == r);
}
