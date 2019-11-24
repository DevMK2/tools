CC=gcc
CFLAGS=-c -o
CPP=g++

assertDir=../src/assert
cassertSrc=${assertDir}/Assert.c
ccassertSrc=${assertDir}/Assert.cc

default: before cassert ccassert after

before:
	rm -rf lib
	mkdir lib

cassert: AssertC.o
	ar crv lib/libbluec.a AssertC.o

ccassert: AssertCC.o
	ar crv lib/libbluecc.a AssertCC.o

after:
	rm -rf *.o

AssertC.o:
	$(CC) $(CFLAGS) $@ $(cassertSrc)

AssertCC.o:
	$(CPP) $(CFLAGS) $@ $(ccassertSrc)

clean:
	rm -rf lib
	rm -rf *.o
	rm -rf *.a
