#include <gtest/gtest.h>
#include "skeleton.cc"

int main(int argc, char *argv[]) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}

namespace EXAMPLE
{/*FIXME GTEST EXAMPLE*/
bool gtest_example() {
    // ASSERT_TRUE(val);
    // ASSERT_FALSE(val);
    // ASSERT_EQ(A, B);
    // ASSERT_NE(A, B);
    // ASSERT_LT(A, B);  // A<B
    // ASSERT_LE(A, B);  // A<=B
    // ASSERT_GT(A, B);  // A>B
    // ASSERT_GE(A, B);  // A>=B
    // ASSERT_STREQ(A, B); // String equal
    // ASSERT_STRNE(A, B); // String not equal
    return true;
}

TEST(GTest_Example, Assert_True) {
    EXPECT_EQ(gtest_example(), true);
}

TEST(GTest_Example, Assert_False) {
    EXPECT_NE(gtest_example(), false);
}
}/*FIXME GTEST EXAMPLE*/
