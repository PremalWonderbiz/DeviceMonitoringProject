namespace DeviceMonitoring.Tests
{
    public class UnitTest1
    {
        [Fact] // This attribute marks this method as a test.
        public void ShouldAddTwoNumbers()
        {
            // Arrange
            int a = 3;
            int b = 5;

            // Act
            int result = a + b;

            // Assert
            Assert.Equal(8, result); // Check if the result is as expected.
        }

        public static IEnumerable<object[]> TestData()
        {
            yield return new object[] { 3, 5, 8 }; // Input values and expected result
            yield return new object[] { 0, 0, 0 };
            yield return new object[] { -3, 3, 0 };
        }

        [Theory]
        [MemberData(nameof(TestData))] // Link to your data source
        public void Add_ShouldCalculateCorrectly(int a, int b, int expected)
        {
            // Act
            int result = a + b;

            // Assert
            Assert.Equal(expected, result);
        }
    }
}