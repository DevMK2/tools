#ifndef __TIME_CHECK__
#define __TIME_CHECK__

#ifndef ITERATION
#define ITERATION 100000
#endif

#include <stdio.h>
#include <time.h>

clock_t E_CHECKER_START, E_CHECKER_END;

#define     START_TIME_CHECK    E_CHECKER_START= clock(); for(int i = ITERATION; i!=0; --i) {
  /***** do something beautiful *****/
#define     END_TIME_CHECK      } E_CHECKER_END= clock(); fprintf(stdout, "iteration : %d, execution time : %fms \n", ITERATION, (double)(E_CHECKER_END- E_CHECKER_START));

#endif
