#include <stdio.h>
#include <math.h>

void Ex1(){ 
    int a, b;
    if(scanf("%d %d",&a, &b) !=2) return;
    fflush(stdin);

    printf("%d >  %d = %d\n", a, b, a>b);
    printf("%d >= %d = %d\n", a, b, a>=b);
    printf("%d <  %d = %d\n", a, b, a<b);
    printf("%d <= %d = %d\n", a, b, a<=b);
    printf("%d == %d = %d\n", a, b, a==b);
    printf("%d != %d = %d\n", a, b, a!=b);
}

void Ex2() {// include ex2 and ex3
    int input;
    printf("Enter a integer:");
    if(scanf("%d",&input) != 1) return;
    fflush(stdin);

    if(input%5 == 0) {
        printf("%d is multiple of 5\n", input);
    }
    else {
        char* oddOrEven = input%2==0? "even":"odd";
        printf("%d is %s number\n", input, oddOrEven);
    }
}

#define PI  3.141592655
float deg2rad(int degree){
    return degree*PI/180;
}
void Ex4() {
    char* whiteSpace ="      ";
    printf("%sdegree%ssine%scosine%stangent%s\n",
            whiteSpace,whiteSpace,whiteSpace,whiteSpace,whiteSpace);
    whiteSpace ="    ";

    for(int i=0; i!=21; ++i) {
        double inputRad = ((double)i/10.0)*PI;
        printf("%s    %.2d%s  % .4f%s% .4f%s  % .4f%s\n",
                whiteSpace,i,whiteSpace,
                sin(inputRad),whiteSpace,
                cos(inputRad),whiteSpace,
                tan(inputRad),whiteSpace);
    }

}

void Ex5() {
    printf("  ");
    for(int i=0; i!=16; ++i){
        printf(" %2d",i);
    }
    printf("\n");

    for(int i=0; i!=16; ++i) {
        printf("%2d",i);
        for(int j=0; j!=16; ++j){
            printf(" %x%x",i,j);
        }
        printf("\n");
    }
}

int main(int argc, const char *argv[]) {
    printf("\n-- Ex1 --\n");
    Ex1();
    printf("\n-- Ex2 & Ex3 --\n");
    Ex2();     
    printf("\n-- Ex4 --\n");
    Ex4();     
    printf("\n-- Ex5 --\n");
    Ex5();     
    return 0;
}
