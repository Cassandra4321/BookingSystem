using BookingSystem.API.Dtos;
using BookingSystem.API.Helpers;

namespace BookingSystem.Tests
{
    public class CsvExportTests
    {
        [Fact]
        public void GenerateCsv_ShouldContainCorrectHeadersAndValues()
        {
            // Arrange
            var bookings = new List<BookingOutputDto>
            {
                new BookingOutputDto
                {
                    WorkoutClassName = "Yoga",
                    Description = "A relaxing yoga class.",
                    StartDate = new DateTime(2025, 05, 10, 10, 0, 0),
                    EndDate = new DateTime(2025, 05, 10, 11, 0, 0)
                },
                new BookingOutputDto
                {
                    WorkoutClassName = "Pilates",
                    Description = "A strengthening Pilates class.",
                    StartDate = DateTime.Now.AddDays(2),
                    EndDate = DateTime.Now.AddDays(2).AddHours(1)
                }
            };

            // Act
            var csvResult = CsvHelper.GenerateCsv(bookings);

            // Assert
            Assert.Contains("Passnamn,Beskrivning,Starttid,Sluttid", csvResult);
            Assert.Contains("Yoga,", csvResult);
            Assert.Contains("A relaxing yoga class.", csvResult);
            Assert.Contains("2025-05-10 10:00", csvResult);
        }

        [Fact]
        public void GenerateCsv_ShouldFormatDatesCorrectly()
        {
            var booking = new BookingOutputDto
            {
                WorkoutClassName = "Boxning",
                Description = "Högintensiv träning",
                StartDate = new DateTime(2025, 12, 24, 18, 30, 0),
                EndDate = new DateTime(2025, 12, 24, 19, 30, 0)
            };

            var csv = CsvHelper.GenerateCsv(new List<BookingOutputDto> { booking });

            Assert.Contains("2025-12-24 18:30", csv);
            Assert.Contains("2025-12-24 19:30", csv);
        }


        [Fact]
        public void EscapeCsv_ShouldEscapeSpecialCharacters()
        {
            // Arrange
            var input = "Ett \"citat\" här";

            // Act
            var escaped = CsvHelper.EscapeCsv(input);

            // Assert
            Assert.Equal("\"Ett \"\"citat\"\" här\"", escaped);
        }
    }
}
