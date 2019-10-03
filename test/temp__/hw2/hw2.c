#include <stdio.h>

int main(int argc, const char *argv[])
{
    int a;
    double b;

    int num;
    num = scanf("%lf %d", &b,&a);
    //fflush(stdin);

    printf("%d, %f, %x, %o, %c\n", b,b,b,b,b);
    fflush(stdin);
    fflush(stdout);
    printf("%d, %f, %x, %o, %c\n", a,a,a,a,a);
    return -1;
}
